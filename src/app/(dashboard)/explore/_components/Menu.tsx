"use client"

import { labelType } from "@/types/types";
import ListMenus from "@/components/ListMenus";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { persistedURL } from "@/lib/appendingURL";

export default function Menu({types, sortType}: {types: labelType[], sortType: "asc"|"desc"}) {

  const data = usePathname()
  const params = useSearchParams()

  console.log(data)

  // const mappingURL = (sortType: "asc"|"desc") => {

    
  //   if(param.has("type")) {
  //     return `?type=${param.get("type")}&sortby=${sortType}`
  //   } else{
  //     return `?sortby=${sortType}`
  //   }
  // }

  const containSortType = (sortType: "asc"|"desc") => {
    const param = useSearchParams()

    if(param.has("sortby")) {
      return `&sortby=${sortType}`
    }
    return ""
  }

  return (
    <ListMenus types={types} additional={containSortType(sortType)}>
      <Link href={persistedURL(params, "sortby", sortType)} className={`col-span-2 md:col-span-1 text-center hover:bg-secondary/50 text-xs py-2 px-2 rounded-md cursor-pointer text-nowrap
      `}>Sort By <span>{(sortType == "desc" ? "newest" : "oldest").toUpperCase()}</span></Link>
    </ListMenus>
  )
}