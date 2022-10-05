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
import { ContactTag } from "@/common/types"
import { deleteTag } from "@/lib/supabase"

interface DeleteLabelProps {
  router: NextRouter
  tag: ContactTag
  fetchTags: () => void
}

const DeleteLabel: FC<DeleteLabelProps> = ({ router, tag, fetchTags }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const cancelRef = useRef<HTMLButtonElement | null>(null)

  const [isDeleting, setDeleting] = useState(false)

  const toast = useToast()

  const onDelete = async () => {
    setDeleting(true)

    try {
      await deleteTag(tag.id)

      toast({
        title: "Label deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      fetchTags()

      onClose()

      if (router.asPath.includes(tag.id)) router.push("/contacts")
    } catch (error: any) {
      toast({
        title: "Error deleting label.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <IconButton
        variant="unstyled"
        display="flex"
        justifyContent="center"
        alignItems="center"
        color="red.600"
        opacity={0.5}
        _hover={{ opacity: 1 }}
        aria-label="Delete label"
        icon={<Icon as={MdDelete} boxSize={6} />}
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
            Delete Label
          </AlertDialogHeader>

          <IconButton
            variant="ghost"
            colorScheme="teal"
            position="absolute"
            top={3}
            right={3}
            aria-label="Close delete label form"
            icon={<Icon as={MdClose} boxSize={6} />}
            onClick={onClose}
          />

          <AlertDialogBody p={3}>
            Are you sure you want delete {tag.name}?
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

export default DeleteLabel
