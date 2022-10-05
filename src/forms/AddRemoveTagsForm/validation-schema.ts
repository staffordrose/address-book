import * as Yup from "yup"

export const validationSchema = Yup.object({
  tags: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      initialIsChecked: Yup.boolean().required(),
      initialIsIndeterminate: Yup.boolean().required(),
      isChecked: Yup.boolean().required(),
      isIndeterminate: Yup.boolean().required(),
      name: Yup.string().required(),
      contacts: Yup.array().of(Yup.string().required()),
    }),
  ),
})
