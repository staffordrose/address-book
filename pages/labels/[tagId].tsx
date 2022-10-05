import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { withPageAuth } from "@supabase/auth-helpers-nextjs"
import {
  Center,
  Grid,
  Heading,
  Icon,
  Text,
  usePrevious,
} from "@chakra-ui/react"
import { MdPersonSearch } from "react-icons/md"
import { Contact, ContactTag } from "@/common/types"
import { ContactsCAB, ContactsGrid } from "@/features"
import { useCheckboxGroup } from "@/hooks"
import { ActionBar, SidebarLayout } from "@/layout"
import { getTagContacts } from "@/lib/supabase"

interface LabelContactsProps {
  name: ContactTag["name"]
  contacts: Contact[]
  error: Error | null
}

export default function LabelContacts({
  name,
  contacts,
  error,
}: LabelContactsProps) {
  const router = useRouter()

  const {
    value: selectedContacts,
    setValue,
    clearValue,
    getCheckboxProps,
  } = useCheckboxGroup({
    defaultValue: [],
  })

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

  return (
    <>
      <Head>
        <title>{name} Contacts | Address Book</title>
        <meta name="description" content={`View all ${name} contacts.`} />
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
          title={`${name} Contacts`}
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
            <Center
              flexDir="column"
              w="full"
              maxW={640}
              px={4}
              textAlign="center"
            >
              <Icon as={MdPersonSearch} boxSize={28} color="teal.900" />

              <Heading as="h1" mb={4}>
                No Contacts Found!
              </Heading>

              <Text>You haven&#39;t added any contacts to this label yet.</Text>
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
    const tagId = Array.isArray(ctx.params?.tagId)
      ? ctx.params?.tagId[0]
      : ctx.params?.tagId

    let name: ContactTag["name"] = ""
    let contacts: Contact[] = []
    let error = null

    if (tagId) {
      try {
        const res = await getTagContacts(tagId)

        if (res?.name) name = res.name
        if (res?.contacts) contacts = res.contacts
      } catch (err: any) {
        error = { message: err.message }
      }
    }

    return {
      props: {
        name,
        contacts,
        error,
      },
    }
  },
})

LabelContacts.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>
}
