import type { FC } from "react"
import type { NextRouter } from "next/router"
import {
  Flex,
  Grid,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
} from "@chakra-ui/react"
import {
  MdArrowDropDown,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdClose,
  MdIndeterminateCheckBox,
} from "react-icons/md"
import { CheckboxValue, Contact } from "@/common/types"
import DeleteContacts from "./DeleteContacts"
import LabelManager from "./LabelManager"

interface ContactsCABProps {
  router: NextRouter
  toggleMode: () => void
  selectedContacts: CheckboxValue[]
  setValue: (value: string[]) => void
  contacts: Contact[]
}

const ContactsCAB: FC<ContactsCABProps> = ({
  router,
  toggleMode,
  selectedContacts,
  setValue,
  contacts,
}) => {
  return (
    <Grid
      position="sticky"
      zIndex={1200}
      top={16}
      templateColumns="repeat(2, auto)"
      gap={2}
      justifyContent="space-between"
      alignItems="center"
      w="full"
      h={12}
      px={2}
      borderBottomWidth={2}
      borderBottomStyle="solid"
      borderBottomColor="teal.500"
      bg="#fffff7"
    >
      <Flex gap={2}>
        <IconButton
          variant="ghost"
          colorScheme="teal"
          aria-label={"Close selections menu"}
          icon={<Icon as={MdClose} boxSize={7} />}
          onClick={toggleMode}
        />

        <Menu>
          <Flex>
            <IconButton
              variant="ghost"
              colorScheme="teal"
              borderRightRadius={0}
              aria-label="Toggle selections"
              icon={
                <Icon
                  as={
                    selectedContacts.length
                      ? selectedContacts.length === contacts.length
                        ? MdCheckBox
                        : MdIndeterminateCheckBox
                      : MdCheckBoxOutlineBlank
                  }
                  boxSize={6}
                />
              }
              onClick={() =>
                selectedContacts.length
                  ? toggleMode()
                  : setValue(contacts.map((contact) => contact.id))
              }
            />

            <MenuButton
              as={IconButton}
              variant="ghost"
              size="sm"
              colorScheme="teal"
              h={10}
              borderLeftRadius={0}
              aria-label="Open selections menu"
              icon={<Icon as={MdArrowDropDown} boxSize={6} />}
            />

            <MenuList w="auto" minW="auto">
              <MenuItem
                w={32}
                onClick={() => setValue(contacts.map((contact) => contact.id))}
              >
                Select all
              </MenuItem>
              <MenuItem w={32} onClick={toggleMode}>
                Clear all
              </MenuItem>
            </MenuList>
          </Flex>
        </Menu>

        <LabelManager router={router} selectedContacts={selectedContacts} />

        <DeleteContacts
          router={router}
          toggleMode={toggleMode}
          selectedContacts={selectedContacts}
        />
      </Flex>

      <Tag colorScheme="yellow">{`${selectedContacts.length} contact${
        selectedContacts.length === 1 ? `` : `s`
      } selected`}</Tag>
    </Grid>
  )
}

export default ContactsCAB
