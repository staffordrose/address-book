import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function getTagIdByName(name: string): Promise<string | null> {
  try {
    const { data, error, status } = await supabaseClient
      .from("contact_tags")
      .select("id")
      .eq("name", name)
      .maybeSingle()

    if (error && status !== 406) throw error

    if (!data?.id) return null

    return data.id
  } catch (error) {
    throw error
  }
}

export default getTagIdByName
