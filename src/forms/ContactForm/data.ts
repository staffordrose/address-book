import {
  MdAlternateEmail,
  MdBusiness,
  MdEvent,
  MdLink,
  MdPerson,
  MdPhone,
  MdPlace,
  MdShortText,
} from "react-icons/md"
import {
  DatesFieldArray,
  EmailAddressesFieldArray,
  IdentityFields,
  MailingAddressesFieldArray,
  NotesFieldArray,
  OrganizationFields,
  PhoneNumbersFieldArray,
  UrlsFieldArray,
} from "./sections"

export const sections = [
  {
    leftIcon: MdPerson,
    title: "Identity",
    component: IdentityFields,
  },
  {
    leftIcon: MdBusiness,
    title: "Organization",
    component: OrganizationFields,
  },
  {
    leftIcon: MdPhone,
    title: "Phone Numbers",
    component: PhoneNumbersFieldArray,
  },
  {
    leftIcon: MdAlternateEmail,
    title: "Email Addresses",
    component: EmailAddressesFieldArray,
  },
  {
    leftIcon: MdPlace,
    title: "Mailing Addresses",
    component: MailingAddressesFieldArray,
  },
  {
    leftIcon: MdLink,
    title: "Personal Webpages",
    component: UrlsFieldArray,
  },
  {
    leftIcon: MdEvent,
    title: "Significant Dates",
    component: DatesFieldArray,
  },
  {
    leftIcon: MdShortText,
    title: "Notes",
    component: NotesFieldArray,
  },
]
