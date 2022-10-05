import { v4 as uuid } from "uuid"
import {
  ContactWithPhotoURI,
  VCard,
  VCardAdr,
  VCardEmail,
  VCardTel,
  VCardUrl,
} from "@/common/types"

function parseProperty(
  obj: { [key: string]: any },
  property: string,
  value: any,
) {
  switch (property) {
    case "ADR":
      obj["mailing_addresses"] = value.map(
        (
          {
            type,
            value: {
              countryName,
              extendedAddress,
              locality,
              postOfficeBox,
              postalCode,
              region,
              streetAddress,
            },
          }: VCardAdr,
          i: number,
        ) => ({
          id: "",
          is_primary: value.some(({ type }: { type: string[] }) =>
            type.includes("PREF"),
          )
            ? type.includes("PREF")
            : i === 0,
          address_type: type.includes("HOME")
            ? "Home"
            : type.includes("WORK")
            ? "Work"
            : "Other",
          address_line_1: streetAddress,
          address_line_2: extendedAddress || postOfficeBox,
          city: locality,
          region: region,
          postal_code: Number(postalCode),
          country: countryName,
        }),
      )
      break
    case "ANNIVERSARY":
    case "BDAY":
    case "DATE":
      obj["dates"] = [
        ...(obj.dates ?? []),
        {
          id: "",
          date_order: Array.isArray(obj.dates) ? obj.dates.length : 0,
          date_type:
            property === "ANNIVERSARY"
              ? "Anniversary"
              : property === "BDAY"
              ? "Birthday"
              : "Custom",
          date_custom_type: !["ANNIVERSARY", "BDAY"].includes(property)
            ? ""
            : undefined,
          date_str: value,
        },
      ]
      break
    case "EMAIL":
      obj["email_addresses"] = value.map(
        ({ type, value: email_address }: VCardEmail, i: number) => ({
          id: "",
          is_primary: value.some(({ type }: { type: string[] }) =>
            type.includes("PREF"),
          )
            ? type.includes("PREF")
            : i === 0,
          email_order: i,
          email_type: type.includes("HOME")
            ? "Home"
            : type.includes("WORK")
            ? "Work"
            : "Other",
          email_address,
        }),
      )
      break
    case "FN":
      {
        const arr = value.split(" ")

        if (arr.length === 3) {
          obj["first_name"] = obj.first_name || arr[0]
          obj["middle_name"] = obj.middle_name || arr[1]
          obj["last_name"] = obj.last_name || arr[2]
        } else if (arr.length === 2) {
          obj["first_name"] = obj.first_name || arr[0]
          obj["last_name"] = obj.last_name || arr[1]
        } else if (arr.length === 1) {
          obj["first_name"] = obj.first_name || arr[0]
        }
      }
      break
    case "N":
      if (value.givenNames)
        obj["first_name"] = obj.first_name || value.givenNames
      if (value.additionalNames)
        obj["middle_name"] = obj.middle_name || value.additionalNames
      if (value.familyNames)
        obj["last_name"] = obj.last_name || value.familyNames
      break
    case "NICKNAME":
      obj["nickname"] = value
      break
    case "NOTE":
      obj["notes"] = value.map((note: string, i: number) => ({
        id: "",
        note_order: i,
        note,
      }))
      break
    case "ORG":
      if (value.name) obj["company"] = value.name
      if (value.unit1 || value.unit2)
        obj["department"] = value.unit2 || value.unit1
      break
    case "PHOTO":
      if (value.type.includes("ENCODING=BASE64")) {
        if (["GIF", "PNG", "JPEG"].some((ext) => value.type.includes(ext))) {
          obj["photo_uri"] = `data:image/${
            value.type.includes("GIF")
              ? `gif`
              : value.type.includes("PNG")
              ? `png`
              : `jpeg`
          };base64,${value.value}`
        }
      } else {
        obj["photo_uri"] = value.value
      }
      break
    case "TEL":
      obj["phone_numbers"] = value.map(
        ({ type, value: phone_number }: VCardTel, i: number) => ({
          id: "",
          is_primary: value.some(({ type }: { type: string[] }) =>
            type.includes("PREF"),
          )
            ? type.includes("PREF")
            : i === 0,
          phone_order: i,
          phone_type:
            type.includes("VOICE") || type.includes("CELL")
              ? "Cell"
              : type.includes("HOME")
              ? "Home"
              : type.includes("WORK")
              ? "Work"
              : "Other",
          phone_number:
            phone_number.replace(/[^0-9]/g, "").length > 10
              ? phone_number.replace(/[^0-9]/g, "").slice(1)
              : phone_number.replace(/[^0-9]/g, ""),
        }),
      )
      break
    case "TITLE":
      obj["occupation"] = value
      break
    case "URL":
      obj["urls"] = value.map(({ type, value: url }: VCardUrl, i: number) => ({
        id: "",
        is_primary: value.some(({ type }: { type: string[] }) =>
          type.includes("PREF"),
        )
          ? type.includes("PREF")
          : i === 0,
        url_order: i,
        url_type: type.includes("HOME")
          ? "Home"
          : type.includes("WORK")
          ? "Work"
          : "Other",
        url,
      }))
      break
    default:
      break
  }
}

function mapVCardToContact(vCard: VCard): ContactWithPhotoURI {
  let obj = { id: uuid() } as ContactWithPhotoURI

  for (const property in vCard) {
    parseProperty(obj, property, vCard[property as keyof VCard])
  }

  return obj
}

export default mapVCardToContact
