import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function removeUserAvatarUrl(): Promise<void> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id) throw new Error("Can't remove avatar: user not logged in")

    let { error, status } = await supabaseClient.from("profiles").upsert(
      { id: user.id, avatar_url: null, updated_at: new Date() },
      {
        returning: "minimal",
      },
    )

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default removeUserAvatarUrl
