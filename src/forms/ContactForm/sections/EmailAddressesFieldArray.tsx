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
import { InputField, PrimaryBadge, SelectField } from "@/components"
import { deleteContactTableRow } from "@/lib/supabase"
import { FieldArrayAdd, FieldArrayItem, FieldArrayWrapper } from "../components"
import { FormProps } from "../types"

const EmailAddressesFieldArray = ({
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
        await deleteContactTableRow("contact_email_addresses", itemIdToDelete)
      }

      setItemIdToDelete(undefined)
      onClose()

      arrayHelpers.remove(index)

      toast({
        title: "Email address deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: "Error deleting email address.",
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
      name="email_addresses"
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
                Delete Email Address
              </AlertDialogHeader>

              <IconButton
                variant="ghost"
                colorScheme="teal"
                position="absolute"
                top={3}
                right={3}
                aria-label="Close delete email address form"
                icon={<Icon as={MdClose} boxSize={6} />}
                onClick={onCancel}
              />

              <AlertDialogBody p={3}>
                Are you sure you want delete this email address?
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
                      values.email_addresses.findIndex(
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
            {values.email_addresses.map((emailAddress, index) => {
              const emailTouched: any = touched?.email_addresses?.[index]
              const emailErrors: any = errors?.email_addresses?.[index]

              return (
                <FieldArrayItem key={index}>
                  <FieldArrayItem.LeftColumn
                    visibility={
                      values.email_addresses.length === 1 ? "hidden" : "visible"
                    }
                  >
                    <FieldArrayItem.Swap
                      index={index}
                      length={values.email_addresses.length}
                      swap={arrayHelpers.swap}
                    />

                    {values.email_addresses.length > 1 && index === 0 && (
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
                        "minmax(200px, 316px) 200px",
                      ]}
                      w="full"
                    >
                      <InputField
                        id={`email_addresses.${index}.email_address`}
                        type="email"
                        aria-label="Email address"
                        placeholder="Email address"
                        {...getFieldProps(
                          `email_addresses.${index}.email_address`,
                        )}
                        isInvalid={
                          !!emailTouched?.email_address &&
                          !!emailErrors?.email_address
                        }
                      />
                      <SelectField
                        id={`email_addresses.${index}.email_type`}
                        aria-label="Email type"
                        placeholder="Email type"
                        {...getFieldProps(
                          `email_addresses.${index}.email_type`,
                        )}
                        isInvalid={
                          !!emailTouched?.email_type &&
                          !!emailErrors?.email_type
                        }
                        options={["Home", "Work", "Other"]}
                      />
                    </Grid>

                    <FieldArrayItem.Remove
                      aria-label="Remove email address"
                      onClick={() => {
                        if (emailAddress.id) {
                          setItemIdToDelete(emailAddress.id)
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
              aria-label="Add email address"
              onClick={() =>
                arrayHelpers.push({
                  email_address: "",
                  email_type: "",
                })
              }
            >
              Email Address
            </FieldArrayAdd>
          </FieldArrayWrapper>
        </>
      )}
    />
  )
}

export default EmailAddressesFieldArray
