import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import getContactIdsByTagId from "./getContactIdsByTagId"

async function addContactToTag(
  tagId: string,
  contactId: string,
): Promise<void> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id)
      throw new Error("Can't add contact to tag: user is not logged in")

    const existingContactIds = await getContactIdsByTagId(tagId)

    if (
      Array.isArray(existingContactIds) &&
      existingContactIds.some((id) => id === contactId)
    ) {
      throw new Error("Contact already has tag")
    }

    const { error, status } = await supabaseClient
      .from("contacts_tagmap")
      .upsert(
        {
          user_id: user.id,
          contact_id: contactId,
          tag_id: tagId,
        },
        { returning: "minimal" },
      )

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default addContactToTag
