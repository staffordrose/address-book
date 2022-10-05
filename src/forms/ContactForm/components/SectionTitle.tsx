import type { FC } from "react"
import { Box, Icon, Tooltip } from "@chakra-ui/react"
import type { As } from "@chakra-ui/react"

interface SectionTitleProps {
  leftIcon: As<any>
  children: string
}

const SectionTitle: FC<SectionTitleProps> = ({ leftIcon, children }) => {
  return (
    <Box w="full" maxW={1280} mx="auto" px={4}>
      <Tooltip placement="right" aria-label={children} label={children}>
        <span style={{ display: "inline-block", verticalAlign: "middle" }}>
          <Icon as={leftIcon} display="block" w={8} h={8} />
        </span>
      </Tooltip>
    </Box>
  )
}

export default SectionTitle
