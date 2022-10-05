import { MailingAddress } from "@/common/types"

function encodeMailingAddress({
  address_line_1,
  address_line_2,
  city,
  region,
  postal_code,
  country,
}: MailingAddress): string {
  return encodeURIComponent(
    `${address_line_1}${
      address_line_2 ? `, ${address_line_2}` : ``
    }, ${city}, ${region}, ${postal_code}, ${country}`,
  )
}

export default encodeMailingAddress
