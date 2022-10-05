import { useCallback, useEffect, useState } from "react"
import type { ReactNode } from "react"
import Head from "next/head"
import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { MdError, MdUploadFile } from "react-icons/md"
import { Contact, VCard } from "@/common/types"
import { VCardParse, mapVCardToContact, readFileAsText } from "@/common/utils"
import { Dropzone } from "@/components"
import { ImportContactsCAB, ImportContactsGrid } from "@/features"
import { useCheckboxGroup } from "@/hooks"
import { ActionBar, SidebarLayout } from "@/layout"

export default function Import() {
  const [contents, setContents] = useState<VCard[]>([])
  const [isUploading, setUploading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [contacts, setContacts] = useState<Contact[]>([])

  const {
    value: selectedContacts,
    setValue,
    clearValue,
    getCheckboxProps,
  } = useCheckboxGroup({
    defaultValue: [],
  })

  useEffect(() => {
    const nextContacts = contents.map((c) => mapVCardToContact(c))
    setContacts(nextContacts)
    setValue(nextContacts.map(({ id }) => id))
  }, [contents, setValue])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null)
    setUploading(true)

    try {
      if (Array.isArray(acceptedFiles) && acceptedFiles.length) {
        const promiseArray: any[] = Array.from(acceptedFiles).map(
          async (file: File) => {
            const fileContent = await readFileAsText(file)

            let parseResultNew!: any[]
            const card = new VCardParse()
            card.readData(fileContent, (err, json) => {
              parseResultNew = json
            })

            return parseResultNew
          },
        )

        const result = await Promise.all(promiseArray)

        setContents(result.flat())
      }
    } catch (error: any) {
      setError(error)
    } finally {
      setUploading(false)
    }
  }, [])

  console.log("contents", contents)
  console.log("contacts", contacts)

  return (
    <>
      <Head>
        <title>Import Contacts | Address Book</title>
        <meta name="description" content="Import new contacts from vCards." />
      </Head>

      <ActionBar title="Import Contacts" />

      {!!error?.message && (
        <Alert variant="left-accent" status="error" mb={3} fontSize="sm">
          <AlertIcon as={MdError} boxSize={6} />
          {error.message}
        </Alert>
      )}

      <Box p={4}>
        <Dropzone
          accept={{
            "text/vcard": [".vcf"],
          }}
          onDrop={onDrop}
          onDropRejected={(fileRejection) => {
            const {
              errors: [error],
            } = fileRejection[0]

            setError(new Error(error.message))
          }}
          disabled={isUploading}
          activeState={<Text>Drop VCF file(s) here</Text>}
        >
          <Center flexDir="column">
            {isUploading ? (
              <HStack spacing={3}>
                <Spinner />
                <Text fontFamily="heading" fontWeight={700} userSelect="none">
                  Uploading
                </Text>
              </HStack>
            ) : (
              <>
                <Icon as={MdUploadFile} boxSize={20} color="teal.900" />

                <Heading
                  as="h2"
                  fontSize="2xl"
                  textTransform="uppercase"
                  userSelect="none"
                >
                  vcf
                </Heading>

                <Text mt={3} userSelect="none">
                  Drag and drop .vcf file(s) here, or click to open file
                  explorer.
                </Text>
              </>
            )}
          </Center>
        </Dropzone>
      </Box>

      {Array.isArray(contacts) && contacts.length > 0 && (
        <>
          <ImportContactsCAB
            toggleMode={() => {
              setContents([])
              setContacts([])
              clearValue()
            }}
            selectedContacts={selectedContacts}
            setValue={setValue}
            contacts={contacts}
          />

          <ImportContactsGrid
            selectedContacts={selectedContacts}
            getCheckboxProps={getCheckboxProps}
            contacts={contacts}
          />
        </>
      )}
    </>
  )
}

Import.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>
}
