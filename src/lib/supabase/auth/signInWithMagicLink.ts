import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"

interface SignInWithMagicLink {
  email: string
  redirectTo?: string
}

async function signInWithMagicLink({
  email,
  redirectTo,
}: SignInWithMagicLink): Promise<{
  user: User | null
}> {
  try {
    const { user, error } = await supabaseClient.auth.signIn(
      { email },
      { redirectTo },
    )

    if (error) throw error

    return { user }
  } catch (error) {
    throw error
  }
}

export default signInWithMagicLink
