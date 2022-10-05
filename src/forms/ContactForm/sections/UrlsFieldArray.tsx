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

const UrlsFieldArray = ({
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
        await deleteContactTableRow("contact_urls", itemIdToDelete)
      }

      setItemIdToDelete(undefined)
      onClose()

      arrayHelpers.remove(index)

      toast({
        title: "Webpage deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: "Error deleting webpage.",
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
      name="urls"
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
                Delete Personal Webpage
              </AlertDialogHeader>

              <IconButton
                variant="ghost"
                colorScheme="teal"
                position="absolute"
                top={3}
                right={3}
                aria-label="Close delete webpage form"
                icon={<Icon as={MdClose} boxSize={6} />}
                onClick={onCancel}
              />

              <AlertDialogBody p={3}>
                Are you sure you want delete this webpage?
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
                      values.urls.findIndex(({ id }) => id === itemIdToDelete),
                    )
                  }
                >
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <FieldArrayWrapper>
            {values.urls.map((url, index) => {
              const urlTouched: any = touched?.urls?.[index]
              const urlErrors: any = errors?.urls?.[index]

              return (
                <FieldArrayItem key={index}>
                  <FieldArrayItem.LeftColumn
                    visibility={values.urls.length === 1 ? "hidden" : "visible"}
                  >
                    <FieldArrayItem.Swap
                      index={index}
                      length={values.urls.length}
                      swap={arrayHelpers.swap}
                    />

                    {values.urls.length > 1 && index === 0 && <PrimaryBadge />}
                  </FieldArrayItem.LeftColumn>

                  <FieldArrayItem.RightColumn>
                    <Grid
                      gap={4}
                      templateColumns={[
                        "1fr",
                        "repeat(auto-fill, minmax(200px, 1fr))",
                        null,
                        "minmax(200px, 336px) 200px",
                      ]}
                      w="full"
                    >
                      <InputField
                        id={`urls.${index}.url`}
                        aria-label="Webpage URL"
                        placeholder="Webpage URL"
                        {...getFieldProps(`urls.${index}.url`)}
                        isInvalid={!!urlTouched?.url && !!urlErrors?.url}
                      />
                      <SelectField
                        id={`urls.${index}.url_type`}
                        aria-label="Webpage type"
                        placeholder="Webpage type"
                        {...getFieldProps(`urls.${index}.url_type`)}
                        isInvalid={
                          !!urlTouched?.url_type && !!urlErrors?.url_type
                        }
                        options={["Home", "Work", "Other"]}
                      />
                    </Grid>

                    <FieldArrayItem.Remove
                      aria-label="Remove personal webpage"
                      onClick={() => {
                        if (url.id) {
                          setItemIdToDelete(url.id)
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
              aria-label="Add personal webpage"
              onClick={() =>
                arrayHelpers.push({
                  url: "",
                  url_type: "",
                })
              }
            >
              Personal Webpage
            </FieldArrayAdd>
          </FieldArrayWrapper>
        </>
      )}
    />
  )
}

export default UrlsFieldArray
