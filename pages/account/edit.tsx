import { useState } from "react"
import type { ReactNode } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { getUser, withPageAuth } from "@supabase/auth-helpers-nextjs"
import { Flex, Icon, useToast } from "@chakra-ui/react"
import { MdSave } from "react-icons/md"
import { Profile } from "@/common/types"
import { ResponsiveButton, RouteError } from "@/components"
import { ProfileForm } from "@/forms"
import { ActionBar, SidebarLayout } from "@/layout"
import {
  addUserAvatarUrl,
  getUserProfile,
  removeUserAvatarUrl,
  updateUserProfile,
} from "@/lib/supabase"

interface AccountEditProps {
  profile: Profile
  error: Error | null
}

export default function AccountEdit({ profile, error }: AccountEditProps) {
  const router = useRouter()

  const toast = useToast()

  const [isSubmitting, setSubmitting] = useState(false)

  const onDeleteAvatar = async () => {
    try {
      await removeUserAvatarUrl()

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
      await addUserAvatarUrl(url)

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

  const onSubmit = async (profile: Profile) => {
    try {
      await updateUserProfile(profile)

      toast({
        title: "Profile updated.",
        status: "success",
        position: "bottom-right",
        duration: 3000,
        isClosable: true,
      })

      router.push("/account")
    } catch (error: any) {
      toast({
        title: "Error updating profile.",
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

  return (
    <>
      <Head>
        <title>Edit Account | Address Book</title>
        <meta
          name="description"
          content="Change your profile name or avatar."
        />
      </Head>

      <ActionBar
        backHref="/account"
        backAriaLabel="Go back to account"
        title="Edit Profile"
      >
        <Flex gap={0}>
          <ResponsiveButton
            variant="solid"
            leftIcon={<Icon as={MdSave} boxSize={6} />}
            form="profile-form"
            type="submit"
            aria-label="Save profile"
            isLoading={isSubmitting}
            loadingText="Saving"
            isDisabled={isSubmitting}
          >
            Save
          </ResponsiveButton>
        </Flex>
      </ActionBar>

      <ProfileForm
        profile={profile}
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
    let profile = {}
    let error = null

    try {
      const { user } = await getUser(ctx)

      profile = await getUserProfile(user.id || "")
    } catch (err: any) {
      error = { message: err.message }
    }

    return {
      props: {
        profile,
        error,
      },
    }
  },
})

AccountEdit.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>
}
