import { Box, Flex, Grid } from "@chakra-ui/react"
import { InputField, SelectField } from "@/components"
import { FormProps } from "../types"

const IdentityFields = ({
  values,
  touched,
  errors,
  getFieldProps,
}: FormProps) => {
  return (
    <Box
      mb={4}
      borderTopWidth={1}
      borderTopStyle="solid"
      borderTopColor="gray.200"
    >
      <Flex
        gap={4}
        justifyContent="space-between"
        alignItems="center"
        w="full"
        maxW={1280}
        mx="auto"
        p={4}
      >
        <Box w="full" maxW={[115, null, 270]} />

        <Flex flexDir="column" gap={4} w="full" maxW={960}>
          <Grid
            gap={4}
            templateColumns={[
              "1fr",
              "repeat(auto-fill, minmax(200px, 1fr))",
              null,
              "minmax(200px, 256px) 200px minmax(200px, 256px)",
            ]}
            justifyContent="start"
            alignItems="center"
            w="full"
          >
            <InputField
              id="first_name"
              aria-label="First name"
              placeholder="First name"
              {...getFieldProps("first_name")}
              isInvalid={!!touched.first_name && !!errors.first_name}
            />
            <InputField
              id="middle_name"
              aria-label="Middle name/initial"
              placeholder="Middle name/initial"
              {...getFieldProps("middle_name")}
              isInvalid={!!touched.middle_name && !!errors.middle_name}
            />
            <InputField
              id="last_name"
              aria-label="Last name"
              placeholder="Last name"
              {...getFieldProps("last_name")}
              isInvalid={!!touched.last_name && !!errors.last_name}
            />
          </Grid>

          <Grid
            gap={4}
            templateColumns={[
              "1fr",
              "repeat(auto-fill, minmax(200px, 1fr))",
              null,
              values.gender === "Other"
                ? "minmax(200px, 256px) 200px minmax(200px, 256px)"
                : "minmax(200px, 256px) 200px",
            ]}
            justifyContent="start"
            alignItems="center"
            w="full"
          >
            <InputField
              id="nickname"
              aria-label="Nickname"
              placeholder="Nickname"
              {...getFieldProps("nickname")}
              isInvalid={!!touched.nickname && !!errors.nickname}
            />
            <SelectField
              id="gender"
              aria-label="Gender"
              placeholder="Gender"
              {...getFieldProps("gender")}
              isInvalid={!!touched.gender && !!errors.gender}
              options={["Male", "Female", "Nonbinary", "Transgender", "Other"]}
            />
            {values.gender === "Other" && (
              <InputField
                id="gender_other"
                aria-label="Gender name"
                placeholder="Gender name"
                {...getFieldProps("gender_other")}
                isInvalid={!!touched.gender_other && !!errors.gender_other}
              />
            )}
          </Grid>
        </Flex>
      </Flex>
    </Box>
  )
}

export default IdentityFields
