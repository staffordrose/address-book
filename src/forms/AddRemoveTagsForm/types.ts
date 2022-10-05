export interface Tag {
  id: string
  initialIsChecked: boolean
  initialIsIndeterminate: boolean
  isChecked: boolean
  isIndeterminate: boolean
  name: string
  contacts: string[]
}

export interface Values {
  tags: Tag[]
}
