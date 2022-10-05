function blobToFile(blob: Blob, fileName: string, fileType: string): File {
  return new File([blob], fileName, {
    type: fileType,
  })
}

export default blobToFile
