import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { Profile } from "@/common/types"

async function updateUserProfile(profile: Profile): Promise<void> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id) throw new Error("User not logged in")

    const {
      first_name,
      middle_name,
      last_name,
      phone_number,
      street_address,
      city,
      state,
      zip,
      birthday,
      company,
      occupation,
      website,
    } = profile

    let { error, status } = await supabaseClient.from("profiles").upsert(
      {
        id: user.id,
        first_name,
        middle_name,
        last_name,
        phone_number,
        street_address,
        city,
        state,
        zip,
        birthday,
        company,
        occupation,
        website,
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

export default updateUserProfile
