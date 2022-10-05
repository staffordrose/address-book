import { useRef } from "react"
import type { FC } from "react"
import {
  Icon,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { MdClose, MdEdit } from "react-icons/md"
import { ContactTag } from "@/common/types"
import { TagForm } from "@/forms"
import { updateTag } from "@/lib/supabase"

interface EditLabelProps {
  tag: ContactTag
  fetchTags: () => void
}

const EditLabel: FC<EditLabelProps> = ({ tag, fetchTags }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef<HTMLInputElement | null>(null)

  const toast = useToast()

  const onSubmit = async (values: { name: string }) => {
    try {
      await updateTag(tag.id, values.name)

      toast({
        title: "Label updated.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      fetchTags()

      onClose()
    } catch (error: any) {
      toast({
        title: "Error updating label.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <IconButton
        variant="unstyled"
        display="flex"
        justifyContent="center"
        alignItems="center"
        color="teal.600"
        opacity={0.5}
        _hover={{ opacity: 1 }}
        aria-label="Edit label"
        icon={<Icon as={MdEdit} boxSize={6} />}
        onClick={onOpen}
      />

      <Modal
        isCentered
        motionPreset="slideInBottom"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader pl={3} fontFamily="heading">
            Edit Label
          </ModalHeader>

          <IconButton
            variant="ghost"
            colorScheme="teal"
            position="absolute"
            top={3}
            right={3}
            aria-label="Close label form"
            icon={<Icon as={MdClose} boxSize={6} />}
            onClick={onClose}
          />

          <ModalBody p={3}>
            <TagForm initialRef={initialRef} tag={tag} onSubmit={onSubmit} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditLabel
