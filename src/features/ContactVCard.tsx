import { useEffect, useState } from "react"
import type { FC } from "react"
import { Icon, IconButton, Tooltip } from "@chakra-ui/react"
import { MdContactPage } from "react-icons/md"
import { Contact } from "@/common/types"
import { VCardCreate } from "@/common/utils"
import { IconButtonLink } from "@/components"

interface ContactVCardProps {
  contact: Contact
}

const ContactVCard: FC<ContactVCardProps> = ({ contact }) => {
  const [vCard, setVCard] = useState("")

  useEffect(() => {
    const { vcard } = new VCardCreate(contact)
    if (vcard) setVCard(vcard)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const name =
    contact.first_name && contact.last_name
      ? `${contact.first_name} ${contact.last_name}`
      : `Contact`

  if (vCard) {
    return (
      <Tooltip
        hasArrow
        placement="bottom"
        openDelay={500}
        aria-label="Download vCard"
        label="Download vCard"
      >
        <span>
          <IconButtonLink
            size="lg"
            href={`data:text/vcard;utf8,${encodeURIComponent(vCard)}`}
            download={vCard ? `${name}.vcf` : undefined}
            aria-label={`Download ${name} vCard`}
            icon={<Icon as={MdContactPage} boxSize={9} />}
          />
        </span>
      </Tooltip>
    )
  }

  return (
    <IconButton
      as="a"
      variant="ghost"
      colorScheme="teal"
      size="lg"
      aria-label={`Download ${name} vCard`}
      icon={<Icon as={MdContactPage} boxSize={9} />}
      disabled
    />
  )
}

export default ContactVCard
