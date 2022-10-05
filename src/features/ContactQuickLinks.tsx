import { useRef } from "react"
import type { FC } from "react"
import {
  Flex,
  Heading,
  Icon,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import {
  MdAlternateEmail,
  MdClose,
  MdLink,
  MdPhone,
  MdPlace,
  MdQrCode2,
} from "react-icons/md"
import { Contact, MailingAddress } from "@/common/types"
import { encodeMailingAddress, getArrayItemByProperty } from "@/common/utils"
import { IconButtonLink } from "@/components"
import { ContactQrCode, ContactVCard } from "@/features"

function hasPrimaryProperty(arr: any[], property: string) {
  const item = getArrayItemByProperty(arr, "is_primary")
  return !!item?.[property]
}

interface ContactQuickLinksProps {
  contact: Contact
}

const ContactQuickLinks: FC<ContactQuickLinksProps> = ({ contact }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef<HTMLButtonElement | null>(null)

  const hasPrimaryPhoneNumber = hasPrimaryProperty(
    contact.phone_numbers,
    "phone_number",
  )
  const hasPrimaryEmailAddress = hasPrimaryProperty(
    contact.email_addresses,
    "email_address",
  )
  const hasPrimaryMailingAddress = hasPrimaryProperty(
    contact.mailing_addresses,
    "address_line_1",
  )
  const hasPrimaryUrl = hasPrimaryProperty(contact.urls, "url")

  return (
    <>
      <Modal
        isCentered
        motionPreset="slideInBottom"
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader pl={3} fontFamily="heading">
            QR code
          </ModalHeader>

          <IconButton
            ref={initialRef}
            variant="ghost"
            colorScheme="teal"
            position="absolute"
            top={3}
            right={3}
            aria-label="Close QR code modal"
            icon={<Icon as={MdClose} boxSize={6} />}
            onClick={onClose}
          />

          <ModalBody>
            <ContactQrCode contact={contact} size={240} showDownload />
          </ModalBody>
        </ModalContent>
      </Modal>

      {(hasPrimaryPhoneNumber ||
        hasPrimaryEmailAddress ||
        hasPrimaryMailingAddress ||
        hasPrimaryUrl) && (
        <VStack>
          <Heading as="h6" fontSize="sm">
            Quick Actions
          </Heading>

          <Flex
            gap={2}
            p={2}
            borderWidth={1}
            borderStyle="solid"
            borderColor="gray.100"
            borderRadius="lg"
          >
            {hasPrimaryPhoneNumber && (
              <Tooltip
                hasArrow
                placement="bottom"
                openDelay={500}
                aria-label={`Call ${contact.first_name}`}
                label={`Call ${contact.first_name}`}
              >
                <span>
                  <IconButtonLink
                    href={`tel:+1${
                      contact.phone_numbers.find((i) => i.is_primary)
                        ?.phone_number
                    }`}
                    aria-label={`Call ${contact.first_name}`}
                    icon={<Icon as={MdPhone} boxSize={7} />}
                  />
                </span>
              </Tooltip>
            )}

            {hasPrimaryEmailAddress && (
              <Tooltip
                hasArrow
                placement="bottom"
                openDelay={500}
                aria-label={`Email ${contact.first_name}`}
                label={`Email ${contact.first_name}`}
              >
                <span>
                  <IconButtonLink
                    href={`mailto:${
                      contact.email_addresses.find((i) => i.is_primary)
                        ?.email_address
                    }`}
                    aria-label={`Email ${contact.first_name}`}
                    icon={<Icon as={MdAlternateEmail} boxSize={7} />}
                  />
                </span>
              </Tooltip>
            )}

            {hasPrimaryMailingAddress && (
              <Tooltip
                hasArrow
                placement="bottom"
                openDelay={500}
                aria-label={`Map ${contact.first_name}'s Address`}
                label={`Map ${contact.first_name}'s Address`}
              >
                <span>
                  <IconButtonLink
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeMailingAddress(
                      contact.mailing_addresses.find((i) => i.is_primary) ??
                        ({} as MailingAddress),
                    )}`}
                    target="_blank"
                    aria-label={`Map ${contact.first_name}'s Address`}
                    icon={<Icon as={MdPlace} boxSize={7} />}
                  />
                </span>
              </Tooltip>
            )}

            {hasPrimaryUrl && (
              <Tooltip
                hasArrow
                placement="bottom"
                openDelay={500}
                aria-label={`View ${contact.first_name}'s Webpage`}
                label={`View ${contact.first_name}'s Webpage`}
              >
                <span>
                  <IconButtonLink
                    href={contact.urls.find((i) => i.is_primary)?.url || ""}
                    target="_blank"
                    aria-label={`View ${contact.first_name}'s Webpage`}
                    icon={<Icon as={MdLink} boxSize={7} />}
                  />
                </span>
              </Tooltip>
            )}
          </Flex>
        </VStack>
      )}

      <VStack>
        <Heading as="h6" fontSize="sm">
          Share
        </Heading>

        <Flex
          gap={2}
          p={2}
          borderWidth={1}
          borderStyle="solid"
          borderColor="gray.100"
          borderRadius="lg"
        >
          <Tooltip
            hasArrow
            placement="bottom"
            openDelay={500}
            aria-label="View QR code"
            label="View QR code"
          >
            <IconButton
              variant="ghost"
              colorScheme="teal"
              size="lg"
              aria-label="Create QR code"
              icon={<Icon as={MdQrCode2} boxSize={9} />}
              onClick={onOpen}
            />
          </Tooltip>

          <ContactVCard contact={contact} />
        </Flex>
      </VStack>
    </>
  )
}

export default ContactQuickLinks
