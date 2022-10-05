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
import { PhoneField, PrimaryBadge, SelectField } from "@/components"
import { deleteContactTableRow } from "@/lib/supabase"
import { FieldArrayAdd, FieldArrayItem, FieldArrayWrapper } from "../components"
import { FormProps } from "../types"

const PhoneNumbersFieldArray = ({
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
        await deleteContactTableRow("contact_phone_numbers", itemIdToDelete)
      }

      setItemIdToDelete(undefined)
      onClose()

      arrayHelpers.remove(index)

      toast({
        title: "Phone number deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: "Error deleting phone number.",
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
      name="phone_numbers"
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
                Delete Phone Number
              </AlertDialogHeader>

              <IconButton
                variant="ghost"
                colorScheme="teal"
                position="absolute"
                top={3}
                right={3}
                aria-label="Close delete phone number form"
                icon={<Icon as={MdClose} boxSize={6} />}
                onClick={onCancel}
              />

              <AlertDialogBody p={3}>
                Are you sure you want delete this phone number?
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
                      values.phone_numbers.findIndex(
                        ({ id }) => id === itemIdToDelete,
                      ),
                    )
                  }
                >
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <FieldArrayWrapper>
            {values.phone_numbers.map((phoneNumber, index) => {
              const phoneTouched: any = touched?.phone_numbers?.[index]
              const phoneErrors: any = errors?.phone_numbers?.[index]

              return (
                <FieldArrayItem key={index}>
                  <FieldArrayItem.LeftColumn
                    visibility={
                      values.phone_numbers.length === 1 ? "hidden" : "visible"
                    }
                  >
                    <FieldArrayItem.Swap
                      index={index}
                      length={values.phone_numbers.length}
                      swap={arrayHelpers.swap}
                    />

                    {values.phone_numbers.length > 1 && index === 0 && (
                      <PrimaryBadge />
                    )}
                  </FieldArrayItem.LeftColumn>

                  <FieldArrayItem.RightColumn>
                    <Grid
                      gap={4}
                      templateColumns={[
                        "1fr",
                        "repeat(auto-fill, minmax(200px, 1fr))",
                        null,
                        "200px 200px",
                      ]}
                      w="full"
                    >
                      <PhoneField
                        id={`phone_numbers.${index}.phone_number`}
                        aria-label="Phone number"
                        placeholder="123-123-1234"
                        {...getFieldProps(
                          `phone_numbers.${index}.phone_number`,
                        )}
                        isInvalid={
                          phoneTouched?.phone_number &&
                          !!phoneErrors?.phone_number
                        }
                      />
                      <SelectField
                        id={`phone_numbers.${index}.phone_type`}
                        aria-label="Phone type"
                        placeholder="Phone type"
                        {...getFieldProps(`phone_numbers.${index}.phone_type`)}
                        isInvalid={
                          !!phoneTouched?.phone_type &&
                          !!phoneErrors?.phone_type
                        }
                        options={["Cell", "Home", "Work", "Other"]}
                      />
                    </Grid>

                    <FieldArrayItem.Remove
                      aria-label="Remove phone number"
                      onClick={() => {
                        if (phoneNumber.id) {
                          setItemIdToDelete(phoneNumber.id)
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
              aria-label="Add phone number"
              onClick={() =>
                arrayHelpers.push({
                  phone_number: "",
                  phone_type: "",
                })
              }
            >
              Phone Number
            </FieldArrayAdd>
          </FieldArrayWrapper>
        </>
      )}
    />
  )
}

export default PhoneNumbersFieldArray
