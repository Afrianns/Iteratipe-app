import { ReadonlyURLSearchParams } from "next/navigation"

type PkeyType = "status"|"type"|"sortby"|"search"

export const persistedURL = (params: ReadonlyURLSearchParams, pKey: PkeyType, value: string) => {
  const keys = ["status","type","sortby", "search"]

  let initialURL: string[] = []

  console.log(params, pKey, value)

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