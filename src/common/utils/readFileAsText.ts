function readFileAsText(file: File): Promise<string> {
  const reader = new FileReader()
  return new Promise<string>((resolve, reject) => {
    reader.onload = (event) => resolve(event.target?.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsText(file)
  })
}

export default readFileAsText
