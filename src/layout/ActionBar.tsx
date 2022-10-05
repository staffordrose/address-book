import type { FC, ReactNode } from "react"
import { Grid, Heading, Icon } from "@chakra-ui/react"
import { MdArrowBack } from "react-icons/md"
import { IconButtonLink } from "@/components"

interface ActionBarProps {
  templateColumns?: string[] | string
  gap?: number
  px?: number
  backHref?: string
  backAriaLabel?: string
  title: string
  hideTitle?: boolean
  children?: ReactNode
}

const ActionBar: FC<ActionBarProps> = ({
  templateColumns = "40px 1fr auto",
  gap = 2,
  px = 2,
  backHref,
  backAriaLabel,
  title,
  hideTitle,
  children,
}) => {
  return (
    <Grid
      position="sticky"
      zIndex={1200}
      top={16}
      templateColumns={templateColumns}
      gap={gap}
      alignItems="center"
      w="full"
      h={12}
      px={px}
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderBottomColor="gray.200"
      bg="#fffff7"
    >
      {backHref ? (
        <IconButtonLink
          href={backHref}
          aria-label={backAriaLabel || "Go back"}
          icon={<Icon as={MdArrowBack} boxSize={6} />}
        />
      ) : (
        <span />
      )}

      <Heading
        as="h1"
        fontSize="2xl"
        display={hideTitle ? "none" : "inline"}
        visibility={hideTitle ? "hidden" : "visible"}
        noOfLines={hideTitle ? undefined : 1}
      >
        {title}
      </Heading>

      {children}
    </Grid>
  )
}

export default ActionBar
