export type CheckboxValue = string | number

export type GetCheckboxProps = (args: { value: CheckboxValue }) => {
  value: CheckboxValue
  isChecked: boolean
  onChange: () => void
}
