import { useState } from "react"
import type { FC } from "react"
import type { NextRouter } from "next/router"
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Icon,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react"
import { FcGoogle } from "react-icons/fc"
import { InputField } from "@/components"
import { signInWithMagicLink, signInWithProvider } from "@/lib/supabase"

interface AuthProps {
  router: NextRouter
}

const Auth: FC<AuthProps> = ({ router }) => {
  const [isGoogleLoading, setGoogleLoading] = useState(false)

  const [isMagicLinkLoading, setMagicLinkLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  const handleGoogleLogin = async () => {
    setStatus("")
    setError("")
    setGoogleLoading(true)

    try {
      await signInWithProvider({ provider: "google" })
    } catch (error: any) {
      setError(error.error_description || error.message)
    } finally {
      setGoogleLoading(false)

      router.push("/")
    }
  }

  const handleEmailLogin = async (email: string) => {
    setStatus("")
    setError("")
    setMagicLinkLoading(true)

    try {
      await signInWithMagicLink({ email })
      setEmail("")
      setStatus("Check your email for the login link!")
    } catch (error: any) {
      setError(error.error_description || error.message)
    } finally {
      setMagicLinkLoading(false)
    }
  }

  return (
    <>
      <Box
        w="full"
        mb={4}
        borderWidth={1}
        borderStyle="solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <VStack spacing={4} w="full" p={4}>
          <Text>Sign in with your Google account</Text>

          <IconButton
            size="lg"
            aria-label="Sign in with Google"
            isLoading={isGoogleLoading}
            onClick={(e) => {
              e.preventDefault()
              handleGoogleLogin()
            }}
            icon={<Icon as={FcGoogle} boxSize={8} />}
          />
        </VStack>

        <Flex w="full" alignItems="center">
          <Divider />
          <Text px={4} py={3} textTransform="uppercase">
            or
          </Text>
          <Divider />
        </Flex>

        <VStack spacing={4} w="full" p={4}>
          <Text>Continue with your email</Text>

          <InputField
            size="md"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            colorScheme="teal"
            w="full"
            isLoading={isMagicLinkLoading}
            loadingText="Submitting"
            onClick={(e) => {
              e.preventDefault()
              handleEmailLogin(email)
            }}
          >
            Send Magic Link
          </Button>
        </VStack>
      </Box>

      <Center w="full" minH={6}>
        {!!status && <Text color="green.500">{status}</Text>}
        {!!error && <Text color="red.500">{error}</Text>}
      </Center>
    </>
  )
}

export default Auth
