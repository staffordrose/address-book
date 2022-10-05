import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { Profile } from "@/common/types"

async function getUserProfile(userId?: string): Promise<Profile> {
  try {
    const user = supabaseClient.auth.user()

    if (!userId && !user?.id) throw new Error("User not logged in")

    const id = userId || user?.id

    const { data, error, status } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()

    if (error && status !== 406) throw error

    return data
  } catch (error) {
    throw error
  }
}

export default getUserProfile
