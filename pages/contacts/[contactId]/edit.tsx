import { useState } from "react"
import type { ReactNode } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { withPageAuth } from "@supabase/auth-helpers-nextjs"
import { Flex, Icon, useToast } from "@chakra-ui/react"
import { MdSave } from "react-icons/md"
import { Contact } from "@/common/types"
import { ResponsiveButton, RouteError } from "@/components"
import { ContactForm } from "@/forms"
import { ActionBar, SidebarLayout } from "@/layout"
import {
  addContactAvatarUrl,
  getContact,
  removeContactAvatarUrl,
  updateContact,
} from "@/lib/supabase"
import { useContactsCountStore } from "@/store"

interface EditContactProps {
  contact: Contact
  error: Error | null
}

export default function EditContact({ contact, error }: EditContactProps) {
  const router = useRouter()

  const toast = useToast()

  const contactId = contact.id

  const [isSubmitting, setSubmitting] = useState(false)

  const onDeleteAvatar = async () => {
    try {
      await removeContactAvatarUrl(contactId)

      toast({
        title: "Avatar deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      // Trigger getServerSideProps
      router.replace(router.asPath)
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
      await addContactAvatarUrl(contactId, url)

      toast({
        title: "Avatar uploaded.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      // Trigger getServerSideProps
      router.replace(router.asPath)
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

  const onSubmit = async (contact: Contact) => {
    try {
      await updateContact(contact)

      toast({
        title: "Contact updated.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      fetchCount()

      router.push(`/contacts/${contact.id}`)
    } catch (error: any) {
      toast({
        title: "Error updating contact.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    }
  }

  if (error?.message) {
    return <RouteError title={error.message} />
  }

  const { first_name, middle_name, last_name } = contact

  const fullName = `${first_name}${
    middle_name ? ` ${middle_name.slice(0, 1)}.` : ``
  }${last_name ? ` ${last_name}` : ``}`

  return (
    <>
      <Head>
        <title>Edit {fullName} | Address Book</title>
        <meta name="description" content={`Edit details for ${fullName}.`} />
      </Head>

      <ActionBar
        backHref={`/contacts/${contact.id}`}
        backAriaLabel="Go back to contact"
        title={`Edit ${fullName}`}
      >
        <Flex gap={0}>
          <ResponsiveButton
            variant="solid"
            leftIcon={<Icon as={MdSave} boxSize={6} />}
            form="contact-form"
            type="submit"
            aria-label="Save contact"
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

export const getServerSideProps = withPageAuth({
  redirectTo: "/sign-in",
  async getServerSideProps(ctx) {
    const contactId = Array.isArray(ctx.params?.contactId)
      ? ctx.params?.contactId[0]
      : ctx.params?.contactId

    let contact: Contact = {} as Contact
    let error = null

    if (contactId) {
      try {
        contact = await getContact(contactId)
      } catch (err: any) {
        error = { message: err.message }
      }
    }

    return {
      props: {
        contact,
        error,
      },
    }
  },
})

EditContact.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>
}
