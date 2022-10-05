import { useEffect, useState } from "react"
import type { User } from "@supabase/auth-helpers-nextjs"
import { Profile } from "@/common/types"
import { getUserProfile } from "@/lib/supabase"

const useUserProfile = (user: User | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const getProfile = async (userId: User["id"]) => {
      setLoading(true)

      try {
        const data = await getUserProfile(userId)

        setProfile(data)
      } catch (error: any) {
        console.log("Error getting user profile from supabase: ", error.message)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) getProfile(user.id)
  }, [user])

  return [profile, isLoading, error]
}

export default useUserProfile
