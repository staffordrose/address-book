import { useRef } from "react"
import type { FC } from "react"
import type { NextRouter } from "next/router"
import {
  Button,
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
import { MdAdd, MdClose } from "react-icons/md"
import { TagForm } from "@/forms"
import { createTag } from "@/lib/supabase"

interface CreateLabelProps {
  fetchTags: () => void
}

const CreateLabel: FC<CreateLabelProps> = ({ fetchTags }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef<HTMLInputElement | null>(null)

  const toast = useToast()

  const onSubmit = async (values: { name: string }) => {
    try {
      await createTag(values.name)

      toast({
        title: "Label created.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      fetchTags()

      onClose()
    } catch (error: any) {
      toast({
        title: "Error creating label.",
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
      <Button
        variant="unstyled"
        display="flex"
        justifyContent="flex-start"
        w="full"
        pl={3}
        pr={3}
        fontSize="md"
        _hover={{ bg: "teal.50" }}
        _focus={{ bg: "teal.100" }}
        leftIcon={<Icon as={MdAdd} boxSize={6} color="teal.600" />}
        onClick={onOpen}
      >
        Add Label
      </Button>

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
            Add Label
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
            <TagForm initialRef={initialRef} onSubmit={onSubmit} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateLabel
