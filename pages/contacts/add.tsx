import { useState } from "react"
import type { ReactNode } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Flex, Icon, useToast } from "@chakra-ui/react"
import { MdSave } from "react-icons/md"
import { v4 as uuid } from "uuid"
import { Contact } from "@/common/types"
import { ResponsiveButton } from "@/components"
import { ContactForm } from "@/forms"
import { ActionBar, SidebarLayout } from "@/layout"
import {
  addContactAvatarUrl,
  addContactToTag,
  createContact,
  getTagIdByName,
} from "@/lib/supabase"
import { useContactsCountStore } from "@/store"

export default function AddContact() {
  const router = useRouter()

  const toast = useToast()

  const [contact, setContact] = useState<Contact>({
    id: uuid(),
    avatar_url: undefined,
    first_name: "",
    middle_name: "",
    last_name: "",
    nickname: "",
    gender: undefined,
    gender_other: "",
    company: "",
    occupation: "",
    department: "",
    phone_numbers: [],
    email_addresses: [],
    mailing_addresses: [],
    dates: [],
    urls: [],
    notes: [],
  })

  const [isSubmitting, setSubmitting] = useState(false)

  const onDeleteAvatar = async () => {
    try {
      toast({
        title: "Avatar deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      setContact((prevState) => ({ ...prevState, avatar_url: undefined }))
    } catch (error: any) {
      toast({
        title: "Error deleting avatar.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    }
  }

  const onUploadAvatar = async (url: string) => {
    try {
      toast({
        title: "Avatar uploaded.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      setContact((prevState) => ({ ...prevState, avatar_url: url }))
    } catch (error: any) {
      toast({
        title: "Error uploading avatar.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    }
  }

  const fetchCount = useContactsCountStore((state) => state.fetchCount)

  const onSubmit = async (values: Contact) => {
    try {
      await createContact({ ...values, id: contact.id })

      if (contact.avatar_url) {
        await addContactAvatarUrl(contact.id, contact.avatar_url)
      }

      if (router.query.label && typeof router.query.label === "string") {
        const tagId = await getTagIdByName(router.query.label)

        if (tagId) await addContactToTag(tagId, contact.id)
      }

      toast({
        title: "Contact added.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      fetchCount()

      router.push(`/contacts/${contact.id}`)
    } catch (error: any) {
      toast({
        title: "Error creating contact.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Head>
        <title>Add Contact | Address Book</title>
        <meta
          name="description"
          content={`Add a new contact in your address book.`}
        />
      </Head>

      <ActionBar
        backHref="/contacts"
        backAriaLabel="Go back to contacts"
        title="Add Contact"
      >
        <Flex gap={0}>
          <ResponsiveButton
            variant="solid"
            form="contact-form"
            type="submit"
            aria-label="Save contact"
            leftIcon={<Icon as={MdSave} boxSize={6} />}
            isLoading={isSubmitting}
            loadingText="Saving"
            isDisabled={isSubmitting}
          >
            Save
          </ResponsiveButton>
        </Flex>
      </ActionBar>

      <ContactForm
        contact={contact}
        onDeleteAvatar={onDeleteAvatar}
        onUploadAvatar={onUploadAvatar}
        onSubmit={onSubmit}
        setSubmitting={setSubmitting}
      />
    </>
  )
}

AddContact.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>
}
