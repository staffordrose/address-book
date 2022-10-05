import { Box, Flex, Grid } from "@chakra-ui/react"
import { InputField } from "@/components"
import { FormProps } from "../types"

const OrganizationFields = ({ touched, errors, getFieldProps }: FormProps) => {
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
              "200px 200px minmax(200px, 256px)",
            ]}
            justifyContent="start"
            alignItems="center"
            w="full"
          >
            <InputField
              id="company"
              aria-label="Company"
              placeholder="Company"
              {...getFieldProps("company")}
              isInvalid={!!touched.company && !!errors.company}
            />
            <InputField
              id="department"
              aria-label="Department"
              placeholder="Department"
              {...getFieldProps("department")}
              isInvalid={!!touched.department && !!errors.department}
            />
            <InputField
              id="occupation"
              aria-label="Job title"
              placeholder="Job title"
              {...getFieldProps("occupation")}
              isInvalid={!!touched.occupation && !!errors.occupation}
            />
          </Grid>
        </Flex>
      </Flex>
    </Box>
  )
}

export default OrganizationFields
