import * as Yup from "yup"

export const validationSchema = Yup.object({
  first_name: Yup.string().required("Required"),
  middle_name: Yup.string(),
  last_name: Yup.string(),
})
