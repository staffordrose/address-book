import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function deleteAllContactsFromTag(tagId: string): Promise<void> {
  try {
    const { error, status } = await supabaseClient
      .from("contacts_tagmap")
      .delete({ returning: "minimal" })
      .match({
        tag_id: tagId,
      })

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default deleteAllContactsFromTag
