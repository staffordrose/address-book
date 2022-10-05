export type VCardAdr = {
  type: string[]
  value: {
    countryName: string
    extendedAddress: string
    locality: string
    postOfficeBox: string
    postalCode: string
    region: string
    streetAddress: string
  }
}

export type VCardEmail = {
  type: ("PREF" | "HOME" | "WORK" | "INTERNET")[]
  value: string
}

export type VCardN = {
  additionalNames?: string
  familyNames?: string
  givenNames?: string
  honorificPrefixes?: string
  honorificSuffixes?: string
}

export type VCardOrg = {
  name?: string
  unit1?: string
  unit2?: string
}

export type VCardPhoto = {
  type: ("JPEG" | "PNG" | "GIF" | "ENCODING=BASE64")[]
  value: string
}

export type VCardTel = {
  type: ("PREF" | "FAX" | "VOICE" | "CELL" | "HOME" | "WORK")[]
  value: string
}

export type VCardUrl = {
  type: string[]
  value: string
}

export type VCard = {
  ADR?: VCardAdr[]
  ANNIVERSARY?: string
  BDAY?: string
  DATE?: string
  EMAIL?: VCardEmail[]
  N?: VCardN
  NICKNAME?: string
  NOTE?: string[]
  ORG?: VCardOrg
  PHOTO?: VCardPhoto
  TEL?: VCardTel[]
  TITLE?: string
  URL?: VCardUrl[]
}
