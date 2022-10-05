import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { Contact } from "@/common/types"

async function updateContact(contact: Contact): Promise<string> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id)
      throw new Error("Can't update contact: user is not logged in")

    const {
      id,
      first_name,
      middle_name,
      last_name,
      nickname,
      gender,
      gender_other,
      email_addresses,
      phone_numbers,
      mailing_addresses,
      company,
      department,
      occupation,
      dates,
      urls,
      notes,
    } = contact

    let { error, status } = await supabaseClient.from("contacts").upsert(
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
        updated_at: new Date(),
      },
      { returning: "minimal" },
    )

    if (error && status !== 406) throw error

    await Promise.all([
      await updateTableRows({
        table: "contact_email_addresses",
        userId: user.id,
        contactId: id,
        rows: email_addresses,
      }),
      await updateTableRows({
        table: "contact_phone_numbers",
        userId: user.id,
        contactId: id,
        rows: phone_numbers,
      }),
      await updateTableRows({
        table: "contact_mailing_addresses",
        userId: user.id,
        contactId: id,
        rows: mailing_addresses,
      }),
      await updateTableRows({
        table: "contact_dates",
        userId: user.id,
        contactId: id,
        rows: dates,
      }),
      await updateTableRows({
        table: "contact_urls",
        userId: user.id,
        contactId: id,
        rows: urls,
      }),
      await updateTableRows({
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

interface UpdateTableRows {
  table: string
  userId: string
  contactId: string
  rows: any[]
}

async function updateTableRows({
  table,
  userId,
  contactId,
  rows,
}: UpdateTableRows) {
  if (Array.isArray(rows) && rows.length) {
    const promiseArray = rows.map(async (row) => {
      let { error, status } = await supabaseClient.from(table).upsert(
        {
          contact_id: contactId,
          user_id: userId,
          ...row,
          updated_at: new Date(),
        },
        {
          returning: "minimal",
        },
      )

      if (error && status !== 406) throw error

      return false
    })

    return Promise.all(promiseArray)
  } else {
    return Promise.resolve(false)
  }
}

export default updateContact
