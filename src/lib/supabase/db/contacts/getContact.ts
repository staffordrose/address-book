import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { Contact } from "@/common/types"

async function getContact(id: string): Promise<Contact> {
  try {
    const { data, error, status } = await supabaseClient
      .from("contacts")
      .select(
        `*,
        email_addresses: contact_email_addresses(*),
        phone_numbers: contact_phone_numbers(*),
        mailing_addresses: contact_mailing_addresses(*),
        dates: contact_dates(*),
        urls: contact_urls(*),
        notes: contact_notes(*)`,
      )
      .eq("id", id)
      .single()

    if (error && status !== 406) throw error

    return data
  } catch (error) {
    throw error
  }
}

export default getContact
