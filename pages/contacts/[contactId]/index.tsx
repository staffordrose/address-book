import { useRef, useState } from "react"
import type { FC, ReactNode } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import type { NextRouter } from "next/router"
import { withPageAuth } from "@supabase/auth-helpers-nextjs"
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogContent,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { MdClose, MdDelete, MdEdit } from "react-icons/md"
import { Contact } from "@/common/types"
import {
  Avatar,
  ResponsiveButton,
  ResponsiveButtonLink,
  RouteError,
} from "@/components"
import { ContactDetails, ContactQuickLinks } from "@/features"
import { ActionBar, SidebarLayout } from "@/layout"
import { getContact, deleteContact } from "@/lib/supabase"
import { useContactsCountStore } from "@/store"

interface DeleteContactProps {
  router: NextRouter
  contact: Contact
}

const DeleteContact: FC<DeleteContactProps> = ({ router, contact }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const cancelRef = useRef<HTMLButtonElement | null>(null)

  const [isDeleting, setDeleting] = useState(false)

  const toast = useToast()

  const fetchCount = useContactsCountStore((state) => state.fetchCount)

  const onDelete = async () => {
    setDeleting(true)

    try {
      await deleteContact(contact.id)

      toast({
        title: "Contact deleted.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      fetchCount()

      router.push("/contacts")
    } catch (error: any) {
      toast({
        title: "Error deleting contact.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    } finally {
      setDeleting(false)
    }
  }

  const { first_name, middle_name, last_name } = contact

  const fullName = `${first_name}${
    middle_name ? ` ${middle_name.slice(0, 1)}.` : ``
  }${last_name ? ` ${last_name}` : ``}`

  return (
    <>
      <ResponsiveButton
        colorScheme="red"
        aria-label={`Delete ${fullName}`}
        leftIcon={<Icon as={MdDelete} boxSize={6} />}
        onClick={onOpen}
      >
        Delete
      </ResponsiveButton>

      <AlertDialog
        isCentered
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader pl={3} fontFamily="heading">
            Delete Contact
          </AlertDialogHeader>

          <IconButton
            variant="ghost"
            colorScheme="teal"
            position="absolute"
            top={3}
            right={3}
            aria-label="Close delete contact form"
            icon={<Icon as={MdClose} boxSize={6} />}
            onClick={onClose}
          />

          <AlertDialogBody p={3}>
            {`Are you sure you want delete ${fullName}?`}
          </AlertDialogBody>

          <AlertDialogFooter p={3}>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              leftIcon={<Icon as={MdDelete} boxSize={6} />}
              isLoading={isDeleting}
              isDisabled={isDeleting}
              onClick={onDelete}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface ContactDetailProps {
  contact: Contact
  error: Error | null
}

export default function ContactDetail({ contact, error }: ContactDetailProps) {
  const router = useRouter()

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
        <title>{fullName} | Address Book</title>
        <meta name="description" content={`View details for ${fullName}.`} />
      </Head>

      <ActionBar
        backHref="/contacts"
        backAriaLabel="Go back to Contacts"
        title={fullName}
      >
        <Flex gap={2}>
          <ResponsiveButtonLink
            href={`/contacts/${contact.id}/edit`}
            aria-label="Edit contact"
            leftIcon={<Icon as={MdEdit} boxSize={6} />}
          >
            Edit
          </ResponsiveButtonLink>

          <DeleteContact router={router} contact={contact} />
        </Flex>
      </ActionBar>

      <Grid
        position="relative"
        templateColumns={["1fr", null, "repeat(2, auto) 1fr"]}
        justifyContent="center"
        alignItems="start"
        w="full"
        maxW={960}
        mx="auto"
      >
        <Flex
          flexDir="column"
          gap={4}
          justifyContent="center"
          alignItems="center"
          position="sticky"
          top={112}
          px={10}
          pt={10}
          pb={8}
        >
          <Avatar
            storageBucket="contacts.avatars"
            path={contact.avatar_url || ""}
            name={`${first_name} ${last_name}`}
            size="2xl"
          />
          <ContactQuickLinks contact={contact} />
        </Flex>
        <Divider display={["none", null, "block"]} orientation="vertical" />
        <Divider display={["block", null, "none"]} orientation="horizontal" />

        <Box
          position="relative"
          zIndex={10}
          w="full"
          maxW={640}
          minH="calc(100vh - 112px)"
          mx="auto"
          px={[3, null, 4]}
          py={10}
          bg="#fffff7"
        >
          <ContactDetails contact={contact} />
        </Box>
      </Grid>
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

ContactDetail.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>
}
