import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { Contact } from "@/common/types"

async function searchContacts(query: string): Promise<Contact[]> {
  try {
    const { data, error, status } = await supabaseClient
      .from("contacts")
      .select("*")
      .textSearch("fts", `${query}:*`)

    if (error && status !== 406) throw error

    if (data === null) return []

    return data
  } catch (error) {
    throw error
  }
}

export default searchContacts
