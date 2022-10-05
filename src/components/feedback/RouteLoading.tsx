import type { FC } from "react"
import { Center, Heading, Spinner, Text, VStack } from "@chakra-ui/react"

interface RouteLoadingProps {
  title?: string
  description?: string
}

const RouteLoading: FC<RouteLoadingProps> = ({ title = "", description }) => {
  return (
    <Center w="full" h="full" minH="calc(100vh - 64px)">
      <VStack spacing={8} p={4}>
        <Spinner size="xl" />
        {!!title && (
          <Heading as="h1" textAlign="center">
            {title}
          </Heading>
        )}
        {!!description && <Text textAlign="center">{description}</Text>}
      </VStack>
    </Center>
  )
}

export default RouteLoading
