import { useState } from "react"
import type { FC } from "react"
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
  useToast,
} from "@chakra-ui/react"
import {
  MdArrowDropDown,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdClose,
  MdFileUpload,
  MdIndeterminateCheckBox,
} from "react-icons/md"
import { fileTypes, mimeTypes } from "@/common/data"
import {
  CheckboxValue,
  ContactWithPhotoURI,
  FileType,
  MimeType,
} from "@/common/types"
import { blobToFile, dataURLtoBlob } from "@/common/utils"
import { ResponsiveButton } from "@/components"
import {
  addContactAvatarUrl,
  createContacts,
  uploadFileToBucket,
} from "@/lib/supabase"

interface ImportContactsCABProps {
  toggleMode: () => void
  selectedContacts: CheckboxValue[]
  setValue: (value: string[]) => void
  contacts: ContactWithPhotoURI[]
}

const ImportContactsCAB: FC<ImportContactsCABProps> = ({
  toggleMode,
  selectedContacts,
  setValue,
  contacts,
}) => {
  const toast = useToast()

  const [isSubmitting, setSubmitting] = useState(false)

  const onImport = async () => {
    setSubmitting(true)

    try {
      const contactsToCreate = contacts.filter(({ id }) =>
        selectedContacts.includes(id),
      )

      await createContacts(contactsToCreate)

      if (contactsToCreate.some(({ photo_uri }) => photo_uri)) {
        const contactsWithAvatars = contactsToCreate.filter(
          ({ photo_uri }) => photo_uri,
        )

        const promiseArray = contactsWithAvatars.map(
          async ({ id: contactId, photo_uri }) => {
            const regEx = /^http/

            let fileExt: FileType = "jpg"
            let fileName: string
            let blob: Blob

            try {
              if (regEx.test(photo_uri as string)) {
                fileExt = (photo_uri?.split(".").pop() || "jpg") as FileType
                fileName = `${Math.random()}.${fileExt}`

                const res = await fetch("/api/media/get-data-url", {
                  method: "POST",
                  headers: new Headers({ "Content-Type": "application/json" }),
                  credentials: "same-origin",
                  body: JSON.stringify({ dataUrl: photo_uri }),
                })
                blob = await res.blob()
              } else {
                fileExt =
                  fileTypes[
                    (photo_uri?.split(":")[1].split(";")[0] ||
                      mimeTypes["jpg"]) as MimeType
                  ]
                fileName = `${Math.random()}.${fileExt}`
                blob = await dataURLtoBlob(photo_uri as string)
              }

              const file = blobToFile(blob, fileName, mimeTypes[fileExt])

              await uploadFileToBucket("contacts.avatars", fileName, file)
              await addContactAvatarUrl(contactId, fileName)
            } catch (error) {
              throw error
            }
          },
        )

        await Promise.all(promiseArray)
      }

      toast({
        title: "Contacts imported.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      toggleMode()
    } catch (error: any) {
      toast({
        title: "Error importing contacts.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

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
                  ? setValue([])
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
                onClick={() => {
                  setValue(contacts.map((contact) => contact.id))
                }}
              >
                Select all
              </MenuItem>
              <MenuItem
                w={32}
                onClick={() => {
                  setValue([])
                }}
              >
                Clear all
              </MenuItem>
            </MenuList>
          </Flex>
        </Menu>
      </Flex>

      <Flex gap={2} alignItems="center">
        <Tag colorScheme="yellow">{`${selectedContacts.length}/${contacts.length} selected`}</Tag>

        <ResponsiveButton
          variant="solid"
          leftIcon={<Icon as={MdFileUpload} boxSize={6} />}
          aria-label="Import Contacts"
          isLoading={isSubmitting}
          loadingText="Importing"
          isDisabled={!selectedContacts.length}
          onClick={onImport}
        >
          Import
        </ResponsiveButton>
      </Flex>
    </Grid>
  )
}

export default ImportContactsCAB
