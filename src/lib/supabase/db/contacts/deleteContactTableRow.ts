import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function deleteContactTableRow(
  table:
    | "contact_email_addresses"
    | "contact_phone_numbers"
    | "contact_mailing_addresses"
    | "contact_dates"
    | "contact_urls"
    | "contact_notes",
  id: string,
): Promise<void> {
  try {
    let { error, status } = await supabaseClient.from(table).delete().match({
      id,
    })

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default deleteContactTableRow
