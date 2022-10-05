function hasArrayProperty(arr: any[], property: string) {
  return Array.isArray(arr) && arr.some((i) => i[property])
}

export default hasArrayProperty
