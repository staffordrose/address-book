import { useEffect, useState } from "react"
import type { FC, MutableRefObject } from "react"
import { Formik, FormikHelpers } from "formik"
import { Button, Center, Flex, Icon, Text, chakra } from "@chakra-ui/react"
import { MdSave } from "react-icons/md"
import { ContactTag } from "@/common/types"
import { InputField } from "@/components"
import { mapPropsToValues } from "./helpers"
import { Values } from "./types"
import { validationSchema } from "./validation-schema"

interface TagFormProps {
  tag?: ContactTag
  initialRef?: MutableRefObject<HTMLInputElement | null>
  onSubmit: (values: Values) => Promise<void>
}

const TagForm: FC<TagFormProps> = ({ tag, initialRef, onSubmit }) => {
  const [initialValues, setInitialValues] = useState<Values>(
    mapPropsToValues(tag),
  )

  useEffect(() => setInitialValues(mapPropsToValues(tag)), [tag])

  const handleSubmit = async (
    values: Values,
    { setStatus }: FormikHelpers<Values>,
  ) => {
    try {
      await onSubmit(values)
    } catch (error: any) {
      setStatus(error.message)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values: Values, formikHelpers: FormikHelpers<Values>) =>
        handleSubmit(values, formikHelpers)
      }
    >
      {({
        status,
        touched,
        errors,
        getFieldProps,
        handleSubmit,
        isSubmitting,
      }) => {
        return (
          <chakra.form display="grid" gap={3} onSubmit={handleSubmit}>
            <InputField
              innerRef={initialRef}
              size="md"
              id="name"
              aria-label="Label name"
              placeholder="Name"
              {...getFieldProps("name")}
              isInvalid={!!touched.name && !!errors.name}
              isDisabled={isSubmitting}
            />

            <Flex justifyContent="flex-end">
              <Button
                colorScheme="teal"
                type="submit"
                pl="12px"
                leftIcon={<Icon as={MdSave} boxSize={6} />}
                isLoading={isSubmitting}
                loadingText={initialValues.name ? "Updating" : "Saving"}
                isDisabled={isSubmitting}
              >
                {initialValues.name ? "Update" : "Save"}
              </Button>
            </Flex>

            {!isSubmitting && !!status && (
              <Center py={2}>
                <Text
                  lineHeight={1}
                  textAlign="center"
                  fontSize="sm"
                  color="red.500"
                >
                  {status}
                </Text>
              </Center>
            )}
          </chakra.form>
        )
      }}
    </Formik>
  )
}

export default TagForm
