import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function getContactsCount(userId?: string): Promise<number> {
  try {
    const user = supabaseClient.auth.user()

    if (!userId && !user?.id) throw new Error("User not logged in")

    const { count, error, status } = await supabaseClient
      .from("contacts")
      .select("id", { count: "exact" })
      .eq("user_id", userId || user?.id)

    if (error && status !== 406) throw error

    if (!count) return 0

    return count
  } catch (error) {
    throw error
  }
}

export default getContactsCount
