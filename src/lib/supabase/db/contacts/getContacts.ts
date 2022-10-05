import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { Contact } from "@/common/types"

async function getContacts(userId: string): Promise<Contact[]> {
  try {
    if (!userId) throw new Error("User not logged in")

    const { data, error, status } = await supabaseClient
      .from("contacts")
      .select(
        `
        id,
        avatar_url,
        first_name,
        middle_name,
        last_name,
        email_addresses: contact_email_addresses(
          is_primary,
          email_order,
          email_address
        ),
        phone_numbers: contact_phone_numbers(
          is_primary,
          phone_order,
          phone_number
        ),
        tags: contact_tags(id, name)
      `,
      )
      .eq("user_id", userId)
      .order("first_name", { ascending: true })

    if (error && status !== 406) throw error

    if (data === null) return []

    return data
  } catch (error) {
    throw error
  }
}

export default getContacts
