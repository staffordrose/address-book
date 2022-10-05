import * as Yup from "yup"

const phoneRegExp = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/

export const validationSchema = Yup.object({
  first_name: Yup.string().required(),
  middle_name: Yup.string(),
  last_name: Yup.string(),
  nickname: Yup.string(),
  gender: Yup.string(),
  email_addresses: Yup.array().of(
    Yup.object().shape({
      email_address: Yup.string().email("Invalid email address").required(),
      email_type: Yup.string().required(),
    }),
  ),
  phone_numbers: Yup.array().of(
    Yup.object().shape({
      phone_number: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required(),
      phone_type: Yup.string().required(),
    }),
  ),
  mailing_addresses: Yup.array().of(
    Yup.object().shape({
      address_line_1: Yup.string().required(),
      address_line_2: Yup.string(),
      city: Yup.string().required(),
      region: Yup.string().required(),
      postal_code: Yup.string()
        .test(
          "len",
          "Must be exactly 5 characters",
          (val: string | undefined) => !val || val.length === 5,
        )
        .required(),
      country: Yup.string().required(),
      address_type: Yup.string().required(),
    }),
  ),
  company: Yup.string(),
  department: Yup.string(),
  occupation: Yup.string(),
  dates: Yup.array().of(
    Yup.object().shape({
      date_str: Yup.date().required(),
      date_type: Yup.string().required(),
      date_custom_type: Yup.string().when("date_type", {
        is: (val: string) => val === "Custom",
        then: Yup.string().required(),
      }),
    }),
  ),
  urls: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().required(),
      url_type: Yup.string().required(),
    }),
  ),
  notes: Yup.array().of(
    Yup.object().shape({
      note: Yup.string().required(),
    }),
  ),
})
