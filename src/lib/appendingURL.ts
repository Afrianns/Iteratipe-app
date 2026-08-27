import { ReadonlyURLSearchParams } from "next/navigation"

export const persistedURL = (params: ReadonlyURLSearchParams, pKey: "status"|"type"|"sortby", value: string) => {
  const keys = ["status","type","sortby"]

  let initialURL: string[] = []

  keys.forEach((key) => {

    if(params.has(key) && key != pKey) {
      if(initialURL.length <= 0) {
        initialURL.push("?")
      } else{
        initialURL.push("&")
      }
      
      initialURL.push(`${key}=${params.get(key)}`)
    }
  })
  
  if(initialURL.length >= 1) {
    initialURL.push(`&${pKey}=${value}`)
  } else{
    initialURL.push(`?${pKey}=${value}`)
  }

  return initialURL.join("")
}