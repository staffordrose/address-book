import fs from "fs"
import path from "path"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const contacts = fs.readFileSync(
      path.join(process.cwd(), `/public/faker/contacts.json`),
      "utf8",
    )

    res.status(200).json(contacts)
  } catch (error: any) {
    res.send({ status: 400, error: error.message })
  }
}
