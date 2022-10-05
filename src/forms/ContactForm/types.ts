import { FormikErrors, FormikTouched } from "formik"

interface EmailAddress {
  id: string
  email_type: "Home" | "Work" | "Other"
  email_address: string
}

interface PhoneNumber {
  id: string
  phone_type: "Cell" | "Home" | "Work" | "Other"
  phone_number: string
}

interface MailingAddress {
  id: string
  address_type: "Home" | "Work" | "Other"
  address_line_1: string
  address_line_2: string
  city: string
  region: string
  postal_code: string
  country: string
}

interface Date {
  id: string
  date_type: "Birthday" | "Anniversary" | "Custom"
  date_custom_type: string
  date_str: string
}

interface Url {
  id: string
  url_type: "Home" | "Work" | "Other"
  url: string
}

interface Note {
  id: string
  note: string
}

export interface Values {
  id: string
  avatar_url: string
  first_name: string
  middle_name: string
  last_name: string
  nickname: string
  gender: "Male" | "Female" | "Nonbinary" | "Transgender" | "Other" | string
  gender_other: string
  email_addresses: EmailAddress[]
  phone_numbers: PhoneNumber[]
  mailing_addresses: MailingAddress[]
  company: string
  department: string
  occupation: string
  dates: Date[]
  urls: Url[]
  notes: Note[]
}

export interface FormProps {
  values: Values
  touched: FormikTouched<Values>
  errors: FormikErrors<Values>
  getFieldProps: any
}
