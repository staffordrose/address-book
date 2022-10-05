import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { ContactTag } from "@/common/types"

async function getTagContacts(id: string): Promise<ContactTag | null> {
  try {
    const { data, error, status } = await supabaseClient
      .from("contact_tags")
      .select(
        `
        id,
        name,
        contacts(
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
        )
      `,
      )
      .eq("id", id)
      .single()

    if (error && status !== 406) throw error

    return data
  } catch (error) {
    throw error
  }
}

export default getTagContacts
