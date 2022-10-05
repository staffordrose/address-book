function parseVCFEntries(str: string): string[] {
  return str
    ?.split(/\r\nEND:VCARD\r\n|\r\nEND:VCARD/)
    ?.filter((s) => s)
    ?.map((s: string) => `${s}\r\nEND:VCARD`)
}

export default parseVCFEntries
