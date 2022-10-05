import type { FC } from "react"
import { Icon, Text } from "@chakra-ui/react"
import { MdStar } from "react-icons/md"

const PrimaryBadge: FC = () => {
  return (
    <Text
      as="span"
      display="inline-flex"
      gap="2px"
      alignItems="center"
      w="auto"
      h="18px"
      ml={1}
      mb="2px"
      px="4px"
      borderRadius={2}
      color="yellow.700"
      bg="yellow.100"
      sx={{ verticalAlign: "middle" }}
    >
      <Icon as={MdStar} w="14px" h="14px" />
      <Text
        as="span"
        colorScheme="yellow"
        display={["none", null, "inline-block"]}
        fontSize="xs"
        fontWeight="medium"
      >
        Primary
      </Text>
    </Text>
  )
}

export default PrimaryBadge
