import type { FC, Ref } from "react"
import { Select } from "@chakra-ui/react"
import type { SelectProps } from "@chakra-ui/react"

interface SelectFieldProps extends SelectProps {
  innerRef?: Ref<HTMLSelectElement>
  options: (string | number)[]
}

const SelectField: FC<SelectFieldProps> = ({
  variant = "flushed",
  size = "sm",
  options,
  focusBorderColor = "teal.500",
  _hover = { bg: "teal.50" },
  _focus = { bg: "teal.50" },
  ...props
}) => {
  return (
    <Select
      variant={variant}
      size={size}
      color={props.value ? "black" : "gray.400"} // Changes placeholder color
      focusBorderColor={focusBorderColor}
      _hover={_hover}
      _focus={_focus}
      {...props}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </Select>
  )
}

export default SelectField
