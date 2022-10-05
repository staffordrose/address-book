import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { getUser, withPageAuth } from "@supabase/auth-helpers-nextjs"
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Text,
  VStack,
  usePrevious,
  useToast,
} from "@chakra-ui/react"
import { MdPersonSearch } from "react-icons/md"
import { mimeTypes } from "@/common/data"
import { Contact, FileType } from "@/common/types"
import { blobToFile, dataURLtoBlob } from "@/common/utils"
import { ButtonLink, Link, RouteLoading } from "@/components"
import { ContactsCAB, ContactsGrid } from "@/features"
import { useCheckboxGroup } from "@/hooks"
import { ActionBar, SidebarLayout } from "@/layout"
import { createContacts, getContacts, uploadFileToBucket } from "@/lib/supabase"
import { useContactsCountStore } from "@/store"

interface ContactsProps {
  contacts: Contact[]
  error: Error | null
}

export default function Contacts({ contacts, error }: ContactsProps) {
  const router = useRouter()

  const toast = useToast()

  const {
    value: selectedContacts,
    setValue,
    clearValue,
    getCheckboxProps,
  } = useCheckboxGroup({
    defaultValue: [],
  })

  const [isLoading, setLoading] = useState(false)
  const [mode, setMode] = useState<"view" | "edit">("view")

  const prevSelectedContacts = usePrevious(selectedContacts)

  useEffect(() => {
    if (
      mode === "edit" &&
      Array.isArray(prevSelectedContacts) &&
      prevSelectedContacts.length &&
      !selectedContacts.length
    ) {
      setMode("view")
    } else if (
      mode === "view" &&
      (!Array.isArray(prevSelectedContacts) || !prevSelectedContacts.length) &&
      selectedContacts.length
    ) {
      setMode("edit")
    }
  }, [mode, prevSelectedContacts, selectedContacts])

  const toggleMode = () => {
    if (mode === "view") {
      setMode("edit")
    } else {
      clearValue()
      setMode("view")
    }
  }

  const fetchCount = useContactsCountStore((state) => state.fetchCount)

  const onCreateFakerContacts = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/contacts/get-faker-contacts")
      const data = await res.json()
      const contacts = JSON.parse(data)

      const promiseArray = contacts.map(
        async ({ avatar_url, ...contact }: Contact) => {
          if (!avatar_url) {
            return { avatar_url, ...contact }
          }

          try {
            const fileExt = (avatar_url?.split(".").pop() || "jpg") as FileType
            const fileName = `${Math.random()}.${fileExt}`
            const blob = await dataURLtoBlob(avatar_url as string)
            const file = blobToFile(blob, fileName, mimeTypes[fileExt])

            await uploadFileToBucket("contacts.avatars", fileName, file)

            return {
              ...contact,
              avatar_url: fileName,
            }
          } catch (error) {
            console.log(error)
            return { avatar_url, ...contact }
          }
        },
      )

      const contactsWithAvatars = await Promise.all(promiseArray)

      await createContacts(contactsWithAvatars)

      fetchCount()

      toast({
        title: "Contacts created successfully.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      // Trigger getServerSideProps
      router.replace(router.asPath)
    } catch (error: any) {
      toast({
        title: "Error creating contacts.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <RouteLoading title="Loading Contacts" />
  }

  return (
    <>
      <Head>
        <title>All Contacts | Address Book</title>
        <meta
          name="description"
          content="View all contacts in your address book."
        />
      </Head>

      {mode === "edit" ? (
        <ContactsCAB
          router={router}
          toggleMode={toggleMode}
          selectedContacts={selectedContacts}
          setValue={setValue}
          contacts={contacts}
        />
      ) : contacts.length ? (
        <ActionBar
          templateColumns="48px 64px 1fr"
          gap={0}
          px={0}
          title="All Contacts"
          hideTitle
        >
          <span />

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
            px={2}
          >
            <Heading as="h3" fontSize="md" fontWeight={400}>
              Name
            </Heading>
            <Heading
              as="h3"
              display={["none", "block"]}
              visibility={["hidden", "visible"]}
              fontSize="md"
              fontWeight={400}
            >
              Phone number
            </Heading>
            <Heading
              as="h3"
              display={["none", null, "block"]}
              visibility={["hidden", null, "visible"]}
              fontSize="md"
              fontWeight={400}
            >
              Email address
            </Heading>
            <Heading
              as="h3"
              display={["none", null, null, "block"]}
              visibility={["hidden", null, null, "visible"]}
              fontSize="md"
              fontWeight={400}
            >
              Labels
            </Heading>
          </Grid>
        </ActionBar>
      ) : null}

      <ContactsGrid
        router={router}
        selectedContacts={selectedContacts}
        getCheckboxProps={getCheckboxProps}
        contacts={contacts}
        error={error}
        emptyState={
          <Center h="full" minH="calc(100vh - 64px)">
            <Center flexDir="column" w="full" maxW={640} px={4}>
              <Icon as={MdPersonSearch} boxSize={28} color="teal.900" />

              <Heading as="h1" mb={4}>
                No Contacts Found!
              </Heading>

              <Box
                w="full"
                borderWidth={1}
                borderStyle="solid"
                borderColor="gray.200"
                borderRadius="md"
              >
                <VStack spacing={4} w="full" p={4}>
                  <Text>Add your first contact</Text>

                  <ButtonLink variant="solid" href="/contacts/add">
                    Add Contact
                  </ButtonLink>
                </VStack>

                <Flex w="full" alignItems="center">
                  <Divider />
                  <Text px={4} py={3} textTransform="uppercase">
                    or
                  </Text>
                  <Divider />
                </Flex>

                <VStack spacing={4} w="full" p={4}>
                  <Text>
                    Use <Link href="https://fakerjs.dev">Faker</Link> to
                    populate fake contacts
                  </Text>

                  <Button onClick={onCreateFakerContacts}>Use Faker</Button>
                </VStack>
              </Box>
            </Center>
          </Center>
        }
      />
    </>
  )
}

export const getServerSideProps = withPageAuth({
  redirectTo: "/sign-in",
  async getServerSideProps(ctx) {
    let contacts: Contact[] = []
    let error = null

    try {
      const { user } = await getUser(ctx)

      contacts = await getContacts(user.id || "")
    } catch (err: any) {
      error = { message: err.message }
    }

    return {
      props: {
        contacts,
        error,
      },
    }
  },
})

Contacts.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>
}
