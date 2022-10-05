import type { FC, Ref } from "react"
import { Input } from "@chakra-ui/react"
import type { InputProps } from "@chakra-ui/react"

interface InputFieldProps extends InputProps {
  innerRef?: Ref<HTMLInputElement>
}

const InputField: FC<InputFieldProps> = ({
  innerRef,
  type = "text",
  variant = "flushed",
  size = "sm",
  focusBorderColor = "teal.500",
  _hover = { bg: "teal.50" },
  _focus = { bg: "teal.50" },
  ...props
}) => {
  return (
    <Input
      ref={innerRef}
      type={type}
      variant={variant}
      size={size}
      focusBorderColor={focusBorderColor}
      _hover={_hover}
      _focus={_focus}
      {...props}
    />
  )
}

export default InputField
