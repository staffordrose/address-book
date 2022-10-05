import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import getContactIdsByTagId from "./getContactIdsByTagId"

async function deleteContactsFromTag(
  tagId: string,
  contactIds: string[],
): Promise<void> {
  try {
    const existingContactIds = await getContactIdsByTagId(tagId)

    const filtered =
      Array.isArray(existingContactIds) && existingContactIds.length
        ? contactIds.filter((contactId) =>
            existingContactIds?.some((id) => id === contactId),
          )
        : []

    if (!filtered.length) return

    const { error, status } = await supabaseClient
      .from("contacts_tagmap")
      .delete({ returning: "minimal" })
      .match({ tag_id: tagId })
      .in("contact_id", filtered)

    if (error && status !== 406) throw error
  } catch (error) {
    throw error
  }
}

export default deleteContactsFromTag
