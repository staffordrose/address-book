export type EmailAddress = {
  id: string
  is_primary: boolean | null
  email_order: number
  email_type: "Home" | "Work" | "Other"
  email_address: string
}

export type PhoneNumber = {
  id: string
  is_primary: boolean | null
  phone_order: number
  phone_type: "Cell" | "Home" | "Work" | "Other"
  phone_number: string
}

export type MailingAddress = {
  id: string
  is_primary: boolean | null
  address_order: number
  address_type: "Home" | "Work" | "Other"
  address_line_1: string
  address_line_2?: string
  city: string
  region: string
  postal_code: number
  country: string
}

export type Date = {
  id: string
  date_order: number
  date_type: "Birthday" | "Anniversary" | "Custom"
  date_custom_type: string
  date_str: string
}

export type Url = {
  id: string
  is_primary: boolean | null
  url_order: number
  url_type: "Home" | "Work" | "Other"
  url: string
}

export type Note = {
  id: string
  note_order: number
  note: string
}

export type Contact = {
  id: string
  user_id?: string
  avatar_url?: string
  first_name: string
  middle_name?: string
  last_name?: string
  nickname?: string
  gender?: "Male" | "Female" | "Nonbinary" | "Transgender" | "Other"
  gender_other?: string
  email_addresses: EmailAddress[]
  phone_numbers: PhoneNumber[]
  mailing_addresses: MailingAddress[]
  company?: string
  department?: string
  occupation?: string
  dates: Date[]
  urls: Url[]
  notes: Note[]
  tags?: ContactTag[]
}

export type ContactWithPhotoURI = Contact & {
  photo_uri?: string
}

export type ContactTag = {
  id: string
  contact_id: string
  name: string
  contacts?: Contact[]
}
