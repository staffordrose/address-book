import { Contact } from "@/common/types"
import { Values } from "./types"

export const mapPropsToValues = (contact: Contact) => ({
  id: contact.id,
  avatar_url: contact.avatar_url || "",
  first_name: contact.first_name || "",
  middle_name: contact.middle_name || "",
  last_name: contact.last_name || "",
  nickname: contact.nickname || "",
  gender: contact.gender || "",
  gender_other: contact.gender_other || "",
  email_addresses:
    Array.isArray(contact.email_addresses) && contact.email_addresses.length
      ? contact.email_addresses
          .slice()
          .sort((a, b) => a.email_order - b.email_order)
          .map((email_address, i) => ({
            id: email_address.id,
            email_type: email_address.email_type
              ? email_address.email_type
              : i === 0
              ? "Home"
              : "Other",
            email_address: email_address.email_address || "",
          }))
      : [],
  phone_numbers:
    Array.isArray(contact.phone_numbers) && contact.phone_numbers.length
      ? contact.phone_numbers
          .slice()
          .sort((a, b) => a.phone_order - b.phone_order)
          .map((phone_number, i) => ({
            id: phone_number.id,
            phone_type: phone_number.phone_type
              ? phone_number.phone_type
              : i === 0
              ? "Home"
              : "Other",
            phone_number: phone_number.phone_number
              ? `${phone_number.phone_number.slice(
                  0,
                  3,
                )}-${phone_number.phone_number.slice(
                  3,
                  6,
                )}-${phone_number.phone_number.slice(6)}`
              : "",
          }))
      : [],
  mailing_addresses:
    Array.isArray(contact.mailing_addresses) && contact.mailing_addresses.length
      ? contact.mailing_addresses
          .slice()
          .sort((a, b) => a.address_order - b.address_order)
          .map((mailing_address, i) => ({
            id: mailing_address.id,
            address_type: mailing_address.address_type
              ? mailing_address.address_type
              : i === 0
              ? "Home"
              : "Other",
            address_line_1: mailing_address.address_line_1 || "",
            address_line_2: mailing_address.address_line_2 || "",
            city: mailing_address.city || "",
            region: mailing_address.region || "",
            postal_code: mailing_address.postal_code
              ? mailing_address.postal_code.toString()
              : "",
            country: mailing_address.country || "USA",
          }))
      : [],
  company: contact.company || "",
  department: contact.department || "",
  occupation: contact.occupation || "",
  dates:
    Array.isArray(contact.dates) && contact.dates.length
      ? contact.dates
          .slice()
          .sort((a, b) => a.date_order - b.date_order)
          .map((date, i) => ({
            id: date.id,
            date_type: date.date_type ? date.date_type : "Birthday",
            date_custom_type: date.date_custom_type || "",
            date_str: date.date_str || "",
          }))
      : [],
  urls:
    Array.isArray(contact.urls) && contact.urls.length
      ? contact.urls
          .slice()
          .sort((a, b) => a.url_order - b.url_order)
          .map((url, i) => ({
            id: url.id,
            url_type: url.url_type ? url.url_type : i === 0 ? "Home" : "Other",
            url: url.url || "",
          }))
      : [],
  notes:
    Array.isArray(contact.notes) && contact.notes.length
      ? contact.notes
          .slice()
          .sort((a, b) => a.note_order - b.note_order)
          .map((note) => ({
            id: note.id,
            note: note.note || "",
          }))
      : [],
})

export const mapValuesToContact = (values: Values) => ({
  ...values,
  gender: values.gender as Contact["gender"],
  email_addresses:
    Array.isArray(values.email_addresses) && values.email_addresses.length
      ? values.email_addresses.map((email_address, i) => ({
          ...email_address,
          is_primary: i === 0 ? true : false,
          email_order: i,
        }))
      : [],
  phone_numbers:
    Array.isArray(values.phone_numbers) && values.phone_numbers.length
      ? values.phone_numbers.map((phone_number, i) => ({
          ...phone_number,
          is_primary: i === 0 ? true : false,
          phone_order: i,
          phone_number: phone_number.phone_number.replace(/-/g, ""),
        }))
      : [],
  mailing_addresses:
    Array.isArray(values.mailing_addresses) && values.mailing_addresses.length
      ? values.mailing_addresses.map((mailing_address, i) => ({
          ...mailing_address,
          is_primary: i === 0 ? true : false,
          address_order: i,
          postal_code: parseInt(mailing_address.postal_code),
        }))
      : [],
  dates:
    Array.isArray(values.dates) && values.dates.length
      ? values.dates.map((date, i) => ({
          ...date,
          date_order: i,
        }))
      : [],
  urls:
    Array.isArray(values.urls) && values.urls.length
      ? values.urls.map((url, i) => ({
          ...url,
          is_primary: i === 0 ? true : false,
          url_order: i,
        }))
      : [],
  notes:
    Array.isArray(values.notes) && values.notes.length
      ? values.notes.map((note, i) => ({
          ...note,
          note_order: i,
        }))
      : [],
})
