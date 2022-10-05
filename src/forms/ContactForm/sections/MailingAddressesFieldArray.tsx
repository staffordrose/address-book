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
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { MdClose, MdDelete } from "react-icons/md"
import { usStates } from "@/common/data"
import { InputField, PrimaryBadge, SelectField } from "@/components"
import { deleteContactTableRow } from "@/lib/supabase"
import { FieldArrayAdd, FieldArrayItem, FieldArrayWrapper } from "../components"
import { FormProps } from "../types"

const MailingAddressesFieldArray = ({
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
        await deleteContactTableRow("contact_mailing_addresses", itemIdToDelete)
      }

      setItemIdToDelete(undefined)
      onClose()

      arrayHelpers.remove(index)

      toast({
        title: "Addres deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: "Error deleting address.",
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
      name="mailing_addresses"
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
                Delete Mailing Address
              </AlertDialogHeader>

              <IconButton
                variant="ghost"
                colorScheme="teal"
                position="absolute"
                top={3}
                right={3}
                aria-label="Close delete mailing address form"
                icon={<Icon as={MdClose} boxSize={6} />}
                onClick={onCancel}
              />

              <AlertDialogBody p={3}>
                Are you sure you want delete this mailing address?
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
                      values.mailing_addresses.findIndex(
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
            {values.mailing_addresses.map((mailingAddress, index) => {
              const mailingTouched: any = touched?.mailing_addresses?.[index]
              const mailingErrors: any = errors?.mailing_addresses?.[index]

              return (
                <FieldArrayItem key={index}>
                  <FieldArrayItem.LeftColumn
                    visibility={
                      values.mailing_addresses.length === 1
                        ? "hidden"
                        : "visible"
                    }
                  >
                    <FieldArrayItem.Swap
                      index={index}
                      length={values.mailing_addresses.length}
                      swap={arrayHelpers.swap}
                    />

                    {values.mailing_addresses.length > 1 && index === 0 && (
                      <PrimaryBadge />
                    )}
                  </FieldArrayItem.LeftColumn>

                  <FieldArrayItem.RightColumn>
                    <Flex flexDir="column" gap={4} w="full">
                      <Grid
                        gap={4}
                        templateColumns={[
                          "1fr",
                          "repeat(auto-fill, minmax(200px, 1fr))",
                          null,
                          "repeat(2, minmax(200px, 336px))",
                        ]}
                        w="full"
                      >
                        <InputField
                          id={`mailing_addresses.${index}.address_line_1`}
                          aria-label="Street address"
                          placeholder="Street address"
                          {...getFieldProps(
                            `mailing_addresses.${index}.address_line_1`,
                          )}
                          isInvalid={
                            !!mailingTouched?.address_line_1 &&
                            !!mailingErrors?.address_line_1
                          }
                        />
                        <InputField
                          id={`mailing_addresses.${index}.address_line_2`}
                          aria-label="Street address 2"
                          placeholder="Street address 2"
                          {...getFieldProps(
                            `mailing_addresses.${index}.address_line_2`,
                          )}
                          isInvalid={
                            !!mailingTouched?.address_line_2 &&
                            !!mailingErrors?.address_line_2
                          }
                        />
                      </Grid>
                      <Grid
                        gap={4}
                        templateColumns={[
                          "1fr",
                          "repeat(auto-fill, minmax(200px, 1fr))",
                          null,
                          "minmax(200px, 336px) 200px 120px 120px",
                        ]}
                        w="full"
                      >
                        <InputField
                          id={`mailing_addresses.${index}.city`}
                          aria-label="City"
                          placeholder="City"
                          {...getFieldProps(`mailing_addresses.${index}.city`)}
                          isInvalid={
                            !!mailingTouched?.city && !!mailingErrors?.city
                          }
                        />
                        <SelectField
                          id={`mailing_addresses.${index}.region`}
                          aria-label="State"
                          placeholder="State"
                          {...getFieldProps(
                            `mailing_addresses.${index}.region`,
                          )}
                          isInvalid={
                            !!mailingTouched?.region && !!mailingErrors?.region
                          }
                          options={usStates}
                        />
                        <InputField
                          id={`mailing_addresses.${index}.postal_code`}
                          type="number"
                          aria-label="Zip code"
                          placeholder="Zip code"
                          {...getFieldProps(
                            `mailing_addresses.${index}.postal_code`,
                          )}
                          isInvalid={
                            !!mailingTouched?.postal_code &&
                            !!mailingErrors?.postal_code
                          }
                        />
                        <SelectField
                          id={`mailing_addresses.${index}.country`}
                          aria-label="Country"
                          placeholder="Country"
                          {...getFieldProps(
                            `mailing_addresses.${index}.country`,
                          )}
                          isInvalid={
                            !!mailingTouched?.country &&
                            !!mailingErrors?.country
                          }
                          options={["USA"]}
                        />
                      </Grid>

                      <Box w={["full", 200]}>
                        <SelectField
                          id={`mailing_addresses.${index}.address_type`}
                          aria-label="Address type"
                          placeholder="Address type"
                          {...getFieldProps(
                            `mailing_addresses.${index}.address_type`,
                          )}
                          isInvalid={
                            mailingTouched?.address_type &&
                            !!mailingErrors?.address_type
                          }
                          options={["Home", "Work", "Other"]}
                        />
                      </Box>
                    </Flex>

                    <FieldArrayItem.Remove
                      aria-label="Remove mailing address"
                      onClick={() => {
                        if (mailingAddress.id) {
                          setItemIdToDelete(mailingAddress.id)
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
              aria-label="Add mailing address"
              onClick={() =>
                arrayHelpers.push({
                  address_line_1: "",
                  address_line_2: "",
                  city: "",
                  region: "",
                  postal_code: "",
                  country: "",
                  address_type: "",
                })
              }
            >
              Mailing Address
            </FieldArrayAdd>
          </FieldArrayWrapper>
        </>
      )}
    />
  )
}

export default MailingAddressesFieldArray
