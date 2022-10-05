import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function deleteFileFromBucket(
  bucket: string,
  path: string,
): Promise<void> {
  try {
    let { error } = await supabaseClient.storage.from(bucket).remove([path])

    if (error) throw error
  } catch (error) {
    throw error
  }
}

export default deleteFileFromBucket
