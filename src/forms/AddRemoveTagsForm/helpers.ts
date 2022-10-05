import { CheckboxValue, ContactTag } from "@/common/types"

export const mapPropsToValues = (
  tags?: ContactTag[],
  selectedContacts?: CheckboxValue[],
) => ({
  tags: (tags ?? []).map((tag) => {
    const contacts = tag?.contacts?.map((c) => c.id) || []

    const cb = (id: string) => contacts.includes(id) || false
    const isChecked = (selectedContacts as string[]).every(cb)
    const isIndeterminate =
      !isChecked && (selectedContacts as string[]).some(cb)

    return {
      id: tag?.id ?? "",
      initialIsChecked: isChecked,
      initialIsIndeterminate: isIndeterminate,
      isChecked,
      isIndeterminate,
      name: tag?.name || "",
      contacts,
    }
  }),
})
