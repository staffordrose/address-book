import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import deleteAllContactsFromTag from "./deleteAllContactsFromTag"

async function deleteTag(id: string): Promise<void> {
  try {
    await deleteAllContactsFromTag(id)

    const { error, status } = await supabaseClient
      .from("contact_tags")
      .delete({ returning: "minimal" })
      .match({ id })

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default deleteTag
