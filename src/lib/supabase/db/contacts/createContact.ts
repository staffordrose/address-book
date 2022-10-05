import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuid } from "uuid"
import { Contact } from "@/common/types"

async function createContact(contact: Contact): Promise<string> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id)
      throw new Error("Can't create contact: user is not logged in")

    const {
      id = uuid(),
      first_name = "",
      middle_name = "",
      last_name = "",
      nickname = "",
      gender = "",
      gender_other = "",
      email_addresses = [],
      phone_numbers = [],
      mailing_addresses = [],
      company = "",
      department = "",
      occupation = "",
      dates = [],
      urls = [],
      notes = [],
    } = contact

    let { error, status } = await supabaseClient.from("contacts").upsert(
      [
        {
          id,
          user_id: user.id,
          first_name,
          middle_name,
          last_name,
          nickname,
          gender,
          gender_other,
          company,
          department,
          occupation,
        },
      ],
      { returning: "minimal" },
    )

    if (error && status !== 406) throw error

    await Promise.all([
      await createTableRows({
        table: "contact_email_addresses",
        userId: user.id,
        contactId: id,
        rows: email_addresses,
      }),
      await createTableRows({
        table: "contact_phone_numbers",
        userId: user.id,
        contactId: id,
        rows: phone_numbers,
      }),
      await createTableRows({
        table: "contact_mailing_addresses",
        userId: user.id,
        contactId: id,
        rows: mailing_addresses,
      }),
      await createTableRows({
        table: "contact_dates",
        userId: user.id,
        contactId: id,
        rows: dates,
      }),
      await createTableRows({
        table: "contact_urls",
        userId: user.id,
        contactId: id,
        rows: urls,
      }),
      await createTableRows({
        table: "contact_notes",
        userId: user.id,
        contactId: id,
        rows: notes,
      }),
    ])

    return id
  } catch (error) {
    throw error
  }
}

async function createTableRows({
  table,
  userId,
  contactId,
  rows,
}: {
  table: string
  userId: string
  contactId: string
  rows: any[]
}): Promise<void> {
  if (Array.isArray(rows) && rows.length) {
    try {
      let { error, status } = await supabaseClient.from(table).insert(
        rows.map((row) => ({
          contact_id: contactId,
          user_id: userId,
          ...row,
        })),
        {
          returning: "minimal",
        },
      )

      if (error && status !== 406) throw error
    } catch (error) {
      throw error
    }
  }
}

export default createContact
