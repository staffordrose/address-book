import { useEffect } from "react"
import type { FC } from "react"
import NextLink from "next/link"
import type { NextRouter } from "next/router"
import shallow from "zustand/shallow"
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Icon,
  List,
  ListItem,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { MdExpandMore, MdLabelOutline } from "react-icons/md"
import { Collapse } from "@/components"
import { useTagsStore } from "@/store"
import CreateLabel from "./CreateLabel"
import DeleteLabel from "./DeleteLabel"
import EditLabel from "./EditLabel"

interface LabelsProps {
  router: NextRouter
  onClose?: () => void
}

const Labels: FC<LabelsProps> = ({ router, onClose: onCloseDrawer }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const onToggle = () => (isOpen ? onClose() : onOpen())

  const { tags, fetchTags } = useTagsStore(
    (state) => ({
      tags: state.tags,
      fetchTags: state.fetchTags,
    }),
    shallow,
  )

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  return (
    <Flex as="li" flexDir="column" w="full">
      <Button
        variant="unstyled"
        display="flex"
        justifyContent="flex-start"
        w="full"
        pl={3}
        pr={3}
        fontSize="md"
        _hover={{ bg: "teal.50" }}
        _focus={{ bg: "teal.100" }}
        leftIcon={
          <Icon
            as={MdExpandMore}
            boxSize={6}
            color="teal.600"
            sx={{ transform: isOpen ? "rotate(180deg)" : undefined }}
          />
        }
        onClick={onToggle}
      >
        Labels
      </Button>

      <Collapse isOpen={isOpen}>
        <List
          spacing={2}
          overflowY="auto"
          h="full"
          maxH="calc(100vh - 356px)"
          mt={2}
        >
          {tags
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tag, i) => {
              const href = `/labels/${tag.id}`
              const isActive = router.asPath === href

              return (
                <ListItem key={i}>
                  <Grid
                    role="group"
                    templateColumns="1fr auto"
                    pl={3}
                    borderRadius="md"
                    bg={isActive ? "teal.100" : "transparent"}
                    _hover={{ bg: isActive ? "teal.100" : "teal.50" }}
                    _focus={{ bg: "teal.100" }}
                    _active={{ bg: "teal.100" }}
                  >
                    <NextLink href={href} passHref>
                      <Box
                        as="a"
                        display="grid"
                        gridTemplateColumns="repeat(2, auto)"
                        gap={2}
                        justifyContent="start"
                        alignItems="center"
                        w="full"
                        h={10}
                        onClick={() => {
                          if (typeof onCloseDrawer === "function") {
                            onCloseDrawer()
                          }
                        }}
                      >
                        <Icon
                          as={MdLabelOutline}
                          boxSize={6}
                          color="teal.600"
                        />
                        <Text
                          as="span"
                          fontFamily="heading"
                          fontWeight={600}
                          noOfLines={1}
                        >
                          {tag.name}
                        </Text>
                      </Box>
                    </NextLink>

                    <Flex
                      position="relative"
                      justifyContent="flex-end"
                      w="auto"
                      minW={20}
                      h={10}
                    >
                      <Flex
                        position="absolute"
                        zIndex={1}
                        top={0}
                        right={0}
                        borderRadius="md"
                        bg={isActive ? "teal.100" : "teal.50"}
                        opacity={0}
                        _groupHover={{ opacity: 1 }}
                        _groupActive={{ bg: "teal.100" }}
                      >
                        <EditLabel tag={tag} fetchTags={fetchTags} />
                        <DeleteLabel
                          router={router}
                          tag={tag}
                          fetchTags={fetchTags}
                        />
                      </Flex>

                      <Center w={10} h={10}>
                        <Tag
                          variant="subtle"
                          size="md"
                          colorScheme="yellow"
                          fontWeight={700}
                        >
                          {Array.isArray(tag.contacts)
                            ? tag.contacts.length
                            : 0}
                        </Tag>
                      </Center>
                    </Flex>
                  </Grid>
                </ListItem>
              )
            })}

          <ListItem>
            <CreateLabel fetchTags={fetchTags} />
          </ListItem>
        </List>
      </Collapse>
    </Flex>
  )
}

export default Labels
