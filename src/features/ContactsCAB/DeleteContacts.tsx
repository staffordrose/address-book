import { useRef, useState } from "react"
import type { FC } from "react"
import type { NextRouter } from "next/router"
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogContent,
  Button,
  Icon,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { MdClose, MdDelete } from "react-icons/md"
import { CheckboxValue } from "@/common/types"
import { deleteContact } from "@/lib/supabase"
import { useContactsCountStore, useTagsStore } from "@/store"

interface DeleteContactsProps {
  router: NextRouter
  toggleMode: () => void
  selectedContacts: CheckboxValue[]
}

const DeleteContacts: FC<DeleteContactsProps> = ({
  router,
  toggleMode,
  selectedContacts,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const cancelRef = useRef<HTMLButtonElement | null>(null)

  const [isDeleting, setDeleting] = useState(false)

  const toast = useToast()

  const fetchCount = useContactsCountStore((state) => state.fetchCount)
  const fetchTags = useTagsStore((state) => state.fetchTags)

  const onDelete = async () => {
    setDeleting(true)

    try {
      const promiseArray = selectedContacts.map(async (id) => {
        await deleteContact(id as string)
      })

      await Promise.allSettled(promiseArray)

      toast({
        title: "Contacts deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      fetchCount()
      fetchTags()

      setDeleting(false)

      toggleMode()

      // Trigger getServerSideProps
      router.replace(router.asPath)
    } catch (error: any) {
      toast({
        title: "Error deleting contacts.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })

      setDeleting(false)
    }
  }

  return (
    <>
      <IconButton
        variant="ghost"
        colorScheme="red"
        aria-label="Delete contacts"
        icon={<Icon as={MdDelete} boxSize={7} />}
        isDisabled={selectedContacts.length === 0}
        onClick={onOpen}
      />

      <AlertDialog
        isCentered
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader pl={3} fontFamily="heading">
            Delete Contact{selectedContacts.length === 1 ? `` : `s`}
          </AlertDialogHeader>

          <IconButton
            variant="ghost"
            colorScheme="teal"
            position="absolute"
            top={3}
            right={3}
            aria-label="Close delete contacts form"
            icon={<Icon as={MdClose} boxSize={6} />}
            onClick={onClose}
          />

          <AlertDialogBody p={3}>
            {`Are you sure you want delete the selected contact${
              selectedContacts.length === 1 ? `` : `s`
            }?`}
          </AlertDialogBody>

          <AlertDialogFooter p={3}>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              leftIcon={<Icon as={MdDelete} boxSize={6} />}
              isLoading={isDeleting}
              isDisabled={isDeleting}
              onClick={onDelete}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteContacts
