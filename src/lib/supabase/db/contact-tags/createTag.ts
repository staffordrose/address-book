import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import getTagIdByName from "./getTagIdByName"

async function createTag(name: string): Promise<string | null> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id)
      throw new Error("Can't create contact tag: user is not logged in")

    const tagId = await getTagIdByName(name)

    if (tagId) throw new Error("Cant create contact tag: tag already exists")

    const { data, error, status } = await supabaseClient
      .from("contact_tags")
      .upsert({
        user_id: user.id,
        name,
      })

    if (error && status !== 406) throw error

    if (!data?.[0]?.id) return null

    return data[0].id
  } catch (error) {
    throw error
  }
}

export default createTag
