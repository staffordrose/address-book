import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function addUserAvatarUrl(url: string): Promise<void> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id) throw new Error("User not logged in")

    let { error, status } = await supabaseClient.from("profiles").upsert(
      { id: user.id, avatar_url: url, updated_at: new Date() },
      {
        returning: "minimal",
      },
    )

    if (error && status !== 406) throw error
  } catch (error: any) {
    throw error
  }
}

export default addUserAvatarUrl
