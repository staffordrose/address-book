import type { FC } from "react"
import { Box, Icon, IconButton, Tooltip, useClipboard } from "@chakra-ui/react"
import type { BoxProps } from "@chakra-ui/react"
import { MdCheck, MdContentCopy } from "react-icons/md"

interface CopyContentProps extends BoxProps {
  justify?: string
  align?: string
  contentType: string
  content: string
}

const CopyContent: FC<CopyContentProps> = ({
  display = "flex",
  justify = "space-between",
  align = "center",
  w = "100%",
  maxW,
  _hover = { bg: "teal.50" },
  contentType,
  content,
  children,
}) => {
  const { hasCopied, onCopy } = useClipboard(content)

  const label = hasCopied ? "Copied!" : `Copy ${contentType}`

  return (
    <Box
      className="copy-content"
      display={display}
      gap={3}
      justifyContent={justify}
      alignItems={align}
      w={w}
      maxW={maxW}
      _hover={_hover}
    >
      {children}

      <Tooltip
        hasArrow
        placement="top"
        closeOnClick={false}
        aria-label={label}
        label={label}
      >
        <IconButton
          variant="ghost"
          size="sm"
          h="full"
          minH={8}
          borderRadius="none"
          sx={{
            opacity: 0,
            ".copy-content:hover &": {
              opacity: 1,
            },
            "&:hover": {
              bg: "teal.100",
            },
          }}
          aria-label={label}
          icon={<Icon as={hasCopied ? MdCheck : MdContentCopy} boxSize={4} />}
          onClick={onCopy}
        />
      </Tooltip>
    </Box>
  )
}

export default CopyContent
