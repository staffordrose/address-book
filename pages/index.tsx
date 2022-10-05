import { useState } from "react"
import type { ReactNode } from "react"
import { useRouter } from "next/router"
import { getUser, withPageAuth } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"
import { Box, Center, Heading } from "@chakra-ui/react"
import { Profile } from "@/common/types"
import { RouteError, RouteLoading } from "@/components"
import { LinkGrid } from "@/features"
import { FullWidthLayout } from "@/layout"
import { getUserProfile } from "@/lib/supabase"

interface HomeProps {
  user: User
  profile: Profile
  error: Error | null
}

export default function Home({ user, profile, error }: HomeProps) {
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Signing You In")

  if (isLoading) {
    return <RouteLoading title={loadingText} />
  }

  if (error) {
    return <RouteError title="There Was an Error" description={error.message} />
  }

  return (
    <Center flexDir="column" w="full" minH="calc(100vh - 64px)" p={4}>
      <Box w="full" maxW={960} mx="auto" mb={8}>
        <Heading as="h1">
          Welcome,{" "}
          {profile?.first_name
            ? profile.first_name
            : profile?.email_address
            ? profile.email_address
            : user?.email}
          !
        </Heading>
      </Box>

      <LinkGrid
        router={router}
        setLoading={setLoading}
        setLoadingText={setLoadingText}
      />
    </Center>
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

      if (res.user?.id) {
        user = res.user
        profile = await getUserProfile(res.user.id)
      }
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

Home.getLayout = function getLayout(page: ReactNode) {
  return <FullWidthLayout>{page}</FullWidthLayout>
}
