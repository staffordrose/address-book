import type { FC, ReactNode } from "react"
import { Box, Grid } from "@chakra-ui/react"
import Header from "./Header"
import MainNav from "./MainNav"

interface SidebarLayoutProps {
  children: ReactNode
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Grid
        position="relative"
        templateColumns={["1fr", null, null, null, "320px 1fr"]}
        w="full"
        maxW={1920}
        h="full"
        mx="auto"
      >
        <Box
          as="aside"
          position="sticky"
          top={16}
          left={0}
          display={["none", null, null, null, "block"]}
          visibility={["hidden", null, null, null, "visible"]}
          overflowY="auto"
          w={320}
          h="calc(100vh - 64px)"
          maxH="calc(100vh - 64px)"
          borderRightWidth={1}
          borderRightStyle="solid"
          borderRightColor="gray.200"
        >
          <MainNav />
        </Box>
        <Box as="main">{children}</Box>
      </Grid>
    </>
  )
}

export default SidebarLayout
