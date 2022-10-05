import type { FC } from "react"
import { Avatar as ChakraAvatar } from "@chakra-ui/react"
import type { AvatarProps as ChakraAvatarProps } from "@chakra-ui/react"
import { useSupabaseStorageUrl } from "@/hooks"

interface AvatarProps extends ChakraAvatarProps {
  storageBucket: string
  path: string
}

const Avatar: FC<AvatarProps> = ({
  storageBucket,
  path,
  fontFamily = "heading",
  color = "yellow.700",
  bg = "yellow.200",
  ...props
}) => {
  const [avatarUrl] = useSupabaseStorageUrl(storageBucket, path)

  return (
    <ChakraAvatar
      src={avatarUrl}
      fontFamily={fontFamily}
      color={color}
      bg={bg}
      {...props}
    />
  )
}

export default Avatar
