import type { FC } from "react"
import { Box, Center, Checkbox, Flex, Grid, Text } from "@chakra-ui/react"
import { CheckboxValue, Contact, GetCheckboxProps } from "@/common/types"

interface ImportContactsGridProps {
  selectedContacts: CheckboxValue[]
  getCheckboxProps: GetCheckboxProps
  contacts: Contact[]
}

const ImportContactsGrid: FC<ImportContactsGridProps> = ({
  selectedContacts,
  getCheckboxProps,
  contacts,
}) => {
  return (
    <Grid templateColumns="auto 1fr">
      <Box w={12} h="full" />

      <Flex flexDir="column">
        {Array.isArray(contacts) &&
          contacts.length > 0 &&
          contacts
            .slice()
            .sort((a, b) =>
              a.first_name.localeCompare(b.first_name, "en", {
                sensitivity: "base",
              }),
            )
            .map(
              ({
                id,
                first_name,
                middle_name,
                last_name,
                phone_numbers,
                email_addresses,
              }) => {
                const phoneNumber =
                  phone_numbers?.find((p) => p.is_primary)?.phone_number ?? ""
                const emailAddress =
                  email_addresses?.find((p) => p.is_primary)?.email_address ??
                  ""

                return (
                  <Grid
                    key={id}
                    role="group"
                    templateColumns="auto 1fr"
                    alignItems="center"
                    w="full"
                    bg={
                      selectedContacts.includes(id) ? "teal.50" : "transparent"
                    }
                    _hover={{
                      bg: "teal.50",
                    }}
                  >
                    <Center zIndex={1} top={0} left={0} w={16} h={16}>
                      <Checkbox
                        size="lg"
                        colorScheme="teal"
                        borderColor="teal.500"
                        {...getCheckboxProps({ value: id })}
                      />
                    </Center>

                    <Grid
                      templateColumns={[
                        "1.5fr",
                        "1.5fr 1fr",
                        "1.5fr 1fr 1.5fr",
                        "1.5fr 1fr 1.5fr 1fr",
                      ]}
                      gap={3}
                      justifyContent="start"
                      alignItems="center"
                      w="full"
                      h="full"
                      px={2}
                    >
                      <Text fontFamily="heading" fontWeight={700} noOfLines={1}>
                        {`${first_name}${
                          middle_name ? ` ${middle_name.slice(0, 1)}.` : ``
                        }${last_name ? ` ${last_name}` : ``}`}
                      </Text>

                      <Box
                        display={["none", "block"]}
                        visibility={["hidden", "visible"]}
                        overflow="hidden"
                      >
                        {!!phoneNumber && (
                          <Text fontSize="sm" noOfLines={1}>
                            +1{phoneNumber}
                          </Text>
                        )}
                      </Box>

                      <Box
                        display={["none", null, "block"]}
                        visibility={["hidden", null, "visible"]}
                        overflow="hidden"
                      >
                        {!!emailAddress && (
                          <Text fontSize="sm" noOfLines={1}>
                            {emailAddress}
                          </Text>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                )
              },
            )}
      </Flex>
    </Grid>
  )
}

export default ImportContactsGrid
