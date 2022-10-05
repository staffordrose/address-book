import { useState } from "react"
import { CheckboxValue } from "@/common/types"

interface UseCheckboxGroup {
  defaultValue: CheckboxValue[]
}

const useCheckboxGroup = ({ defaultValue = [] }: UseCheckboxGroup) => {
  const [value, setValue] = useState<CheckboxValue[]>(defaultValue)

  const clearValue = () => setValue([])

  const getCheckboxProps = (item: { value: CheckboxValue }) => ({
    ...item,
    isChecked: value.includes(item.value),
    onChange: () => {
      if (value.includes(item.value)) {
        setValue(value.filter((v: CheckboxValue) => v !== item.value))
      } else {
        setValue([...value, item.value])
      }
    },
  })

  return { value, setValue, clearValue, getCheckboxProps }
}

export default useCheckboxGroup
