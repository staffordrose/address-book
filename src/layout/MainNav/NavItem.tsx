import type { FC } from "react"
import NextLink from "next/link"
import type { NextRouter } from "next/router"
import { Button, ListItem } from "@chakra-ui/react"
import type { ButtonProps } from "@chakra-ui/react"

interface NavItemProps extends ButtonProps {
  router: NextRouter
  onClose?: () => void
  href: string
}

const NavItem: FC<NavItemProps> = ({
  router,
  onClose,
  href,
  leftIcon,
  ...props
}) => {
  const isActive = router.asPath === href

  return (
    <ListItem>
      <NextLink href={href} passHref>
        <Button
          {...props}
          as="a"
          variant="unstyled"
          display="flex"
          justifyContent="flex-start"
          w="full"
          pl={3}
          pr={3}
          fontSize="md"
          _hover={{ bg: "teal.50" }}
          _focus={{ bg: "teal.100" }}
          _active={{ bg: "teal.100" }}
          isActive={isActive}
          leftIcon={leftIcon}
          onClick={() => {
            if (typeof onClose === "function") {
              onClose()
            }
          }}
        />
      </NextLink>
    </ListItem>
  )
}

export default NavItem
