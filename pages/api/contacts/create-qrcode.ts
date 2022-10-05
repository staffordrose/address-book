import type { NextApiRequest, NextApiResponse } from "next"
import QrCode from "qrcode"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const vcard = await QrCode.toString(req.body.vcard, {
      type: "svg",
      width: req.body.options?.width,
    })

    res.status(200).json({ vcard })
  } catch (error: any) {
    res.send({ status: 400, error: error.message })
  }
}
