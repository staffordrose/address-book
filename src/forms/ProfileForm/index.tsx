import { useEffect, useState } from "react"
import type { FC } from "react"
import { Center, Grid, Text, VStack, chakra } from "@chakra-ui/react"
import { FormikHelpers, useFormik } from "formik"
import { Profile } from "@/common/types"
import { Avatar, InputField } from "@/components"
import { ImageUploader } from "@/features"
import { mapPropsToValues } from "./helpers"
import { Values } from "./types"
import { validationSchema } from "./validation-schema"

interface ProfileFormProps {
  profile: Profile
  onDeleteAvatar: () => void
  onUploadAvatar: (filePath: string) => void
  onSubmit: (values: any) => void
  setSubmitting: (isSubmitting: boolean) => void
}

const ProfileForm: FC<ProfileFormProps> = ({
  profile,
  onDeleteAvatar,
  onUploadAvatar,
  onSubmit,
  setSubmitting,
}) => {
  const [initialValues, setInitialValues] = useState<Values>(
    mapPropsToValues(profile),
  )

  useEffect(() => {
    if (profile) {
      setInitialValues(mapPropsToValues(profile))
    }
  }, [profile])

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: Values, { setStatus }: FormikHelpers<Values>) => {
      setSubmitting(true)

      try {
        onSubmit(values)
      } catch (error: any) {
        setStatus(error.message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <chakra.form
      id="profile-form"
      display="grid"
      gap={4}
      px={4}
      py={16}
      onSubmit={formik.handleSubmit}
    >
      <Center minH={4} my={4} px={4}>
        {!formik.isSubmitting && !!formik.status && (
          <Text lineHeight={1} color="red.500">
            {formik.status}
          </Text>
        )}
      </Center>

      <VStack spacing={3} mb={8}>
        <Avatar
          storageBucket="avatars"
          path={profile.avatar_url || ""}
          name={
            profile.first_name
              ? `${profile.first_name} ${profile.last_name}`
              : undefined
          }
          size="2xl"
        />
        <ImageUploader
          storageBucket="avatars"
          path={profile.avatar_url || ""}
          size={360}
          onDelete={onDeleteAvatar}
          onUpload={onUploadAvatar}
        />
      </VStack>

      <Grid
        gap={4}
        templateColumns={[
          "1fr",
          "repeat(auto-fill, minmax(200px, 256px))",
          "minmax(200px, 256px) 200px minmax(200px, 256px)",
        ]}
        justifyContent="center"
        alignItems="center"
      >
        <InputField
          id="first_name"
          type="text"
          aria-label="First name"
          placeholder="First name"
          {...formik.getFieldProps("first_name")}
          isInvalid={formik.touched.first_name && !!formik.errors.first_name}
        />
        <InputField
          id="middle_name"
          type="text"
          aria-label="Middle name/initial"
          placeholder="Middle name/initial"
          {...formik.getFieldProps("middle_name")}
          isInvalid={formik.touched.middle_name && !!formik.errors.middle_name}
        />
        <InputField
          id="last_name"
          type="text"
          aria-label="Last name"
          placeholder="Last name"
          {...formik.getFieldProps("last_name")}
          isInvalid={formik.touched.last_name && !!formik.errors.last_name}
        />
      </Grid>
    </chakra.form>
  )
}

export default ProfileForm
