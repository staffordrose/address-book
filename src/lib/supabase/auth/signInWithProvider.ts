import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"

interface SignInWithProvider {
  provider: "google"
  redirectTo?: string
}

async function signInWithProvider({
  provider,
  redirectTo,
}: SignInWithProvider): Promise<{
  user: User | null
}> {
  try {
    const { user, error } = await supabaseClient.auth.signIn(
      { provider },
      { redirectTo },
    )

    if (error) throw error

    return { user }
  } catch (error) {
    throw error
  }
}

export default signInWithProvider
