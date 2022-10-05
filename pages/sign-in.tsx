import type { ReactNode } from "react"
import { useRouter } from "next/router"
import { Box, Center, Heading } from "@chakra-ui/react"
import { Auth } from "@/features"
import { FullWidthLayout } from "@/layout"

export default function SignIn() {
  const router = useRouter()
  return (
    <Center h="full" minH="calc(100vh - 64px)">
      <Box w="full" maxW={640} px={4}>
        <Heading as="h1" mb={4}>
          Sign In
        </Heading>

        <Auth router={router} />
      </Box>
    </Center>
  )
}

SignIn.getLayout = function getLayout(page: ReactNode) {
  return <FullWidthLayout>{page}</FullWidthLayout>
}
