import type { NextApiRequest, NextApiResponse } from "next"
import { dataURLtoBlob } from "@/common/utils"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const blob = await dataURLtoBlob(req.body.dataUrl as string)
    const bufferArray = await blob.arrayBuffer()
    const buffer = Buffer.from(bufferArray)

    res.setHeader("Content-Type", blob.type)
    res.write(buffer, "binary")
    res.end()
  } catch (error: any) {
    console.error(error)

    res.send({ status: 400, error: error.message })
  }
}
