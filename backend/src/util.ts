export function generateRandomId(length: number) {
  // Base 36 means we use digits 0-9 and lowercase letters a-z
  return Array.from(Array(length), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("")
}
