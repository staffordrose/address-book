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
import { InputField, SelectField } from "@/components"
import { deleteContactTableRow } from "@/lib/supabase"
import { FieldArrayAdd, FieldArrayItem, FieldArrayWrapper } from "../components"
import { FormProps } from "../types"

const DatesFieldArray = ({
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
        await deleteContactTableRow("contact_dates", itemIdToDelete)
      }

      setItemIdToDelete(undefined)
      onClose()

      arrayHelpers.remove(index)

      toast({
        title: "Date deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: "Error deleting date.",
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
      name="dates"
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
                Delete Date
              </AlertDialogHeader>

              <IconButton
                variant="ghost"
                colorScheme="teal"
                position="absolute"
                top={3}
                right={3}
                aria-label="Close delete date form"
                icon={<Icon as={MdClose} boxSize={6} />}
                onClick={onCancel}
              />

              <AlertDialogBody p={3}>
                Are you sure you want delete this date?
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
                      values.dates.findIndex(({ id }) => id === itemIdToDelete),
                    )
                  }
                >
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <FieldArrayWrapper>
            {values.dates.map((date, index) => {
              const dateTouched: any = touched?.dates?.[index]
              const dateErrors: any = errors?.dates?.[index]

              return (
                <FieldArrayItem key={index}>
                  <FieldArrayItem.LeftColumn
                    visibility={
                      values.dates.length === 1 ? "hidden" : "visible"
                    }
                  >
                    <FieldArrayItem.Swap
                      index={index}
                      length={values.dates.length}
                      swap={arrayHelpers.swap}
                    />
                  </FieldArrayItem.LeftColumn>

                  <FieldArrayItem.RightColumn>
                    <Grid
                      gap={4}
                      templateColumns={[
                        "1fr",
                        "repeat(auto-fill, minmax(200px, 1fr))",
                        null,
                        date.date_type === "Custom"
                          ? "200px 120px minmax(200px, 256px)"
                          : "200px 120px",
                      ]}
                      w="full"
                    >
                      <InputField
                        id={`dates.${index}.date_str`}
                        type="date"
                        aria-label="Date"
                        {...getFieldProps(`dates.${index}.date_str`)}
                        isInvalid={
                          !!dateTouched?.date_str && !!dateErrors?.date_str
                        }
                      />
                      <SelectField
                        id={`dates.${index}.date_type`}
                        aria-label="Date type"
                        placeholder="Date type"
                        {...getFieldProps(`dates.${index}.date_type`)}
                        isInvalid={
                          !!dateTouched?.date_type && !!dateErrors?.date_type
                        }
                        options={["Birthday", "Anniversary", "Custom"]}
                      />
                      {date.date_type === "Custom" && (
                        <InputField
                          id={`dates.${index}.date_custom_type`}
                          aria-label="Custom type"
                          placeholder="Custom type"
                          {...getFieldProps(`dates.${index}.date_custom_type`)}
                          isInvalid={
                            !!dateTouched?.date_custom_type &&
                            !!dateErrors?.date_custom_type
                          }
                        />
                      )}
                    </Grid>

                    <FieldArrayItem.Remove
                      aria-label="Remove date"
                      onClick={() => {
                        if (date.id) {
                          setItemIdToDelete(date.id)
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
              aria-label="Add date"
              onClick={() =>
                arrayHelpers.push({
                  date_type: "",
                  date_custom_type: "",
                  date_str: "",
                })
              }
            >
              Date
            </FieldArrayAdd>
          </FieldArrayWrapper>
        </>
      )}
    />
  )
}

export default DatesFieldArray
