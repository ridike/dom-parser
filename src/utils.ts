export function isValidUrl(url: string): boolean {
  const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/[\]@!\$&'\(\)\*\+,;=.#]+$/
  return urlRegex.test(url.toLowerCase())
}
