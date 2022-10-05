import { Fragment, useEffect, useState } from "react"
import type { FC } from "react"
import { Formik, FormikHelpers } from "formik"
import { Box, Center, Text, VStack, chakra } from "@chakra-ui/react"
import { Contact } from "@/common/types"
import { Avatar } from "@/components"
import { ImageUploader } from "@/features"
import { SectionTitle } from "./components"
import { sections } from "./data"
import { mapPropsToValues, mapValuesToContact } from "./helpers"
import { Values } from "./types"
import { validationSchema } from "./validation-schema"

interface ContactFormProps {
  contact: Contact
  onDeleteAvatar: () => void
  onUploadAvatar: (filePath: string) => void
  onSubmit: (values: Contact) => void
  setSubmitting: (isSubmitting: boolean) => void
}

const ContactForm: FC<ContactFormProps> = ({
  contact,
  onDeleteAvatar,
  onUploadAvatar,
  onSubmit,
  setSubmitting,
}) => {
  const [initialValues, setInitialValues] = useState<Values>(
    mapPropsToValues(contact),
  )

  useEffect(() => {
    if (contact) {
      setInitialValues(mapPropsToValues(contact))
    }
  }, [contact])

  const handleSubmit = async (
    values: Values,
    { setStatus }: FormikHelpers<Values>,
  ) => {
    setSubmitting(true)

    try {
      onSubmit(mapValuesToContact(values))
    } catch (error: any) {
      setStatus(error.message)
    } finally {
      setSubmitting(false)
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
        handleSubmit,
        isSubmitting,
      }) => {
        return (
          <chakra.form
            id="contact-form"
            display="grid"
            gap={4}
            py={16}
            onSubmit={handleSubmit}
          >
            <Center my={4} px={4}>
              {!isSubmitting && !!status ? (
                <Text lineHeight={1} color="red.500">
                  {status}
                </Text>
              ) : (
                <Box h={4} />
              )}
            </Center>

            <VStack spacing={3} mb={8}>
              <Avatar
                storageBucket="contacts.avatars"
                path={contact.avatar_url || ""}
                name={
                  contact.first_name
                    ? `${contact.first_name} ${contact.last_name}`
                    : undefined
                }
                size="2xl"
              />
              <ImageUploader
                storageBucket="contacts.avatars"
                path={contact.avatar_url || ""}
                size={360}
                onDelete={onDeleteAvatar}
                onUpload={onUploadAvatar}
              />
            </VStack>

            {sections.map(({ leftIcon, title, component: Component }) => (
              <Fragment key={title}>
                <SectionTitle leftIcon={leftIcon}>{title}</SectionTitle>
                <Component
                  values={values}
                  touched={touched}
                  errors={errors}
                  getFieldProps={getFieldProps}
                />
              </Fragment>
            ))}
          </chakra.form>
        )
      }}
    </Formik>
  )
}

export default ContactForm
