import type { FC } from "react"
import NextLink from "next/link"
import { Link as ChakraLink } from "@chakra-ui/react"
import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react"

interface LinkProps extends ChakraLinkProps {
  href: string
}

const Link: FC<LinkProps> = ({ href, ...props }) => {
  const regEx = /^http/

  return regEx.test(href) ? (
    <ChakraLink {...props} href={href} isExternal />
  ) : (
    <NextLink href={href} passHref>
      <ChakraLink {...props} />
    </NextLink>
  )
}

export default Link
