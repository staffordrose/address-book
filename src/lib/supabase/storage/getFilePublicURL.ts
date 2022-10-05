import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function getFilePublicURL(
  bucket: string,
  path: string,
): Promise<string | null> {
  try {
    const { publicURL, error } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path)

    if (error) throw error

    return publicURL
  } catch (error) {
    throw error
  }
}

export default getFilePublicURL
