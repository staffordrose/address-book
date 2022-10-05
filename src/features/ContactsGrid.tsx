import { useMemo, useRef } from "react"
import type { FC, ReactNode } from "react"
import NextLink from "next/link"
import type { NextRouter } from "next/router"
import {
  Box,
  Center,
  Checkbox,
  Flex,
  Grid,
  Link,
  Text,
  Tag,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { CheckboxValue, Contact, GetCheckboxProps } from "@/common/types"
import { Avatar, CopyContent, RouteError } from "@/components"

interface ContactsGridProps {
  router: NextRouter
  selectedContacts: CheckboxValue[]
  getCheckboxProps: GetCheckboxProps
  contacts: Contact[]
  error: Error | null
  emptyState: ReactNode
}

const ContactsGrid: FC<ContactsGridProps> = ({
  router,
  selectedContacts,
  getCheckboxProps,
  contacts,
  error,
  emptyState,
}) => {
  const groupEls = useRef<(HTMLDivElement | null)[]>(
    [...Array(26)].map(() => null),
  )

  const groupedContacts = useMemo(() => {
    const groups = [...Array(26)].map((_, i) => String.fromCharCode(i + 97))

    return groups.reduce(
      (accum, letter) => {
        const items = contacts
          .filter((contact) =>
            contact.first_name?.toLowerCase().startsWith(letter),
          )
          .sort((a, b) =>
            a.first_name.localeCompare(b.first_name, "en", {
              sensitivity: "base",
            }),
          )

        accum.push({ letter, items })

        return accum
      },
      [] as {
        letter: string
        items: Contact[]
      }[],
    )
  }, [contacts])

  if (error?.message) {
    return <RouteError title={error.message} />
  }

  return (
    <Box position="relative">
      {Array.isArray(contacts) && contacts.length > 0 ? (
        groupedContacts.map(({ letter, items }, i) => {
          if (!Array.isArray(items) || !items.length) return null

          return (
            <Grid
              key={`contacts-${letter}`}
              ref={(el) => (groupEls.current[i] = el)}
              templateColumns="auto 1fr"
            >
              <Flex
                as="button"
                justifyContent="center"
                alignItems="flex-start"
                w={12}
                h="full"
                borderRadius={0}
                fontFamily="heading"
                aria-label={`Jump to contacts starting with ${letter}`}
                _hover={{ bg: "teal.50" }}
                onClick={() => {
                  // Header/ActionBar height
                  const yOffset = -112
                  const y =
                    (groupEls.current[i]?.getBoundingClientRect().top ?? 0) +
                    window.pageYOffset +
                    yOffset

                  window.scrollTo({ top: y, behavior: "smooth" })
                }}
              >
                <Center position="sticky" top="112px" w={12} h={16}>
                  <Text as="span" fontSize="xl" fontWeight={700}>
                    {letter?.toUpperCase()}
                  </Text>
                </Center>
              </Flex>

              <Flex flexDir="column">
                {Array.isArray(items) &&
                  items.length > 0 &&
                  items.map(
                    ({
                      id,
                      avatar_url,
                      first_name,
                      middle_name,
                      last_name,
                      phone_numbers,
                      email_addresses,
                      tags,
                    }) => {
                      const phoneNumber =
                        phone_numbers?.find((p) => p.is_primary)
                          ?.phone_number ?? ""
                      const emailAddress =
                        email_addresses?.find((p) => p.is_primary)
                          ?.email_address ?? ""

                      return (
                        <Grid
                          key={id}
                          role="group"
                          templateColumns="auto 1fr"
                          alignItems="center"
                          w="full"
                          bg={
                            selectedContacts.includes(id)
                              ? "teal.50"
                              : "transparent"
                          }
                          _hover={{
                            bg: "teal.50",
                          }}
                        >
                          <Center position="relative" w={16} h={16}>
                            <Center
                              position="absolute"
                              zIndex={1}
                              top={0}
                              left={0}
                              w="full"
                              h="full"
                              bg="teal.50"
                              opacity={selectedContacts.includes(id) ? 1 : 0}
                              _groupHover={{ opacity: 1 }}
                            >
                              <Checkbox
                                size="lg"
                                colorScheme="teal"
                                borderColor="teal.500"
                                {...getCheckboxProps({ value: id })}
                              />
                            </Center>

                            <Avatar
                              storageBucket="contacts.avatars"
                              path={avatar_url || ""}
                              name={`${first_name} ${last_name}`}
                              size="md"
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
                            <NextLink href={`/contacts/${id}`} passHref>
                              <Text
                                as="a"
                                fontFamily="heading"
                                fontWeight={700}
                                noOfLines={1}
                              >
                                {`${first_name}${
                                  middle_name
                                    ? ` ${middle_name.slice(0, 1)}.`
                                    : ``
                                }${last_name ? ` ${last_name}` : ``}`}
                              </Text>
                            </NextLink>

                            <Box
                              display={["none", "block"]}
                              visibility={["hidden", "visible"]}
                              overflow="hidden"
                            >
                              {!!phoneNumber && (
                                <CopyContent
                                  justify="start"
                                  contentType="phone number"
                                  content={`+1${phoneNumber}`}
                                >
                                  <Link
                                    href={`tel:+1${phoneNumber}`}
                                    fontSize="sm"
                                    noOfLines={1}
                                  >
                                    +1{phoneNumber}
                                  </Link>
                                </CopyContent>
                              )}
                            </Box>

                            <Box
                              display={["none", null, "block"]}
                              visibility={["hidden", null, "visible"]}
                              overflow="hidden"
                            >
                              {!!emailAddress && (
                                <CopyContent
                                  justify="start"
                                  contentType="email address"
                                  content={emailAddress}
                                >
                                  <Link
                                    href={`mailto:${emailAddress}`}
                                    fontSize="sm"
                                    noOfLines={1}
                                  >
                                    {emailAddress}
                                  </Link>
                                </CopyContent>
                              )}
                            </Box>

                            <Box
                              display={["none", null, null, "block"]}
                              visibility={["hidden", null, null, "visible"]}
                            >
                              {Array.isArray(tags) && tags.length > 0 && (
                                <Wrap overflow="hidden" maxH={12}>
                                  {tags
                                    .sort((a, b) =>
                                      a.name.localeCompare(b.name),
                                    )
                                    .map(({ id, name }) => (
                                      <WrapItem key={name}>
                                        <Tag
                                          variant="subtle"
                                          size="sm"
                                          colorScheme="teal"
                                          cursor="pointer"
                                          _hover={{ bg: "teal.200" }}
                                          onClick={() =>
                                            router.push(`/labels/${id}`)
                                          }
                                        >
                                          {name}
                                        </Tag>
                                      </WrapItem>
                                    ))}
                                </Wrap>
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
        })
      ) : (
        <Box>{emptyState}</Box>
      )}
    </Box>
  )
}

export default ContactsGrid
