import type { FC, Ref } from "react"
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import type { InputProps } from "@chakra-ui/react"

interface PhoneFieldProps extends InputProps {
  innerRef?: Ref<HTMLInputElement>
}

const PhoneField: FC<PhoneFieldProps> = ({
  innerRef,
  variant = "flushed",
  size = "sm",
  pattern = "^[0-9]{3}-[0-9]{3}-[0-9]{4}$",
  title = "Eg. 123-123-1234",
  focusBorderColor = "teal.500",
  _hover = { bg: "teal.50" },
  _focus = { bg: "teal.50" },
  ...props
}) => {
  return (
    <InputGroup variant={variant} size={size}>
      <InputLeftElement pointerEvents="none" fontWeight="medium">
        {"+1"}
      </InputLeftElement>
      <Input
        ref={innerRef}
        type="tel"
        pattern={pattern}
        title={title}
        focusBorderColor={focusBorderColor}
        _hover={_hover}
        _focus={_focus}
        {...props}
      />
    </InputGroup>
  )
}

export default PhoneField
