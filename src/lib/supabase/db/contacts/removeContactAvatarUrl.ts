import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function removeContactAvatarUrl(id: string): Promise<void> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id)
      throw new Error("Can't remove contact avatar: user not found")

    let { error, status } = await supabaseClient.from("contacts").upsert(
      {
        id,
        user_id: user.id,
        avatar_url: null,
        updated_at: new Date(),
      },
      {
        returning: "minimal",
      },
    )

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default removeContactAvatarUrl
