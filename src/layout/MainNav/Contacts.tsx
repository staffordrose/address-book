import { useEffect } from "react"
import type { FC } from "react"
import NextLink from "next/link"
import type { NextRouter } from "next/router"
import shallow from "zustand/shallow"
import { Box, Center, Grid, Icon, ListItem, Tag, Text } from "@chakra-ui/react"
import type { ButtonProps } from "@chakra-ui/react"
import { MdPerson } from "react-icons/md"
import { useContactsCountStore } from "@/store"

interface ContactsProps extends ButtonProps {
  router: NextRouter
  onClose?: () => void
}

const Contacts: FC<ContactsProps> = ({ router, onClose }) => {
  const href = "/contacts"
  const isActive = router.asPath === href

  const { count, fetchCount } = useContactsCountStore(
    (state) => ({ count: state.count, fetchCount: state.fetchCount }),
    shallow,
  )

  useEffect(() => {
    fetchCount()
  }, [fetchCount])

  return (
    <ListItem>
      <NextLink href={href} passHref>
        <Box
          as="a"
          display="grid"
          gridTemplateColumns="1fr auto"
          w="full"
          pl={3}
          borderRadius="md"
          bg={isActive ? "teal.100" : "transparent"}
          _hover={{ bg: isActive ? "teal.100" : "teal.50" }}
          _focus={{ bg: "teal.100" }}
          _active={{ bg: "teal.100" }}
          onClick={() => {
            if (typeof onClose === "function") {
              onClose()
            }
          }}
        >
          <Grid
            templateColumns="repeat(2, auto)"
            gap={2}
            justifyContent="start"
            alignItems="center"
            w="full"
            h={10}
          >
            <Icon as={MdPerson} boxSize={6} color="teal.600" />
            <Text as="span" fontFamily="heading" fontWeight={600} noOfLines={1}>
              Contacts
            </Text>
          </Grid>

          <Center w="auto" minW={10} h={10} px={2}>
            <Tag
              variant="subtle"
              size="md"
              colorScheme="yellow"
              fontWeight={700}
            >
              {count}
            </Tag>
          </Center>
        </Box>
      </NextLink>
    </ListItem>
  )
}

export default Contacts
