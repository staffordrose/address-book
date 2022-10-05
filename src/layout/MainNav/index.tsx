import type { FC } from "react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { Box, Button, Divider, Icon, List, ListItem } from "@chakra-ui/react"
import { MdAdd, MdFileDownload, MdFileUpload } from "react-icons/md"
import Contacts from "./Contacts"
import Labels from "./Labels"
import NavItem from "./NavItem"

interface MainNavProps {
  onClose?: () => void
}

const MainNav: FC<MainNavProps> = ({ onClose }) => {
  const router = useRouter()

  return (
    <Box as="nav">
      <List spacing={2} p={2}>
        <Contacts router={router} onClose={onClose} />

        <Divider />

        <Labels router={router} onClose={onClose} />

        <Divider />

        <NavItem
          router={router}
          onClose={onClose}
          href="/import"
          leftIcon={<Icon as={MdFileUpload} boxSize={6} color="teal.600" />}
        >
          Import
        </NavItem>

        <NavItem
          router={router}
          onClose={onClose}
          href="/export"
          leftIcon={<Icon as={MdFileDownload} boxSize={6} color="teal.600" />}
        >
          Export
        </NavItem>

        <Divider />

        <ListItem>
          <NextLink
            href={{
              pathname: "/contacts/add",
              query: router.query?.tagId
                ? { label: router.query.tagId }
                : undefined,
            }}
            passHref
          >
            <Button
              as="a"
              variant="solid"
              size="lg"
              colorScheme="teal"
              w="full"
              leftIcon={<Icon as={MdAdd} boxSize={7} />}
            >
              Add Contact
            </Button>
          </NextLink>
        </ListItem>
      </List>
    </Box>
  )
}

export default MainNav
