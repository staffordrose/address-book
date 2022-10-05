import type { FC, Ref } from "react"
import { Textarea } from "@chakra-ui/react"
import type { TextareaProps } from "@chakra-ui/react"

interface TextareaFieldProps extends TextareaProps {
  innerRef?: Ref<HTMLTextAreaElement>
}

const TextareaField: FC<TextareaFieldProps> = ({
  innerRef,
  variant = "flushed",
  size = "sm",
  resize = "none",
  focusBorderColor = "teal.500",
  _hover = { bg: "teal.50" },
  _focus = { bg: "teal.50" },
  ...props
}) => {
  return (
    <Textarea
      ref={innerRef}
      variant={variant}
      size={size}
      resize={resize}
      focusBorderColor={focusBorderColor}
      _hover={_hover}
      _focus={_focus}
      {...props}
    />
  )
}

export default TextareaField
