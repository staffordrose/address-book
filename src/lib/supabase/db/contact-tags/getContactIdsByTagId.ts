import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function getContactIdsByTagId(tagId: string): Promise<string[]> {
  try {
    const { data, error, status } = await supabaseClient
      .from("contacts_tagmap")
      .select("contact_id")
      .eq("tag_id", tagId)

    if (error && status !== 406) throw error

    if (data === null) return []

    return data
  } catch (error) {
    throw error
  }
}

export default getContactIdsByTagId
