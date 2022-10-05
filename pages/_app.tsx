import type { ReactNode } from "react"
import type { NextPage } from "next"
import type { AppProps } from "next/app"
import { UserProvider } from "@supabase/auth-helpers-react"
import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "@/common/theme"
import "@fontsource/roboto"
import "@fontsource/roboto-slab"

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode
}

type Props = AppProps & {
  Component: Page
}

function MyApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout || ((page: ReactNode) => page)

  return (
    <UserProvider supabaseClient={supabaseClient}>
      <ChakraProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </UserProvider>
  )
}

export default MyApp
