import type { FC } from "react"
import NextLink from "next/link"
import type { LinkProps } from "next/link"
import { Button as ChakraButton, IconButton } from "@chakra-ui/react"
import type { ButtonProps } from "@chakra-ui/react"

interface ResponsiveButtonLinkProps extends ButtonProps {
  href: LinkProps["href"]
  download?: string
  "aria-label": string
}

const ResponsiveButtonLink: FC<ResponsiveButtonLinkProps> = ({
  href,
  variant = "ghost",
  size = "md",
  colorScheme = "teal",
  pl = "12px",
  pr = "16px",
  leftIcon,
  children,
  ...props
}) => {
  return (
    <>
      <NextLink href={href} passHref>
        <IconButton
          as="a"
          variant={variant}
          size={size}
          colorScheme={colorScheme}
          display={["inline-flex", "none"]}
          visibility={["visible", "hidden"]}
          icon={leftIcon}
          {...props}
        />
      </NextLink>

      <NextLink href={href} passHref>
        <ChakraButton
          as="a"
          variant={variant}
          size={size}
          colorScheme={colorScheme}
          display={["none", "inline-flex"]}
          visibility={["hidden", "visible"]}
          pl={pl}
          pr={pr}
          leftIcon={leftIcon}
          {...props}
        >
          {children}
        </ChakraButton>
      </NextLink>
    </>
  )
}

export default ResponsiveButtonLink
