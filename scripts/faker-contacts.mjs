import fs from "fs"
import { faker } from "@faker-js/faker"

const contactsCount = 85

const sharedTypes = ["Home", "Work", "Other"]
const phoneTypes = ["Cell", "Home", "Work", "Other"]
const dateTypes = ["Birthday", "Anniversary", "Custom"]

const genderProbabilities = {
  46.25: "Male", // 46.25%
  92.5: "Female", // 46.25%
  95: "Nonbinary", // 2.5%
  97.5: "Transgender", // 2.5%
  100: "Other", // 2.5%
}

const generateGender = () => {
  const rand = Math.floor(Math.random() * 100)
  const keys = Object.keys(genderProbabilities).map(Number)
  const key = keys.find((key) => rand < key)

  return genderProbabilities[key]
}

const generateEmailAddresses = (count) => {
  const emailAddresses = []

  for (let i = 0; i < count; i++) {
    emailAddresses.push({
      is_primary: i === 0,
      email_order: i,
      email_type: sharedTypes[Math.floor(Math.random() * sharedTypes.length)],
      email_address: faker.internet.email().toLowerCase(),
    })
  }

  return emailAddresses
}

const generatePhoneNumbers = (count) => {
  const phoneNumbers = []

  for (let i = 0; i < count; i++) {
    phoneNumbers.push({
      is_primary: i === 0,
      phone_order: i,
      phone_type: phoneTypes[Math.floor(Math.random() * phoneTypes.length)],
      phone_number: faker.phone.phoneNumber("##########"),
    })
  }

  return phoneNumbers
}

const generateMailingAddresses = (count) => {
  const mailingAddresses = []

  for (let i = 0; i < count; i++) {
    mailingAddresses.push({
      is_primary: i === 0,
      address_order: i,
      address_type: sharedTypes[Math.floor(Math.random() * sharedTypes.length)],
      address_line_1: faker.address.streetAddress(false),
      address_line_2:
        Math.random() > 0.5 ? faker.address.secondaryAddress() : "",
      city: faker.address.city(),
      region: faker.address.state(),
      postal_code: parseInt(faker.address.zipCode()),
      country: "USA",
    })
  }

  return mailingAddresses
}

const generateDates = (count) => {
  const dates = []

  for (let i = 0; i < count; i++) {
    const dateType = dateTypes[Math.floor(Math.random() * dateTypes.length)]

    dates.push({
      date_order: i,
      date_type: dateType,
      date_custom_type: dateType === "Custom" ? "Day we met" : "",
      date_str: faker.date.past(65).toISOString().split("T")[0],
    })
  }

  return dates
}

const generateUrls = (count) => {
  const urls = []

  for (let i = 0; i < count; i++) {
    urls.push({
      is_primary: i === 0,
      url_order: i,
      url_type: sharedTypes[Math.floor(Math.random() * sharedTypes.length)],
      url: faker.internet.url(),
    })
  }

  return urls
}

const generateNotes = (count) => {
  const urls = []

  for (let i = 0; i < count; i++) {
    urls.push({
      note_order: i,
      note: faker.lorem.sentences(Math.floor(Math.random() * 4)),
    })
  }

  return urls
}

const generateFakerContact = () => {
  const gender = generateGender()
  const isGenderBinary = ["Male", "Female"].includes(gender)
  const isGenderOther = gender === "Other"

  const company = Math.random() > 0.75 ? faker.company.companyName() : ""

  return {
    avatar_url: Math.random() > 0.5 ? faker.image.avatar() : "",
    first_name: isGenderBinary
      ? faker.name.firstName(gender === "Male" ? "male" : "female")
      : faker.name.firstName(),
    middle_name:
      Math.random() > 0.66
        ? isGenderBinary
          ? faker.name.middleName(gender === "Male" ? "male" : "female")
          : faker.name.middleName()
        : "",
    last_name: isGenderBinary
      ? faker.name.lastName(gender === "Male" ? "male" : "female")
      : faker.name.lastName(),
    nickname: "",
    gender,
    gender_other: isGenderOther ? faker.name.gender(false) : "",
    email_addresses: generateEmailAddresses(Math.floor(Math.random() * 3)),
    phone_numbers: generatePhoneNumbers(Math.floor(Math.random() * 3)),
    mailing_addresses: generateMailingAddresses(Math.floor(Math.random() * 3)),
    company,
    department: company ? faker.name.jobArea() : "",
    occupation: company ? faker.name.jobTitle() : "",
    dates: generateDates(Math.floor(Math.random() * 2)),
    urls: generateUrls(Math.floor(Math.random() * 2)),
    notes: generateNotes(Math.floor(Math.random() * 2)),
  }
}

;(function () {
  const fakerContacts = []

  for (let i = 0; i < contactsCount; i++) {
    const contact = generateFakerContact()
    fakerContacts.push(contact)
  }

  // Write to public faker directory.
  if (!fs.existsSync(`public/faker`)) {
    fs.mkdirSync(`public/faker`)
  }

  let data = JSON.stringify(fakerContacts, null, 2)

  fs.writeFile(`public/faker/contacts.json`, data, (err) => {
    if (err) throw err
  })
})()
