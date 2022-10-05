import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function updateTag(id: string, name: string): Promise<void> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id)
      throw new Error("Can't update contact tag: user is not logged in")

    const { error, status } = await supabaseClient.from("contact_tags").upsert(
      {
        id,
        user_id: user.id,
        name,
      },
      { returning: "minimal" },
    )

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default updateTag
