import { Profile } from "@/common/types"

export const mapPropsToValues = (profile: Profile) => {
  return {
    id: profile.id,
    first_name: profile.first_name || "",
    middle_name: profile.middle_name || "",
    last_name: profile.last_name || "",
  }
}
