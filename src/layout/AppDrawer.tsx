import { useRef } from "react"
import type { FC } from "react"
import NextLink from "next/link"
import type { User } from "@supabase/auth-helpers-nextjs"
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Icon,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { MdAccountCircle, MdImportContacts, MdMenu } from "react-icons/md"
import { Avatar } from "@/components"
import { useUserProfile } from "@/hooks"
import { MainNav } from "@/layout"

interface AppDrawerProps {
  user: User | undefined
}

const AppDrawer: FC<AppDrawerProps> = ({ user }) => {
  const [profile] = useUserProfile(user)

  const btnRef = useRef<HTMLButtonElement | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <IconButton
        ref={btnRef}
        variant="ghost"
        size="md"
        colorScheme="teal"
        display={["inline-flex", "none"]}
        visibility={["visible", "hidden"]}
        color="black"
        aria-label="Toogle drawer"
        icon={<Icon as={MdMenu} boxSize={6} />}
        onClick={onOpen}
      />
      <IconButton
        ref={btnRef}
        variant="ghost"
        size="lg"
        colorScheme="teal"
        display={["none", "inline-flex", null, null, "none"]}
        visibility={["hidden", "visible", null, null, "hidden"]}
        color="black"
        aria-label="Toogle drawer"
        icon={<Icon as={MdMenu} boxSize={7} />}
        onClick={onOpen}
      />

      <Drawer
        finalFocusRef={btnRef}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent bg="#fffff7">
          <DrawerCloseButton
            top={3}
            right={2}
            w={10}
            h={10}
            _focus={{ boxShadow: "none" }}
            sx={{
              "& > svg": {
                width: 4,
                height: 4,
              },
            }}
          />
          <DrawerHeader
            display="flex"
            justifyContent="flex-start"
            pl={2}
            py={3}
            borderBottomWidth={1}
            borderBottomStyle="solid"
            borderBottomColor="gray.200"
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
                onClick={() => {
                  if (typeof onClose === "function") {
                    onClose()
                  }
                }}
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
          </DrawerHeader>

          <DrawerBody p={0}>
            <MainNav onClose={onClose} />
          </DrawerBody>

          <DrawerFooter
            minH={24}
            px={0}
            py={0}
            borderTopWidth={1}
            borderTopStyle="solid"
            borderTopColor="gray.200"
          >
            <NextLink href="/account" passHref>
              <Box
                as="a"
                w="full"
                h="full"
                _hover={{ bg: "teal.50" }}
                _focus={{ bg: "teal.100" }}
                _active={{ bg: "teal.100" }}
                aria-label="Go to account"
                onClick={onClose}
              >
                <Flex
                  justifyContent="flex-start"
                  alignItems="center"
                  gap={2}
                  w="full"
                  h="full"
                  p={2}
                >
                  {user ? (
                    <Avatar
                      storageBucket="avatars"
                      path={profile?.avatar_url || ""}
                      name={`${profile?.first_name} ${profile?.last_name}`}
                      size="lg"
                    />
                  ) : (
                    <Icon as={MdAccountCircle} boxSize={16} color="teal.600" />
                  )}

                  <Flex flexDir="column" alignItems="flex-start">
                    <Text fontWeight="bold" noOfLines={1}>
                      {user
                        ? profile?.first_name
                          ? `${profile.first_name}${
                              profile.middle_name
                                ? ` ${profile.middle_name}`
                                : ``
                            }${
                              profile.last_name ? ` ${profile.last_name}` : ``
                            }`
                          : ``
                        : `Account`}
                    </Text>

                    {!!user?.email && (
                      <Text fontSize="sm" noOfLines={1}>
                        {user.email}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Box>
            </NextLink>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default AppDrawer
