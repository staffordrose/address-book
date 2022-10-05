import { supabaseClient } from "@supabase/auth-helpers-nextjs"

async function uploadFileToBucket(
  bucket: string,
  path: string,
  file: File,
): Promise<void> {
  try {
    let { error } = await supabaseClient.storage.from(bucket).upload(path, file)

    if (error) throw error
  } catch (error) {
    throw error
  }
}

export default uploadFileToBucket
