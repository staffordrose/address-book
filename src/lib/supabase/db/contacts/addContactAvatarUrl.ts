import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function addContactAvatarUrl(
  contactId: string,
  avatarUrl: string,
): Promise<void> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id) throw new Error("Can't add contact avatar: user not found")

    let { error, status } = await supabaseClient.from("contacts").upsert(
      {
        id: contactId,
        user_id: user.id,
        avatar_url: avatarUrl,
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

export default addContactAvatarUrl
