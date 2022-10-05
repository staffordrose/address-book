import type { FC, ReactNode } from "react"
import { VStack } from "@chakra-ui/react"

interface FieldArrayWrapperProps {
  children: ReactNode
}

const FieldArrayWrapper: FC<FieldArrayWrapperProps> = (props) => {
  return (
    <VStack
      borderTopWidth={1}
      borderTopStyle="solid"
      borderTopColor="gray.200"
      spacing={0}
      mb={8}
      {...props}
    />
  )
}

export default FieldArrayWrapper
