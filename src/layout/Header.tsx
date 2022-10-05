import { useEffect, useRef, useState } from "react"
import type { FC } from "react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useUser } from "@supabase/auth-helpers-react"
import {
  AspectRatio,
  Box,
  Button,
  Center,
  CloseButton,
  Fade,
  Flex,
  Grid,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Portal,
  Spinner,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react"
import { MdAccountCircle, MdImportContacts, MdSearch } from "react-icons/md"
import { Contact } from "@/common/types"
import { Avatar } from "@/components"
import { useUserProfile } from "@/hooks"
import { AppDrawer } from "@/layout"
import { searchContacts } from "@/lib/supabase"

const Header: FC = () => {
  const router = useRouter()

  const { user } = useUser()

  const [profile] = useUserProfile(user || undefined)

  const inputRef = useRef<HTMLDivElement | null>(null)

  const [query, setQuery] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [matches, setMatches] = useState<Contact[]>([])
  const { isOpen, onToggle } = useDisclosure()

  const clear = () => {
    setQuery("")
    setMatches([])
    onToggle()
  }

  useOutsideClick({
    ref: inputRef,
    handler: () => isOpen && clear(),
  })

  useEffect(() => {
    const handler = async (query: string) => {
      setLoading(true)

      try {
        const data = await searchContacts(query)

        setMatches(data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      handler(query)
    } else {
      setMatches([])
    }
  }, [query])

  const handleChange = (value: string) => {
    if (!isOpen) onToggle()
    setQuery(value)
  }

  return (
    <Box
      as="header"
      position="sticky"
      zIndex={1300}
      top={0}
      h={16}
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderBottomColor="gray.200"
      bg="#fffff7"
    >
      <Grid
        templateColumns={[
          "auto minmax(auto, 640px)",
          null,
          null,
          null,
          "286px minmax(auto, 640px) 1fr",
        ]}
        gap={[3, null, 4]}
        justifyContent="start"
        alignItems="center"
        w="full"
        maxW={1920}
        h="full"
        mx="auto"
        px={[3, null, 4]}
      >
        <AppDrawer user={user || undefined} />

        <Box
          display={["none", null, null, null, "flex"]}
          visibility={["hidden", null, null, null, "visible"]}
        >
          <NextLink href="/" passHref>
            <Button
              as="a"
              variant="unstyled"
              display="flex"
              justifyContent="flex-start"
              w="auto"
              pl={3}
              pr={3}
              fontSize="md"
              _hover={{ bg: "teal.50" }}
              _focus={{ bg: "teal.100" }}
              _active={{ bg: "teal.100" }}
              leftIcon={
                <Icon as={MdImportContacts} boxSize={8} color="gray.800" />
              }
            >
              <Text
                fontFamily="heading"
                fontSize="lg"
                fontWeight={700}
                color="gray.800"
              >
                Address Book
              </Text>
            </Button>
          </NextLink>
        </Box>

        <Box ref={inputRef} position="relative" w="full">
          <InputGroup
            size="md"
            display={["block", "none"]}
            visibility={["visible", "hidden"]}
          >
            <Input
              focusBorderColor="teal.500"
              _placeholder={{ opacity: 0.5, color: "black" }}
              placeholder="Search contacts"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
            />
            <InputRightElement>
              <CloseButton
                size="md"
                visibility={query ? "visible" : "hidden"}
                onClick={clear}
              />
            </InputRightElement>
          </InputGroup>
          <InputGroup
            size="lg"
            display={["none", "block"]}
            visibility={["hidden", "visible"]}
          >
            <InputLeftElement pointerEvents="none">
              <Icon as={MdSearch} boxSize="28px" color="black" />
            </InputLeftElement>
            <Input
              focusBorderColor="teal.500"
              _placeholder={{ opacity: 0.5, color: "black" }}
              placeholder="Search contacts"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
            />
            <InputRightElement>
              <CloseButton
                size="lg"
                visibility={query ? "visible" : "hidden"}
                onClick={clear}
              />
            </InputRightElement>
          </InputGroup>

          <Portal containerRef={inputRef}>
            <Fade in={isOpen}>
              <Box
                position="absolute"
                zIndex="dropdown"
                top={["44px", "52px"]}
                left={0}
                visibility={isOpen ? "visible" : "hidden"}
                overflowY="auto"
                w="full"
                minH="259px"
                borderRadius="md"
                bg="yellow.50"
                shadow="2xl"
              >
                {Array.isArray(matches) && matches.length ? (
                  <VStack spacing={0} divider={<StackDivider />}>
                    {matches.map(
                      (
                        {
                          id: contactId,
                          avatar_url = "",
                          first_name,
                          middle_name,
                          last_name,
                          nickname,
                        },
                        i,
                      ) => (
                        <Flex
                          key={i}
                          gap={3}
                          alignItems="center"
                          w="full"
                          minH={16}
                          px={3}
                          py={2}
                          cursor="pointer"
                          _hover={{ bg: "yellow.100" }}
                          onClick={() => {
                            router.push(`/contacts/${contactId}`)
                            clear()
                          }}
                        >
                          <Avatar
                            storageBucket="contacts.avatars"
                            path={avatar_url}
                            name={`${first_name} ${last_name}`}
                            size="md"
                          />
                          <Text>
                            {nickname
                              ? nickname
                              : first_name
                              ? `${first_name}${
                                  middle_name ? ` ${middle_name}` : ``
                                }${last_name ? ` ${last_name}` : ``}`
                              : "Contact"}
                          </Text>
                        </Flex>
                      ),
                    )}
                  </VStack>
                ) : isLoading ? (
                  <Center w="full" h="259px">
                    <Spinner />
                  </Center>
                ) : error ? (
                  <Center w="full" h="259px">
                    <Text color="red.500">{error}</Text>
                  </Center>
                ) : (
                  <Flex
                    flexDir="column"
                    gap={2}
                    justifyContent="center"
                    alignItems="center"
                    p={4}
                  >
                    <Text fontSize="2xl" fontWeight="bold">
                      {query
                        ? "No contacts match your search"
                        : "Search by name"}
                    </Text>
                    <AspectRatio w="full" maxW="560px" ratio={2}>
                      <Image
                        src="/images/man-holding-binoculars-finding-something.svg"
                        alt="Man Holding Binoculars Finding Something"
                        width="full"
                        height={[150, 225, 300]}
                        objectFit="cover"
                      />
                    </AspectRatio>
                    <Text color="gray.500" fontSize="xs" textAlign="center">
                      Attribution:{" "}
                      <Link
                        href="https://iconscout.com/illustrations/searching"
                        isExternal
                      >
                        Man holding binoculars finding something Illustration
                      </Link>{" "}
                      by{" "}
                      <Link
                        href="https://iconscout.com/contributors/iconscout"
                        isExternal
                      >
                        Iconscout
                      </Link>
                    </Text>
                  </Flex>
                )}
              </Box>
            </Fade>
          </Portal>
        </Box>

        <Flex
          display={["none", null, null, null, "flex"]}
          justifyContent="flex-end"
          visibility={["hidden", null, null, null, "visible"]}
        >
          <NextLink href={`/account`} passHref>
            <IconButton
              as="a"
              variant="ghost"
              size="lg"
              colorScheme="teal"
              position="relative"
              borderRadius="full"
              _hover={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  zIndex: 1,
                  w: "100%",
                  h: "100%",
                  borderRadius: "full",
                  bg: "teal.50",
                  opacity: 0.25,
                },
              }}
              aria-label="Go to account"
              icon={
                user ? (
                  <Avatar
                    storageBucket="avatars"
                    path={profile?.avatar_url || ""}
                    name={`${profile?.first_name} ${profile?.last_name}`}
                    size="md"
                  />
                ) : (
                  <Icon as={MdAccountCircle} boxSize={12} />
                )
              }
            />
          </NextLink>
        </Flex>
      </Grid>
    </Box>
  )
}

export default Header
