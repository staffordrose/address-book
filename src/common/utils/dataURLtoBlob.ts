async function dataURLtoBlob(dataUrl: string): Promise<Blob> {
  const res: Response = await fetch(dataUrl)
  const blob: Blob = await res.blob()

  return blob
}

export default dataURLtoBlob
