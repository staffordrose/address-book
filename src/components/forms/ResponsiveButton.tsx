import type { FC } from "react"
import { Button as ChakraButton, IconButton } from "@chakra-ui/react"
import type { ButtonProps } from "@chakra-ui/react"

interface ResponsiveButtonProps extends ButtonProps {
  "aria-label": string
}

const ResponsiveButton: FC<ResponsiveButtonProps> = ({
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
      <IconButton
        variant={variant}
        size={size}
        colorScheme={colorScheme}
        display={["inline-flex", "none"]}
        visibility={["visible", "hidden"]}
        icon={leftIcon}
        {...props}
      />
      <ChakraButton
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
    </>
  )
}

export default ResponsiveButton
