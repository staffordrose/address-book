import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function deleteAllTagsFromContact(contactId: string): Promise<void> {
  try {
    const { error, status } = await supabaseClient
      .from("contacts_tagmap")
      .delete({ returning: "minimal" })
      .match({
        contact_id: contactId,
      })

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default deleteAllTagsFromContact
