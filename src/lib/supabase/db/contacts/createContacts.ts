import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuid } from "uuid"
import { Contact } from "@/common/types"

async function createContacts(contacts: Contact[]): Promise<void> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id)
      throw new Error("Can't create contact: user is not logged in")

    const contactsWithIdAndUser: Contact[] = contacts.map((contact) => ({
      ...contact,
      id: contact.id || uuid(),
      user_id: user.id,
    }))

    const contactsToInsert = contactsWithIdAndUser.map(
      ({
        id,
        user_id,
        avatar_url = "",
        first_name = "",
        middle_name = "",
        last_name = "",
        nickname = "",
        gender = "",
        gender_other = "",
        company = "",
        department = "",
        occupation = "",
      }) => ({
        id,
        user_id,
        avatar_url,
        first_name,
        middle_name,
        last_name,
        nickname,
        gender,
        gender_other,
        company,
        department,
        occupation,
      }),
    )

    let { error, status } = await supabaseClient
      .from("contacts")
      .upsert(contactsToInsert, { returning: "minimal" })

    if (error && status !== 406) throw error

    const addContactAndUserToRows = (
      resource:
        | "email_addresses"
        | "phone_numbers"
        | "mailing_addresses"
        | "dates"
        | "urls"
        | "notes",
    ) => {
      return contactsWithIdAndUser.reduce(
        (accum, { id: contactId, user_id, ...contact }) => {
          const items = contact[resource]

          if (Array.isArray(items) && items.length) {
            accum = accum.concat(
              items.map(({ id, ...item }) => ({
                ...item,
                contact_id: contactId,
                user_id,
              })),
            )
          }
          return accum
        },
        [] as any[],
      )
    }

    await Promise.all([
      await createTableRows({
        table: "contact_email_addresses",
        rows: addContactAndUserToRows("email_addresses"),
      }),
      await createTableRows({
        table: "contact_phone_numbers",
        rows: addContactAndUserToRows("phone_numbers"),
      }),
      await createTableRows({
        table: "contact_mailing_addresses",
        rows: addContactAndUserToRows("mailing_addresses"),
      }),
      await createTableRows({
        table: "contact_dates",
        rows: addContactAndUserToRows("dates"),
      }),
      await createTableRows({
        table: "contact_urls",
        rows: addContactAndUserToRows("urls"),
      }),
      await createTableRows({
        table: "contact_notes",
        rows: addContactAndUserToRows("notes"),
      }),
    ])
  } catch (error) {
    throw error
  }
}

async function createTableRows({
  table,
  rows,
}: {
  table: string
  rows: any[]
}): Promise<void> {
  if (Array.isArray(rows) && rows.length) {
    try {
      let { error, status } = await supabaseClient.from(table).insert(rows, {
        returning: "minimal",
      })

      if (error && status !== 406) throw error
    } catch (error) {
      throw error
    }
  }
}

export default createContacts
