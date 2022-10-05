import type { FC } from "react"
import NextLink from "next/link"
import type { LinkProps } from "next/link"
import { IconButton } from "@chakra-ui/react"
import type { IconButtonProps } from "@chakra-ui/react"

interface IconButtonLinkProps extends IconButtonProps {
  href: LinkProps["href"]
  target?: "_blank"
  download?: string
}

const IconButtonLink: FC<IconButtonLinkProps> = ({
  href,
  variant = "ghost",
  size = "md",
  colorScheme = "teal",
  ...props
}) => {
  return (
    <NextLink href={href} passHref>
      <IconButton
        as="a"
        variant={variant}
        size={size}
        colorScheme={colorScheme}
        {...props}
      />
    </NextLink>
  )
}

export default IconButtonLink
