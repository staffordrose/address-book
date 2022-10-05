import type { FC, ReactNode } from "react"
import NextLink from "next/link"
import type { NextRouter } from "next/router"
import {
  Grid,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
  useToast,
} from "@chakra-ui/react"
import type { As } from "@chakra-ui/react"
import {
  MdAccountCircle,
  MdFileDownload,
  MdFileUpload,
  MdLogout,
  MdPerson,
  MdPersonAdd,
} from "react-icons/md"
import { signOut } from "@/lib/supabase"

const links = [
  {
    path: "/contacts",
    icon: MdPerson,
    title: `View Contacts`,
  },
  {
    path: "/contacts/add",
    icon: MdPersonAdd,
    title: `Add Contact`,
  },
  {
    path: "/import",
    icon: MdFileUpload,
    title: `Import Contacts`,
  },
  {
    path: "/export",
    icon: MdFileDownload,
    title: `Export Contacts`,
  },
  {
    path: "/account",
    icon: MdAccountCircle,
    title: `Account`,
  },
]

interface GridItemLinkProps {
  icon?: As<any>
  href: string
  children: ReactNode
}

const GridItemLink: FC<GridItemLinkProps> = ({ icon, href, children }) => {
  return (
    <LinkBox
      as={Grid}
      justifyContent="center"
      justifyItems="center"
      alignContent="center"
      alignItems="center"
      gap={3}
      w="full"
      minH={40}
      p={6}
      borderWidth={1}
      borderStyle="solid"
      borderColor="gray.200"
      borderRadius="xl"
      fontSize="xl"
      _hover={{
        borderColor: "teal.50",
        bg: "teal.50",
      }}
      _focus={{
        borderColor: "teal.100",
        bg: "teal.100",
      }}
      _active={{
        borderColor: "teal.100",
        bg: "teal.100",
      }}
    >
      {icon !== null && <Icon as={icon} boxSize={16} color="teal.600" />}

      <NextLink href={href} passHref>
        <LinkOverlay>
          <Text as="span" fontFamily="heading" fontWeight={600} noOfLines={1}>
            {children}
          </Text>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  )
}

interface GridItemButtonProps {
  icon?: As<any>
  onClick: () => Promise<void>
  children: ReactNode
}

const GridItemButton: FC<GridItemButtonProps> = ({
  icon,
  onClick,
  children,
}) => {
  return (
    <Grid
      justifyContent="center"
      justifyItems="center"
      alignContent="center"
      alignItems="center"
      gap={3}
      w="full"
      minH={40}
      p={6}
      borderWidth={1}
      borderStyle="solid"
      borderColor="gray.200"
      borderRadius="xl"
      fontSize="xl"
      cursor="pointer"
      _hover={{
        borderColor: "teal.50",
        bg: "teal.50",
      }}
      _focus={{
        borderColor: "teal.100",
        bg: "teal.100",
      }}
      _active={{
        borderColor: "teal.100",
        bg: "teal.100",
      }}
      aria-label={typeof children === "string" ? children : ""}
      onClick={onClick}
    >
      {icon !== null && <Icon as={icon} boxSize={16} color="teal.600" />}

      <Text as="span" fontFamily="heading" fontWeight={600} noOfLines={1}>
        {children}
      </Text>
    </Grid>
  )
}

interface LinkGridProps {
  router: NextRouter
  setLoading: (isLoading: boolean) => void
  setLoadingText: (loadingText: string) => void
}

const LinkGrid: FC<LinkGridProps> = ({
  router,
  setLoading,
  setLoadingText,
}) => {
  const toast = useToast()

  const onSignOut = async () => {
    setLoadingText("Signing You Out")
    setLoading(true)

    try {
      await signOut()
    } catch (error: any) {
      toast({
        title: "Error signing you out.",
        description: error.message,
        status: "error",
        position: "bottom-right",
        duration: 6000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
      setLoadingText("Signing You In")

      // Trigger getServerSideProps
      router.replace(router.asPath)
    }
  }

  return (
    <Grid
      templateColumns="repeat(auto-fit, minmax(240px, 1fr))"
      gap={4}
      w="full"
      maxW={960}
      mx="auto"
    >
      {links.map(({ path, icon, title }) => (
        <GridItemLink key={path} icon={icon} href={path}>
          {title}
        </GridItemLink>
      ))}

      <GridItemButton icon={MdLogout} onClick={onSignOut}>
        Sign Out
      </GridItemButton>
    </Grid>
  )
}

export default LinkGrid
