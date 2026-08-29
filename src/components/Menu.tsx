"use client"

import { labelType, SortingType } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { persistedURL } from "@/lib/appendingURL";

import Link from "next/link";
import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { handleScroll } from "@/lib/handleScroll";

export default function Menu({types, sortType}: {types: labelType[], sortType: SortingType}) {

  const params = useSearchParams()

  let colorFrom = "from-whitish"

  const [scrollLabelsRef, showGradientLabelsLeft, showGradientLabelsRight] = useGradientScrollEdge(handleScroll);
  const initialType = "All";

  return (
    
    <div className="card-style-secondary grid grid-cols-6 items-center justify-between p-2! overflow-hidden">
      <div className="relative overflow-hidden  col-span-4 md:col-span-5">
        <span className={`scroll-edge-style right-0 bg-linear-to-l ${colorFrom} from-45% to-transparent to-90% ${
            showGradientLabelsRight ? 'block opacity-100' : 'hidden opacity-0'
        }`}></span>
        
        <span className={`scroll-edge-style left-0 bg-linear-to-r ${colorFrom} from-45% to-transparent to-90% ${
            showGradientLabelsLeft ? 'block opacity-100' : 'hidden opacity-0'
        }`}></span>
        
        <div className="scroll-container-style" ref={scrollLabelsRef}>
          <Link href={persistedURL(params, "type", initialType)} className={`text-xs py-2 px-4 rounded-md cursor-pointer ${params.get("type") === initialType || !params.has("type") && !params.has("section") ? "bg-secondary text-main": "hover:bg-secondary"}`}>{initialType}</Link>
          {types.map((type) => (
            <Link href={persistedURL(params, "type", type.name)} key={type.id} className={`text-nowrap text-xs py-2 px-4 rounded-md cursor-pointer ${params.get("type") === type.name ? "bg-secondary text-main": "hover:bg-secondary"}`}>{type.name}</Link>
          ))}
        </div>
      </div>
      <Link href={persistedURL(params, "sortby", sortType)} className={`col-span-2 md:col-span-1 text-center hover:bg-secondary/50 text-xs py-2 px-2 rounded-md cursor-pointer text-nowrap
      `}>Sort By <span>{(sortType == "DSC" ? "newest" : "oldest").toUpperCase()}</span></Link>
    </div>
    
  )
}