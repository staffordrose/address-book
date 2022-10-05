import { useRef } from "react"
import type { FC } from "react"
import type { NextRouter } from "next/router"
import shallow from "zustand/shallow"
import {
  Alert,
  AlertIcon,
  Center,
  Icon,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { MdClose, MdInfo, MdLabelOutline } from "react-icons/md"
import { CheckboxValue } from "@/common/types"
import { AddRemoveTagsForm } from "@/forms"
import { addContactsToTag, deleteContactsFromTag } from "@/lib/supabase"
import { useTagsStore } from "@/store"

interface LabelManagerProps {
  router: NextRouter
  selectedContacts: CheckboxValue[]
}

const LabelManager: FC<LabelManagerProps> = ({ router, selectedContacts }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef<HTMLButtonElement | null>(null)

  const toast = useToast()

  const { tags, isLoading, fetchTags } = useTagsStore(
    (state) => ({
      tags: state.tags,
      isLoading: state.isLoading,
      fetchTags: state.fetchTags,
    }),
    shallow,
  )

  const onSubmit = async (
    values: { id: string; action: "ADD" | "REMOVE" }[],
  ) => {
    try {
      const promiseArray = values.map(async ({ id, action }) => {
        if (action === "REMOVE") {
          await deleteContactsFromTag(id, selectedContacts as string[])
        } else {
          await addContactsToTag(id, selectedContacts as string[])
        }
      })

      await Promise.all(promiseArray)

      toast({
        title: "Labels updated.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      onClose()

      fetchTags()

      // Trigger getServerSideProps
      router.replace(router.asPath)
    } catch (error: any) {
      toast({
        title: "Error updating labels.",
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
        variant="ghost"
        colorScheme="teal"
        aria-label="Manage labels"
        icon={<Icon as={MdLabelOutline} boxSize={7} />}
        disabled={!Array.isArray(tags) || !tags.length}
        onClick={() => {
          fetchTags()
          onOpen()
        }}
      />

      <Modal
        size="xs"
        isCentered
        motionPreset="slideInBottom"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader pl={3} fontFamily="heading">
            Manage Labels
          </ModalHeader>

          <IconButton
            ref={initialRef}
            variant="ghost"
            colorScheme="teal"
            position="absolute"
            top={3}
            right={3}
            aria-label="Close label form"
            icon={<Icon as={MdClose} boxSize={6} />}
            onClick={onClose}
          />

          <ModalBody px={3} pt={0} pb={3}>
            {selectedContacts?.length > 1 && (
              <Alert
                variant="left-accent"
                status="warning"
                mb={3}
                fontSize="sm"
              >
                <AlertIcon as={MdInfo} boxSize={6} />
                Your changes will be applied to all selected contacts.
              </Alert>
            )}

            {isLoading ? (
              <Center w="full" h="full" minH={16}>
                <Spinner />
              </Center>
            ) : (
              <AddRemoveTagsForm
                tags={tags}
                selectedContacts={selectedContacts}
                onSubmit={onSubmit}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LabelManager
