"use client"

import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { labelType } from "@/types/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { handleScroll } from "@/lib/handleScroll";
import React from "react";
import { persistedURL } from "@/lib/appendingURL";

export default function ListMenus({children, types, additional = ""}: {children: React.ReactNode, types: labelType[], additional?: string}) {

  let colorFrom = "from-whitish"

  const [scrollLabelsRef, showGradientLabelsLeft, showGradientLabelsRight] = useGradientScrollEdge(handleScroll);
  const params = useSearchParams();
  const initialType = "All";

  return (
    <div className="card-style-secondary grid grid-cols-6 items-center justify-between my-5 p-2! overflow-hidden">
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
      
      {children}
    </div>
  )
}