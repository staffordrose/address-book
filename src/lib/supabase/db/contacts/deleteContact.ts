import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { deleteFileFromBucket } from "../../storage"

async function deleteContact(id: string): Promise<void> {
  try {
    await Promise.all([
      await deleteTableRows("contacts_tagmap", id),
      await deleteTableRows("contact_email_addresses", id),
      await deleteTableRows("contact_phone_numbers", id),
      await deleteTableRows("contact_mailing_addresses", id),
      await deleteTableRows("contact_dates", id),
      await deleteTableRows("contact_urls", id),
      await deleteTableRows("contact_notes", id),
    ])

    let { data: contactData } = await supabaseClient
      .from("contacts")
      .select(`avatar_url`)
      .eq("id", id)
      .single()

    if (contactData.avatar_url) {
      await deleteFileFromBucket("contacts.avatars", contactData.avatar_url)
    }

    let { error, status } = await supabaseClient
      .from("contacts")
      .delete()
      .match({ id })

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

async function deleteTableRows(
  table: string,
  contactId: string,
): Promise<void> {
  try {
    let { error, status } = await supabaseClient.from(table).delete().match({
      contact_id: contactId,
    })

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default deleteContact
