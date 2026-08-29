"use client"

import { persistedURL } from "@/lib/appendingURL"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Search() {

  const [loading, setLoading] = useState<boolean>(false)
  const [valueExist, setValueExist] = useState<boolean>(false)
  const [value, setValue] = useState<string>("")
  const params = useSearchParams()

  const path = usePathname()

  const router = useRouter()

  useEffect(() => {
    if(params.has("search")) {
      setValue(params.get("search") as string)
      setValueExist(true)
    }
  }, [])

  const beforeSearch = (data: FormData) => {
    const searchValue = data.get("search")
    doSearch(searchValue as string)
  }

  const doSearch = (search: string) => {

    if(search){
      console.log(search)
      router.push(persistedURL(params, "search", search))
      setValueExist(true)
    } else{
      resetSearchValue()
    }
    setLoading(false)
  } 
  
  const resetSearchValue = () => {
    setValue("")
    setValueExist(false)
    setLoading(true)
    
    if(params.has("search")) {
      const url =  new URLSearchParams(window.location.search)      
      url.delete("search")
      router.push(`${path}?${url.toString()}`)
      setLoading(false)
    }
  }

  return (
    <form action={beforeSearch} onSubmit={() => setLoading(true)} className="h-15 flex mt-10 p-2 bg-grayish/50 rounded-lg relative">
      <input type="text" name="search" className="rounded-lg border outline-main border-grayish focus:ring-0 w-full absolute h-full top-0 left-0 p-5 text-lg" placeholder="Search designs..." value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="ml-auto h-full relative space-x-2">
        {loading ? 
          <button type="button" className="bg-main/30 text-whitish px-20 rounded-sm hover:bg-main/20 h-full animate-pulse cursor-wait">Searching...</button>
        :
          <button type="submit" className="bg-main text-whitish px-20 rounded-sm cursor-pointer hover:bg-main/50 h-full">Search</button>
        }
        {valueExist &&
          <button type="button" onClick={resetSearchValue} className="bg-light-red/10 text-light-red px-10 rounded-sm cursor-pointer hover:bg-light-red/20 h-full">Reset</button>
        }
      </div>
    </form>
  )
}