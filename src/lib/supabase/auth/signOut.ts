import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function signOut(): Promise<void> {
  try {
    await supabaseClient.auth.signOut()
  } catch (error) {
    throw error
  }
}

export default signOut
