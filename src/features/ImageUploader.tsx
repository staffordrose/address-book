import { useEffect, useState } from "react"
import type { FC } from "react"
import { Button, Center, Input, Text } from "@chakra-ui/react"
import { deleteFileFromBucket, uploadFileToBucket } from "@/lib/supabase"

interface ImageUploaderProps {
  storageBucket: string
  path?: string
  size?: number
  onDelete?: () => void
  onUpload: (filePath: string) => void
}

const ImageUploader: FC<ImageUploaderProps> = ({
  storageBucket,
  path = "",
  size = 180,
  onDelete,
  onUpload,
}) => {
  const [imagePath, setImagePath] = useState("")
  const [isDeleting, setDeleting] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (path) {
      setImagePath(path)
    }
  }, [path])

  const handleDelete = async () => {
    setError("")
    setDeleting(true)

    try {
      await deleteFileFromBucket(storageBucket, path)

      setImagePath("")

      if (onDelete) onDelete()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  const handleUpload = async (event: any) => {
    setError("")
    setUploading(true)

    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      await uploadFileToBucket(storageBucket, filePath, file)

      setImagePath(filePath)

      onUpload(filePath)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setUploading(false)
    }
  }

  if (imagePath) {
    return (
      <Center w={size}>
        <Button
          variant="outline"
          size="sm"
          colorScheme="red"
          type="button"
          isLoading={isDeleting}
          loadingText="Deleting"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          Remove Photo
        </Button>
        {!!error && <Text color="red.500">{error}</Text>}
      </Center>
    )
  }

  return (
    <Center w={size}>
      <Button
        as="label"
        size="sm"
        type="button"
        isLoading={isUploading}
        loadingText="Uploading"
        htmlFor={`${storageBucket}_url`}
        cursor="pointer"
      >
        Add Photo
      </Button>
      <Input
        position="absolute"
        visibility="hidden"
        id={`${storageBucket}_url`}
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={handleUpload}
      />
      {!!error && <Text color="red.500">{error}</Text>}
    </Center>
  )
}

export default ImageUploader
