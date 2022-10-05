import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import getContactIdsByTagId from "./getContactIdsByTagId"

async function addContactsToTag(
  tagId: string,
  contactIds: string[],
): Promise<void> {
  try {
    const user = supabaseClient.auth.user()

    if (!user?.id)
      throw new Error("Can't add contacts to tag: user is not logged in")

    const existingContactIds = await getContactIdsByTagId(tagId)

    const filtered =
      Array.isArray(existingContactIds) && existingContactIds.length
        ? contactIds.filter(
            (contactId) => !existingContactIds?.some((id) => id === contactId),
          )
        : contactIds

    if (!filtered.length) return

    const { error, status } = await supabaseClient
      .from("contacts_tagmap")
      .upsert(
        filtered.map((contactId) => ({
          user_id: user.id,
          contact_id: contactId,
          tag_id: tagId,
        })),
        { returning: "minimal" },
      )

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default addContactsToTag
