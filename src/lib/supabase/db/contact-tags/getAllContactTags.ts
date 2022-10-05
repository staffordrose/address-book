import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { ContactTag } from "@/common/types"

async function getAllContactTags(): Promise<ContactTag[]> {
  try {
    const { data, error, status } = await supabaseClient
      .from("contact_tags")
      .select(
        `
        id,
        name,
        contacts(id)
      `,
      )

    if (error && status !== 406) throw error

    if (data === null) return []

    return data
  } catch (error) {
    throw error
  }
}

export default getAllContactTags
