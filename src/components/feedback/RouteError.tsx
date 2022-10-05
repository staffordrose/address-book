import type { FC } from "react"
import { Center, Heading, Icon, Text, VStack } from "@chakra-ui/react"
import { MdErrorOutline } from "react-icons/md"

interface RouteErrorProps {
  title?: string
  description?: string
}

const RouteError: FC<RouteErrorProps> = ({ title = "", description }) => {
  return (
    <Center w="full" h="full" minH="calc(100vh - 64px)">
      <VStack spacing={8} p={4}>
        <Icon as={MdErrorOutline} boxSize={16} color="red.500" />
        {!!title && (
          <Heading as="h1" color="red.900" textAlign="center">
            {title}
          </Heading>
        )}
        {!!description && (
          <Text color="red.900" textAlign="center">
            {description}
          </Text>
        )}
      </VStack>
    </Center>
  )
}

export default RouteError
