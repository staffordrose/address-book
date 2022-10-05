import { useEffect, useState } from "react"
import { getFilePublicURL } from "@/lib/supabase"

const useSupabaseStorageUrl = (storageBucket: string, path: string) => {
  const [url, setUrl] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const getUrl = async () => {
      setLoading(true)

      try {
        const publicURL = await getFilePublicURL(storageBucket, path)

        if (publicURL) setUrl(publicURL)
      } catch (error: any) {
        console.log("Error getting url from supabase storage: ", error.message)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    if (storageBucket && path) getUrl()
  }, [storageBucket, path])

  return [url, isLoading, error]
}

export default useSupabaseStorageUrl
