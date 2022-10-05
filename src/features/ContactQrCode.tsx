import { useEffect, useState } from "react"
import type { FC } from "react"
import Image from "next/image"
import { Icon, Spinner, Text, VStack } from "@chakra-ui/react"
import { MdDownloadDone, MdDownload } from "react-icons/md"
import { Contact } from "@/common/types"
import { VCardCreate } from "@/common/utils"
import { ButtonLink } from "@/components"

interface ContactQrCodeProps {
  contact: Contact
  size?: number
  showDownload?: boolean
}

const ContactQrCode: FC<ContactQrCodeProps> = ({
  contact,
  size = 160,
  showDownload,
}) => {
  const [qrCode, setQrCode] = useState("")
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const handler = async () => {
      try {
        const { vcard } = new VCardCreate(contact)

        const res = await fetch("/api/contacts/create-qrcode", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ vcard }),
        })

        const data = await res.json()

        if (data.vcard) {
          setQrCode(data.vcard)
        }
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    handler()
  }, [contact])

  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    if (downloaded) {
      const timer = setTimeout(() => {
        setDownloaded(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [downloaded])

  if (error) return <Text color="red.500">{error}</Text>

  const dataImg = `data:image/svg+xml;utf8,${encodeURIComponent(qrCode)}`
  const name =
    contact.first_name && contact.last_name
      ? `${contact.first_name} ${contact.last_name}`
      : `Contact`

  return (
    <VStack spacing={2} justify="center" align="center" minH={size + 72} p={2}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Image src={dataImg} alt={name} width={size} height={size} />

          {showDownload && (
            <ButtonLink
              href={dataImg}
              download={`${name}.svg`}
              variant="solid"
              aria-label={`Download ${name} QR code`}
              leftIcon={
                downloaded ? (
                  <Icon as={MdDownloadDone} boxSize={6} />
                ) : (
                  <Icon as={MdDownload} boxSize={6} />
                )
              }
              onClick={() => setDownloaded(true)}
            >
              {downloaded ? "Downloaded" : "Download"}
            </ButtonLink>
          )}
        </>
      )}
    </VStack>
  )
}

export default ContactQrCode
