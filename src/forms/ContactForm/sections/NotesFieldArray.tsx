import { useRef, useState } from "react"
import { FieldArray } from "formik"
import type { ArrayHelpers } from "formik"
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogContent,
  Button,
  Grid,
  Icon,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { MdClose, MdDelete } from "react-icons/md"
import { TextareaField } from "@/components"
import { deleteContactTableRow } from "@/lib/supabase"
import { FieldArrayAdd, FieldArrayItem, FieldArrayWrapper } from "../components"
import { FormProps } from "../types"

const NotesFieldArray = ({
  values,
  touched,
  errors,
  getFieldProps,
}: FormProps) => {
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const cancelRef = useRef<HTMLButtonElement | null>(null)

  const [itemIdToDelete, setItemIdToDelete] = useState<string | undefined>()
  const [isDeleting, setDeleting] = useState<boolean>(false)

  const onDelete = async (arrayHelpers: ArrayHelpers, index: number) => {
    setDeleting(true)

    try {
      if (itemIdToDelete) {
        await deleteContactTableRow("contact_notes", itemIdToDelete)
      }

      setItemIdToDelete(undefined)
      onClose()

      arrayHelpers.remove(index)

      toast({
        title: "Note deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: "Error deleting note.",
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

  const onCancel = () => {
    setItemIdToDelete(undefined)
    onClose()
  }

  return (
    <FieldArray
      name="notes"
      render={(arrayHelpers) => (
        <>
          <AlertDialog
            isCentered
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onCancel}
            isOpen={isOpen}
          >
            <AlertDialogOverlay />

            <AlertDialogContent>
              <AlertDialogHeader pl={3} fontFamily="heading">
                Delete Note
              </AlertDialogHeader>

              <IconButton
                variant="ghost"
                colorScheme="teal"
                position="absolute"
                top={3}
                right={3}
                aria-label="Close delete note form"
                icon={<Icon as={MdClose} boxSize={6} />}
                onClick={onCancel}
              />

              <AlertDialogBody p={3}>
                Are you sure you want delete this note?
              </AlertDialogBody>

              <AlertDialogFooter p={3}>
                <Button ref={cancelRef} onClick={onCancel}>
                  No
                </Button>
                <Button
                  colorScheme="red"
                  ml={3}
                  leftIcon={<Icon as={MdDelete} boxSize={6} />}
                  isLoading={isDeleting}
                  isDisabled={isDeleting}
                  onClick={() =>
                    onDelete(
                      arrayHelpers,
                      values.notes.findIndex(({ id }) => id === itemIdToDelete),
                    )
                  }
                >
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <FieldArrayWrapper>
            {values.notes.map((note, index) => {
              const noteTouched: any = touched?.notes?.[index]
              const noteErrors: any = errors?.notes?.[index]

              return (
                <FieldArrayItem key={index}>
                  <FieldArrayItem.LeftColumn
                    visibility={
                      values.notes.length === 1 ? "hidden" : "visible"
                    }
                  >
                    <FieldArrayItem.Swap
                      index={index}
                      length={values.notes.length}
                      swap={arrayHelpers.swap}
                    />
                  </FieldArrayItem.LeftColumn>

                  <FieldArrayItem.RightColumn>
                    <Grid gap={4} templateColumns="1fr" w="full">
                      <TextareaField
                        id={`notes.${index}.note`}
                        aria-label="Note"
                        placeholder="Note"
                        {...getFieldProps(`notes.${index}.note`)}
                        isInvalid={!!noteTouched?.note && !!noteErrors?.note}
                      />
                    </Grid>

                    <FieldArrayItem.Remove
                      aria-label="Remove note"
                      onClick={() => {
                        if (note.id) {
                          setItemIdToDelete(note.id)
                          onOpen()
                        } else {
                          arrayHelpers.remove(index)
                        }
                      }}
                    />
                  </FieldArrayItem.RightColumn>
                </FieldArrayItem>
              )
            })}

            <FieldArrayAdd
              aria-label="Add note"
              onClick={() =>
                arrayHelpers.push({
                  note: "",
                })
              }
            >
              Note
            </FieldArrayAdd>
          </FieldArrayWrapper>
        </>
      )}
    />
  )
}

export default NotesFieldArray
