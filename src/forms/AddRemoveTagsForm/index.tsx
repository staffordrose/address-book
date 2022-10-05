import { useEffect, useState } from "react"
import type { ChangeEvent, FC } from "react"
import { FieldArray, Formik, FormikHelpers } from "formik"
import type { FormikErrors, FormikTouched } from "formik"
import {
  Button,
  Checkbox,
  Center,
  Flex,
  Icon,
  StackDivider,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react"
import { MdSave } from "react-icons/md"
import { CheckboxValue, ContactTag } from "@/common/types"
import { mapPropsToValues } from "./helpers"
import { Tag, Values } from "./types"
import { validationSchema } from "./validation-schema"

interface CheckboxFieldProps {
  index: number
  values: Tag
  touched?: FormikTouched<Tag>
  errors?: FormikErrors<Tag>
  getFieldProps: (name: string) => {
    name: string
    value: boolean
    onChange: (e: ChangeEvent) => void
    onBlur: (e: any) => void
  }
  setFieldValue: (name: string, value: any) => void
  isSubmitting: boolean
}

const CheckboxField: FC<CheckboxFieldProps> = ({
  index,
  values,
  touched,
  errors,
  getFieldProps,
  setFieldValue,
  isSubmitting,
}) => {
  const { name, value, onChange, onBlur } = getFieldProps(
    `tags.${index}.isChecked`,
  )

  return (
    <Checkbox
      size="lg"
      colorScheme="teal"
      pl={2}
      id={name}
      name={name}
      isChecked={value}
      isIndeterminate={values.isIndeterminate}
      isInvalid={!!touched?.isChecked && !!errors?.isChecked}
      isDisabled={isSubmitting}
      onChange={(e) => {
        onChange(e)

        if (values.isIndeterminate) {
          setFieldValue(`tags.${index}.isIndeterminate`, false)
        }
      }}
      onBlur={onBlur}
    >
      {values.name}
    </Checkbox>
  )
}

interface AddRemoveTagsFormProps {
  tags: ContactTag[]
  selectedContacts: CheckboxValue[]
  onSubmit: (values: { id: string; action: "ADD" | "REMOVE" }[]) => void
}

const AddRemoveTagsForm: FC<AddRemoveTagsFormProps> = ({
  tags,
  selectedContacts,
  onSubmit,
}) => {
  const [initialValues, setInitialValues] = useState<Values>(
    mapPropsToValues(tags, selectedContacts),
  )

  useEffect(
    () => setInitialValues(mapPropsToValues(tags, selectedContacts)),
    [tags, selectedContacts],
  )

  const handleSubmit = async (
    values: Values,
    { setStatus }: FormikHelpers<Values>,
  ) => {
    try {
      const filteredValues: { id: string; action: "ADD" | "REMOVE" }[] =
        values.tags
          .filter(
            (tag) =>
              tag.initialIsChecked !== tag.isChecked ||
              tag.initialIsIndeterminate !== tag.isIndeterminate,
          )
          .map(({ id, isChecked }) => ({
            id,
            action: isChecked ? "ADD" : "REMOVE",
          }))

      await onSubmit(filteredValues)
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
        values,
        touched,
        errors,
        getFieldProps,
        setFieldValue,
        handleSubmit,
        isSubmitting,
      }) => {
        return (
          <chakra.form display="grid" gap={3} onSubmit={handleSubmit}>
            <FieldArray
              name="tags"
              render={() => (
                <VStack
                  spacing={2}
                  divider={<StackDivider />}
                  align="start"
                  overflowY="auto"
                  maxH={360}
                  py={3}
                >
                  {values.tags.map((tag, index) => {
                    const tagTouched = touched?.tags?.[index]
                    const tagErrors = errors?.tags?.[index] as
                      | FormikErrors<Tag>
                      | undefined

                    return (
                      <CheckboxField
                        key={index}
                        index={index}
                        values={tag}
                        touched={tagTouched}
                        errors={tagErrors}
                        getFieldProps={getFieldProps}
                        setFieldValue={setFieldValue}
                        isSubmitting={isSubmitting}
                      />
                    )
                  })}
                </VStack>
              )}
            />

            <Flex justifyContent="flex-end">
              <Button
                colorScheme="teal"
                type="submit"
                pl="12px"
                leftIcon={<Icon as={MdSave} boxSize={6} />}
                isLoading={isSubmitting}
                loadingText="Saving"
                isDisabled={isSubmitting}
              >
                Save
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

export default AddRemoveTagsForm
