import type { FC, ReactNode } from "react"
import { Box } from "@chakra-ui/react"
import Header from "./Header"

interface FullWidthLayoutProps {
  children: ReactNode
}

const FullWidthLayout: FC<FullWidthLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Box as="main" w="full" maxW={1920} h="full" mx="auto">
        {children}
      </Box>
    </>
  )
}

export default FullWidthLayout
