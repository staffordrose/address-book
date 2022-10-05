import type { FC } from "react"
import { Center, Flex, Grid, Icon, Link, Text, VStack } from "@chakra-ui/react"
import type { As } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import dayjs from "dayjs"
import {
  MdAlternateEmail,
  MdBusiness,
  MdCake,
  MdCelebration,
  MdEvent,
  MdHome,
  MdLabelImportant,
  MdLink,
  MdPerson,
  MdPhone,
  MdPhoneIphone,
  MdPlace,
  MdShortText,
  MdWork,
} from "react-icons/md"
import { Contact } from "@/common/types"
import { hasArrayProperty } from "@/common/utils"
import { CopyContent, PrimaryBadge } from "@/components"

const SectionIcon = ({ as }: { as: As<any> }) => {
  return (
    <Center w={[7, null, 8]} h={8}>
      <Icon as={as} w={[6, null, 7]} h={[6, null, 7]} />
    </Center>
  )
}

const getLabelIcon = (type: string) => {
  type = type.toLowerCase()

  switch (type) {
    case "cell":
      return MdPhoneIphone
    case "home":
      return MdHome
    case "work":
      return MdWork
    case "birthday":
      return MdCake
    case "anniversary":
      return MdCelebration
    case "other":
    default:
      return MdLabelImportant
  }
}

const LabelBadge = ({ icon, text }: { icon: As<any>; text: string }) => {
  return (
    <Text
      as="span"
      display="inline-flex"
      gap="2px"
      alignItems="center"
      w="auto"
      h="18px"
      ml={1}
      mb="2px"
      px="4px"
      borderRadius={2}
      color="gray.600"
      bg="gray.50"
      sx={{ verticalAlign: "middle" }}
    >
      <Icon as={icon} w="14px" h="14px" />
      <Text
        as="span"
        colorScheme="gray"
        display={["none", null, "inline"]}
        fontSize="xs"
        fontWeight="medium"
      >
        {text}
      </Text>
    </Text>
  )
}

interface ContactDetailsProps {
  contact: Contact
}

const ContactDetails: FC<ContactDetailsProps> = ({ contact }) => {
  const {
    first_name,
    middle_name,
    last_name,
    nickname,
    gender,
    gender_other,
    phone_numbers,
    email_addresses,
    mailing_addresses,
    company,
    department,
    occupation,
    urls,
    dates,
    notes,
  } = contact

  const hasPhoneNumbers = hasArrayProperty(phone_numbers, "phone_number")
  const hasEmailAddresses = hasArrayProperty(email_addresses, "email_address")
  const hasMailingAddresses = hasArrayProperty(
    mailing_addresses,
    "address_line_1",
  )
  const hasUrls = hasArrayProperty(urls, "url")
  const hasDates = hasArrayProperty(dates, "date_str")
  const hasNotes = hasArrayProperty(notes, "note")

  return (
    <Grid templateColumns="auto 1fr" gap={[3, null, 4]}>
      {(first_name || middle_name || last_name || nickname || !!gender) && (
        <>
          <SectionIcon as={MdPerson} />
          <VStack align="start" spacing={1}>
            <Flex alignItems="center" w="full" minH={8}>
              <Text fontSize="sm">{`${first_name || ``}${
                middle_name ? ` ${middle_name}` : ``
              }${last_name ? ` ${last_name}` : ``}`}</Text>
            </Flex>
            {!!nickname && (
              <Flex alignItems="center" w="full" minH={8}>
                <Text fontSize="sm">{nickname}</Text>
              </Flex>
            )}
            {!!gender && (
              <Flex alignItems="center" w="full" minH={8}>
                <Text fontSize="sm">
                  {gender !== "Other" ? gender : gender_other}
                </Text>
              </Flex>
            )}
          </VStack>
        </>
      )}

      {hasPhoneNumbers && (
        <>
          <SectionIcon as={MdPhone} />
          <VStack align="start" spacing={1}>
            {phone_numbers
              .slice()
              .sort((a, b) => a.phone_order - b.phone_order)
              .map(({ phone_number, phone_type, is_primary }, i) => (
                <CopyContent
                  key={i}
                  contentType="phone number"
                  content={`+1${phone_number}`}
                >
                  <Text fontSize="sm">
                    <Link href={`tel:+1${phone_number}`}>+1{phone_number}</Link>
                    <LabelBadge
                      icon={getLabelIcon(phone_type)}
                      text={phone_type}
                    />
                    {is_primary && phone_numbers.length > 1 && <PrimaryBadge />}
                  </Text>
                </CopyContent>
              ))}
          </VStack>
        </>
      )}

      {hasEmailAddresses && (
        <>
          <SectionIcon as={MdAlternateEmail} />
          <VStack align="start" spacing={1}>
            {email_addresses
              .slice()
              .sort((a, b) => a.email_order - b.email_order)
              .map(({ email_address, email_type, is_primary }, i) => (
                <CopyContent
                  key={i}
                  contentType="email address"
                  content={email_address}
                >
                  <Text fontSize="sm">
                    <Link href={`mailto:${email_address}`}>
                      {email_address}
                    </Link>
                    <LabelBadge
                      icon={getLabelIcon(email_type)}
                      text={email_type}
                    />
                    {is_primary && email_addresses.length > 1 && (
                      <PrimaryBadge />
                    )}
                  </Text>
                </CopyContent>
              ))}
          </VStack>
        </>
      )}

      {hasMailingAddresses && (
        <>
          <SectionIcon as={MdPlace} />
          <VStack align="start" spacing={3}>
            {mailing_addresses
              .slice()
              .sort((a, b) => a.address_order - b.address_order)
              .map(
                (
                  {
                    address_line_1,
                    address_line_2,
                    city,
                    region,
                    postal_code,
                    country,
                    address_type,
                    is_primary,
                  },
                  i,
                ) => {
                  const mailingAddressStr = [
                    address_line_1,
                    address_line_2,
                    city,
                    region,
                    postal_code,
                    country,
                  ]
                    .filter((str) => str)
                    .join(", ")

                  return (
                    <CopyContent
                      key={i}
                      contentType="mailing address"
                      content={mailingAddressStr}
                    >
                      <Text fontSize="sm">
                        {address_line_1}
                        {address_line_2 ? (
                          <>
                            <br />
                            {address_line_2}
                          </>
                        ) : null}
                        <br />
                        {city}, {region} {postal_code}
                        <br />
                        {country}
                        <LabelBadge
                          icon={getLabelIcon(address_type)}
                          text={address_type}
                        />
                        {is_primary && mailing_addresses.length > 1 && (
                          <PrimaryBadge />
                        )}
                      </Text>
                    </CopyContent>
                  )
                },
              )}
          </VStack>
        </>
      )}

      {(company || department || !!occupation) && (
        <>
          <SectionIcon as={MdBusiness} />
          <VStack align="start" spacing={1}>
            {!!company && (
              <CopyContent contentType="company" content={company || ""}>
                <Text fontSize="sm">{company}</Text>
              </CopyContent>
            )}
            {!!department && (
              <CopyContent contentType="department" content={department || ""}>
                <Text fontSize="sm">{department}</Text>
              </CopyContent>
            )}
            {!!occupation && (
              <CopyContent contentType="job title" content={occupation || ""}>
                <Text fontSize="sm">{occupation}</Text>
              </CopyContent>
            )}
          </VStack>
        </>
      )}

      {hasUrls && (
        <>
          <SectionIcon as={MdLink} />
          <VStack align="start" spacing={1}>
            {urls
              .slice()
              .sort((a, b) => a.url_order - b.url_order)
              .map(({ url, url_type, is_primary }, i) => (
                <CopyContent key={i} contentType="webpage" content={url}>
                  <Text fontSize="sm">
                    <Link href={url} isExternal>
                      {url}
                      <ExternalLinkIcon ml="4px" />
                    </Link>
                    <LabelBadge icon={getLabelIcon(url_type)} text={url_type} />
                    {is_primary && urls.length > 1 && <PrimaryBadge />}
                  </Text>
                </CopyContent>
              ))}
          </VStack>
        </>
      )}

      {hasDates && (
        <>
          <SectionIcon as={MdEvent} />
          <VStack align="start" spacing={1}>
            {dates
              .slice()
              .sort((a, b) => a.date_order - b.date_order)
              .map(({ date_str, date_type, date_custom_type }, i) => {
                const formattedDate = dayjs(date_str).format("M/D/YYYY")

                return (
                  <CopyContent
                    key={i}
                    contentType="date"
                    content={formattedDate}
                  >
                    <Text fontSize="sm">
                      {formattedDate}
                      <LabelBadge
                        icon={getLabelIcon(
                          date_type === "Custom" ? date_custom_type : date_type,
                        )}
                        text={
                          date_type === "Custom" ? date_custom_type : date_type
                        }
                      />
                    </Text>
                  </CopyContent>
                )
              })}
          </VStack>
        </>
      )}

      {hasNotes && (
        <>
          <SectionIcon as={MdShortText} />
          <VStack align="start" spacing={2.5}>
            {notes
              .slice()
              .sort((a, b) => a.note_order - b.note_order)
              .map(({ note }, i) => (
                <CopyContent key={i} contentType="note" content={note}>
                  <Text fontSize="sm">{note}</Text>
                </CopyContent>
              ))}
          </VStack>
        </>
      )}
    </Grid>
  )
}

export default ContactDetails
