const urlPattern: RegExp = /^(https?:\/\/[^\s,]+),?$/

const cleanedStr  = (str: string) => str.replace(/,$/, "")

export const validateUrl = (url: string) => {
  const validation: RegExpMatchArray | null = cleanedStr(url).match(urlPattern)
  if (validation === null) {
    throw new Error('This is not valid url', { cause: url }); 
  }

  return validation[0]
}
