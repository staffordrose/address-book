import type { FC } from "react"
import NextLink from "next/link"
import type { LinkProps } from "next/link"
import { Button } from "@chakra-ui/react"
import type { ButtonProps } from "@chakra-ui/react"

interface ButtonLinkProps extends ButtonProps {
  href: LinkProps["href"]
  download?: string
}

const ButtonLink: FC<ButtonLinkProps> = ({
  href,
  variant = "ghost",
  size = "md",
  colorScheme = "teal",
  pl = "12px",
  pr = "16px",
  ...props
}) => {
  return (
    <NextLink href={href} passHref>
      <Button
        as="a"
        variant={variant}
        size={size}
        colorScheme={colorScheme}
        pl={pl}
        pr={pr}
        {...props}
      />
    </NextLink>
  )
}

export default ButtonLink
