// Modified from: https://github.com/jasperla/node-vcard

const validFields = {
  singleText: [
    "AGENT",
    "ANNIVERSARY",
    "BDAY",
    "BEGIN",
    "END",
    "FN",
    "FULLNAME",
    "GEO",
    "Gender", // Google Contacts .vcf export
    "MAILER",
    "NICKNAME",
    "NOTE",
    "PRODID",
    "REV",
    "ROLE",
    "TITLE",
    "TZ",
    "UID",
    "VERSION",
  ],
  multipleText: ["CATEGORIES", "NICKNAME", "ORG"],
  singleBinary: ["KEY", "LOGO", "PHOTO", "SOUND"],
  rfc2425: ["NAME", "PROFILE", "SOURCE"],
  structured: ["ADR", "EMAIL", "IMPP", "LABEL", "N", "PHOTO", "TEL", "URL"],
}

const multipleFields = ["ADR", "EMAIL", "NOTE", "TEL", "URL"]

type Callback = (error: any, json: any) => void
type Data = any[]

class VCardParse {
  readData(card: string, cb: Callback) {
    let vCards: any[] = [[]]
    let vCardsParsed: any[] = []
    let errors: any[] = []
    let validationError

    // Only split if a character is directly after a newline because of Base64 photos.
    // Google Contacts adds gender to existing line, so split that, too.
    let data: Data = card.split(/\r\n(?=\S)|\r(?=\S)|\n(?=\S)|\\n(?=Gender)/)

    let vCardCount: number = 0

    for (let i = data.length - 1; i >= 0; i--) {
      // Remove whitespace and Apple's 'item*.' prefix.
      data[i] = data[i].replace(/^item\d+\.|\r\n\s*|\r\s*|\n\s*/gm, "")

      // Push each line into the current vCard element.
      vCards[vCardCount].unshift(data[i])

      /*
       * If line is vcard start indicator but is not the first line,
       * push a new vcard element into the array to push lines into.
       */
      if (data[i] === "BEGIN:VCARD" && i !== 0) {
        vCardCount++
        vCards.push([])
      }
    }

    for (let i = 0; i < vCards.length; i++) {
      validationError = this.getValidationError(vCards[i])

      if (validationError) {
        errors.push(validationError)
        tryCallback()
      } else {
        this.parseVCard(vCards[i], (err: any, json: any) => {
          if (err) {
            errors.push(err)
          } else if (json) {
            vCardsParsed.push(json)
          }
          tryCallback()
        })
      }
    }

    function tryCallback() {
      if (vCardCount + 1 === vCards.length) {
        if (errors.length > 0) {
          cb(errors, null)
        } else {
          cb(null, vCardsParsed)
        }
      }
    }
  }

  parseVCard(data: Data, cb: Callback) {
    let inserted = 0
    let json: any = {}
    let version = this.getVersion(data)

    function addField(key: string, value: any) {
      if (multipleFields.includes(key)) {
        if (Array.isArray(json[key])) {
          json[key].unshift(value)
        } else {
          json[key] = [value]
        }
      } else {
        json[key] = value
      }
    }

    for (let f = data.length - 1; f >= 0; f--) {
      let fields = data[f].split(":")

      // Skip these fields.
      if (["BEGIN", "END"].includes(fields[0])) continue

      // First do singleText and extension fields.
      if (
        validFields.singleText.includes(fields[0]) ||
        validFields.rfc2425.includes(fields[0]) ||
        fields[0].match(/^X-.*/)
      ) {
        if (fields[0] === "X-ABDATE") {
          const f = this.hyphenateDate(fields[1])
          addField("DATE", f)
        } else if (fields[0] === "ANNIVERSARY" || fields[0] === "BDAY") {
          const f = this.hyphenateDate(fields[1])
          addField(fields[0], f)
        } else if (fields[0] === "Gender") {
          addField(fields[0].toUpperCase(), fields[1].trim())
        } else if (fields[0].includes("X-ANDROID-CUSTOM")) {
          if (fields[1].includes("vnd.android.cursor.item/nickname")) {
            addField("NICKNAME", fields[1].split(";")[1])
          } else if (
            fields[1].includes("vnd.android.cursor.item/contact_event")
          ) {
            addField("DATE", fields[1].split(";")[1])
          } else {
            addField(fields[0], fields[1])
          }
        } else {
          addField(fields[0], fields[1])
        }

        // Shrink the data buffer with what has just been added.
        data.splice(f, 1)
        inserted++
      }
    }

    // Now do structured fields.
    for (let f = data.length - 1; f >= 0; f--) {
      let fields = data[f].split(/w*(?<!https|http|https\\|http\\):/gm)

      // Skip these fields.
      if (["BEGIN", "END"].includes(fields[0])) continue

      let d = fields[0].split(";")
      let snippet: { type: string[]; value: any } = { type: [], value: "" }
      let type: string[] = []

      if (version === 2.1 || version === 3.0) {
        if (version === 3.0) {
          // Strip off 'TYPE' argument.
          for (let i = 0; i < d.length; i++) {
            if (i === 0) continue
            d[i] = d[i].replace(/TYPE=|type=/g, "").toUpperCase()
          }
        }

        // Handle the extra data before the ':' as types.
        for (let i = d.length - 1; i >= 1; i--) {
          type.push(d[i])
        }

        /*
         * If special type ('N', 'ORG', 'ADR', 'URL') handle accordingly.
         * Otherwise, just add the field.
         */
        if (d[0] === "N") {
          addField(d[0], this.parseName(fields))
        } else if (d[0] === "ORG") {
          addField(d[0], this.parseOrg(fields))
        } else {
          snippet.type = type?.filter((t) => t) ?? []

          if (d[0] === "ADR") {
            snippet.value = this.parseAddress(fields)
          } else if (d[0] === "URL") {
            let f = fields[1]
            f = f.replace(/https\\:/, "https:")
            f = f.replace(/http\\:/, "http:")
            snippet.value = f
          } else {
            snippet.value = fields[1]
          }

          addField(d[0], snippet)
        }
      } else if (version === 4.0) {
        let label = []
        let value = []

        // Use the TYPE, LABEL and VALUE fields to pop extra data into the snippet.
        for (let i = d.length - 1; i >= 1; i--) {
          if (d[i].match(/TYPE|type/)) {
            // Strip off 'TYPE' argument.
            let t = d[i]
              .replace(/TYPE=|type=/g, "")
              .replace(/\"/g, "")
              .toUpperCase()
              .split(",")

            for (let j = t.length - 1; j >= 0; j--) {
              type.push(t[j])
            }
          } else if (d[i].match(/LABEL/)) {
            // Certain labels are quoted, so unquote them now.
            label.push(d[i].replace(/LABEL=/g, "").replace(/\"/g, ""))
          } else if (d[i].match(/VALUE/)) {
            value.push(d[i].replace(/VALUE=/g, ""))
          }
        }

        /*
         * If special type ('N', 'ORG', 'ADR', 'URL') handle accordingly.
         * Otherwise, just add the field.
         */
        if (d[0] === "N") {
          addField(d[0], this.parseName(fields))
        } else if (d[0] === "ORG") {
          addField(d[0], this.parseOrg(fields))
        } else {
          snippet.type = type?.filter((t) => t) ?? []

          if (label.length > 0) {
            snippet.value = label[0]
          } else {
            if (d[0] === "ADR") {
              snippet.value = this.parseAddress(fields)
            } else if (d[0] === "URL") {
              let f = fields[1]
              f = f.replace(/https\\:/, "https:")
              f = f.replace(/http\\:/, "http:")
              snippet.value = f
            } else {
              snippet.value = fields[1]
            }
          }

          addField(d[0], snippet)
        }
      } else {
        cb("Unknown version encountered: %s", version)
      }
    }

    if (inserted > 0) {
      cb(null, json)
    } else {
      cb("No JSON elements found?!", null)
    }
  }

  parseName(fields: any) {
    const f = fields[1].split(";")
    return {
      familyNames: f[0] || "",
      givenNames: f[1] || "",
      additionalNames: f[2] || "",
      honorificPrefixes: f[3] || "",
      honorificSuffixes: f[4] || "",
    }
  }

  parseOrg(fields: any) {
    const f = fields[1].split(";")
    return {
      name: f[0] || "",
      unit1: f[1] || "",
      unit2: f[2] || "",
    }
  }

  parseAddress(fields: any) {
    const f = fields[1].split(";")
    const s = f[2].match(/\\n/) ? f[2].split(/\\n/) : []
    return {
      postOfficeBox: f[0] || "",
      extendedAddress: s[1] || f[1] || "",
      streetAddress: s[0] || f[2] || "",
      locality: f[3] || "",
      region: f[4] || "",
      postalCode: f[5] || "",
      countryName: f[6] || "",
    }
  }

  hyphenateDate(str: string) {
    if (str.match(/^\d{8}$/)) {
      str =
        str.substring(0, 4) +
        "-" +
        str.substring(4, 6) +
        "-" +
        str.substring(6, 8)
    }
    return str
  }

  /*
   * Do basic vCard data validation, check the version first and
   * based on that handle the fields that may exist.
   * Skipping any X- fields.
   */
  getValidationError(data: Data) {
    let required_elements_found = 0

    // Check for valid BEGIN/END fields.
    if (data[0] !== "BEGIN:VCARD" || data[data.length - 1] !== "END:VCARD") {
      return "BEGIN:VCARD or END:VCARD missing."
    }

    // Ensure at least the needed fields (VERSION, N and FN) exist, needed in all versions.
    for (let f = data.length - 1; f >= 0; f--) {
      if (data[f].match(/^(VERSION|FN|N):/)) {
        required_elements_found++
      }
    }

    if (required_elements_found < 2) {
      return "One or more required elements are missing (VERSION, N or FN)"
    }

    let version = this.getVersion(data)

    // For version 3.0+, we'll also need an N field to be present.
    if (version > 2.1) {
      for (let f = data.length - 1; f >= 0; f--) {
        if (data[f].match(/^N:/)) {
          required_elements_found++
        }
      }

      if (required_elements_found < 3) {
        return "One or more required elements are missing (VERSION, N and FN)"
      }
    }

    /*
     * Walk through all the fields, and check if any of the fields aren't listed
     * as valid or as an extensions.
     */
    for (let f = data.length - 1; f >= 0; f--) {
      let field = data[f].replace(/(:|;).*/g, "")
      if (
        !(
          validFields.singleText.includes(field) ||
          validFields.multipleText.includes(field) ||
          validFields.rfc2425.includes(field) ||
          validFields.singleBinary.includes(field) ||
          validFields.structured.includes(field) ||
          field.match(/^X-.*/)
        )
      ) {
        return "Invalid field found: `" + field + "`"
      }
    }
  }

  // Determine the version for the vCard.
  getVersion(data: Data) {
    let version

    // Figure out the version of the vCard format.
    for (let f = data.length - 1; f >= 0; f--) {
      if (data[f].match(/VERSION/)) {
        version = data[f].split(":")[1]
      }
    }

    version = parseFloat(version)

    if (isNaN(version)) {
      return 0
    } else {
      return version
    }
  }
}

export default VCardParse
