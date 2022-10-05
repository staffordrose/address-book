import type { ReactNode } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { getUser, withPageAuth } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"
import { Box, Divider, Flex, Grid, Icon, useToast } from "@chakra-ui/react"
import { MdEdit, MdLogout } from "react-icons/md"
import { Profile } from "@/common/types"
import {
  Avatar,
  ResponsiveButton,
  ResponsiveButtonLink,
  RouteError,
} from "@/components"
import { ProfileDetails } from "@/features"
import { ActionBar, SidebarLayout } from "@/layout"
import { getUserProfile, signOut } from "@/lib/supabase"

interface AccountProps {
  user: User
  profile: Profile
  error: Error | null
}

export default function Account({ user, profile, error }: AccountProps) {
  const router = useRouter()

  const toast = useToast()

  const onSignOut = async () => {
    try {
      await signOut()
    } catch (error: any) {
      toast({
        title: "Error signing you out.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    } finally {
      // Trigger getServerSideProps
      router.replace(router.asPath)
    }
  }

  if (error?.message) {
    return <RouteError title={error.message} />
  }

  return (
    <>
      <Head>
        <title>Your Account | Address Book</title>
        <meta name="description" content="View your account profile." />
      </Head>

      <ActionBar backHref="/" backAriaLabel="Go home" title="Account">
        <Flex gap={2}>
          <ResponsiveButtonLink
            href="/account/edit"
            aria-label="Edit Profile"
            leftIcon={<Icon as={MdEdit} boxSize={6} />}
          >
            Edit
          </ResponsiveButtonLink>

          <ResponsiveButton
            aria-label="Sign Out"
            leftIcon={<Icon as={MdLogout} boxSize={6} />}
            onClick={onSignOut}
          >
            Sign Out
          </ResponsiveButton>
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
            storageBucket="avatars"
            path={profile.avatar_url || ""}
            name={`${profile.first_name} ${profile.last_name}`}
            size="2xl"
          />
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
          <ProfileDetails user={user} profile={profile} />
        </Box>
      </Grid>
    </>
  )
}

export const getServerSideProps = withPageAuth({
  redirectTo: "/sign-in",
  async getServerSideProps(ctx) {
    let user: User | null = null
    let profile: Profile | null = null
    let error = null

    try {
      const res = await getUser(ctx)

      user = res.user

      profile = await getUserProfile(res.user.id || "")
    } catch (err: any) {
      error = { message: err.message }
    }

    return {
      props: {
        user,
        profile,
        error,
      },
    }
  },
})

Account.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>
}
