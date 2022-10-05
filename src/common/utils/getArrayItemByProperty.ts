function getArrayItemByProperty(arr: any[], property: string) {
  return Array.isArray(arr) && arr.find((i) => i[property])
}

export default getArrayItemByProperty
