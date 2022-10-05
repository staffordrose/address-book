import { Contact } from "@/common/types"

// TODO: Add social links
// TODO: Add link to photo in supabase storage

class VCardCreate {
  contact: Contact
  vcard: string

  constructor(contact: Contact) {
    this.contact = contact
    this.vcard = "BEGIN:VCARD\nVERSION:4.0"

    // Call save when class is instantiated
    this.save()
  }

  clean(field: string | undefined) {
    return field?.replace(/^\s+|\s+$/g, "") || ""
  }

  formatNote(n: string) {
    n = n.replace(/[\n]/g, " ")
    n = n.replace(/[,]+/g, ",")
    n = n.replace(/[;]+/g, ";")
    return n
  }

  getIdentityFields() {
    let { first_name, middle_name, last_name, nickname, gender } = this.contact

    first_name = this.clean(first_name)
    middle_name = this.clean(middle_name)
    last_name = this.clean(last_name)
    nickname = this.clean(nickname)

    if (first_name) {
      this.vcard += `\nN`
      this.vcard += `:${last_name};${first_name};${middle_name};;`

      this.vcard += `\nFN`
      this.vcard += `:${first_name}${middle_name ? ` ${middle_name}` : ``}${
        last_name ? ` ${last_name}` : ``
      }`
    }

    if (nickname) {
      this.vcard += `\nNICKNAME`
      this.vcard += `:${nickname}`
    }

    if (gender) {
      this.vcard += `\nGENDER`
      this.vcard += `:${gender}`
    }
  }

  getOrgFields() {
    let { company, department, occupation } = this.contact

    company = this.clean(company)
    department = this.clean(department)
    occupation = this.clean(occupation)

    if (company) {
      this.vcard += `\nORG`
      this.vcard += `:${company};${department};`
    }

    if (occupation) {
      this.vcard += `\nTITLE`
      this.vcard += `:${occupation}`
    }
  }

  getPhoneFields() {
    let { phone_numbers } = this.contact

    if (Array.isArray(phone_numbers) && phone_numbers.length) {
      phone_numbers = phone_numbers
        .slice()
        .sort((a, b) => a.phone_order - b.phone_order)

      for (const item of phone_numbers) {
        let { phone_number, phone_type, is_primary } = item

        phone_number = this.clean(phone_number)

        this.vcard += `\nTEL`
        this.vcard += `;TYPE=${
          phone_type ? `${phone_type.toLowerCase()},voice` : `voice`
        }${is_primary ? `,pref` : ``}`
        this.vcard += `;VALUE=uri:tel`
        this.vcard += `:+1-${phone_number.slice(0, 3)}-${phone_number.slice(
          3,
          6,
        )}-${phone_number.slice(6)}`
      }
    }
  }

  getEmailFields() {
    let { email_addresses } = this.contact

    if (Array.isArray(email_addresses) && email_addresses.length) {
      email_addresses = email_addresses
        .slice()
        .sort((a, b) => a.email_order - b.email_order)

      for (const item of email_addresses) {
        let { email_address, email_type, is_primary } = item

        email_address = this.clean(email_address)

        this.vcard += `\nEMAIL`
        this.vcard += `;TYPE=internet${
          email_type ? `,${email_type.toLowerCase()}` : ``
        }${is_primary ? (email_type ? `,pref` : `pref`) : ``}`
        this.vcard += `:${email_address}`
      }
    }
  }

  getMailingFields() {
    let { mailing_addresses } = this.contact

    if (Array.isArray(mailing_addresses) && mailing_addresses.length) {
      mailing_addresses = mailing_addresses
        .slice()
        .sort((a, b) => a.address_order - b.address_order)

      for (const item of mailing_addresses) {
        let {
          address_line_1,
          address_line_2,
          city,
          region,
          postal_code,
          country,
          address_type,
          is_primary,
        } = item

        address_line_1 = this.clean(address_line_1)
        address_line_2 = this.clean(address_line_2)
        city = this.clean(city)
        region = this.clean(region)
        country = this.clean(country)

        this.vcard += `\nADR`
        if (address_type || is_primary) {
          this.vcard += `;TYPE=${
            address_type ? `${address_type.toLowerCase()}` : ``
          }${is_primary ? (address_type ? `,pref` : `pref`) : ``}`
        }
        this.vcard += `:;${address_line_2};${address_line_1};${city};${region};${postal_code};${country}`
      }
    }
  }

  getUrlFields() {
    let { urls } = this.contact

    if (Array.isArray(urls) && urls.length) {
      urls = urls.slice().sort((a, b) => a.url_order - b.url_order)

      for (const item of urls) {
        let { url, url_type, is_primary } = item

        url = this.clean(url)

        this.vcard += `\nURL`
        if (url_type || is_primary) {
          this.vcard += `;TYPE=${url_type ? `${url_type.toUpperCase()}` : ``}${
            is_primary ? (url_type ? `,pref` : `pref`) : ``
          }`
        }
        this.vcard += `:${url}`
      }
    }
  }

  // getSocialFields() {
  //   let { facebook, twitter, youtube, skype, flickr } = this.contact;

  //   facebook = this.clean(facebook);
  //   twitter = this.clean(twitter);
  //   youtube = this.clean(youtube);
  //   skype = this.clean(skype);
  //   flickr = this.clean(flickr);

  //   // TODO: Add tiktok, instagram, and others

  //   if (facebook && facebook !== "http://www.facebook.com/") {
  //     this.vcard += `\nsocialProfile;type=facebook:${facebook}`;
  //   }

  //   if (twitter && twitter !== "http://www.twitter.com/") {
  //     this.vcard += `\nsocialProfile;type=twitter:${twitter}`;
  //   }

  //   if (flickr && flickr !== "http://www.flickr.com/") {
  //     this.vcard += `\nalbum;type=photo:${flickr}`;
  //   }

  //   // TODO: This is adding X-SKYPE
  //   if (youtube && youtube !== "http://www.youtube.com/") {
  //     this.vcard += `\nX-SKYPE:${youtube}`;
  //   }

  //   if (skype) {
  //     this.vcard += `\nX-SKYPE:${skype}`;
  //   }
  // }

  getDateFields() {
    let { dates } = this.contact

    if (Array.isArray(dates) && dates.length) {
      dates = dates.slice().sort((a, b) => a.date_order - b.date_order)

      for (const item of dates) {
        let { date_str, date_type } = item

        date_str = this.clean(date_str)

        switch (date_type) {
          case "Birthday":
            this.vcard += `\nBDAY`
            this.vcard += `:${date_str}`
            break
          case "Anniversary":
            this.vcard += `\nANNIVERSARY`
            this.vcard += `:${date_str}`
            break
          default:
            break
        }
      }
    }
  }

  getNoteFields() {
    let { notes } = this.contact

    if (Array.isArray(notes) && notes.length) {
      notes = notes.slice().sort((a, b) => a.note_order - b.note_order)

      for (const item of notes) {
        let { note } = item

        note = this.formatNote(note)

        this.vcard += `\nNOTE`
        this.vcard += `:${note}`
      }
    }
  }

  save() {
    this.getIdentityFields()
    this.getOrgFields()
    this.getPhoneFields()
    this.getEmailFields()
    this.getMailingFields()
    this.getUrlFields()
    // this.getSocialFields();
    this.getDateFields()
    this.getNoteFields()

    this.vcard += "\nEND:VCARD"
  }
}

export default VCardCreate
