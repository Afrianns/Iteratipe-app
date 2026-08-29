"use client"

import { persistedURL } from "@/lib/appendingURL"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function DropdownFilter() {
  const [showFilterList, setShowFIlterList] = useState(false)

  const buttonMenuRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)


  const params = useSearchParams()

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
        const clickedElement = event.target as Node;

        console.log(clickedElement, buttonMenuRef.current, menuRef.current)
        const buttonMenu = buttonMenuRef.current?.contains(clickedElement);
        const clickedMenu = menuRef.current?.contains(clickedElement);
        if (!buttonMenu && !clickedMenu) setShowFIlterList(false);
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <div className="flex items-center justify-end gap-x-5 relative">
      <div className="card-style-secondary p-2!">
        <button ref={buttonMenuRef} onClick={() => setShowFIlterList(true)} className="w-fit px-5 py-0 cursor-pointer hover:bg-secondary! flex items-center text-nowrap">Filter By <ChevronDown className="icon-style-secondary" /></button>
      </div>
      {showFilterList &&
        <div ref={menuRef} className="card-style absolute top-18 right-0 px-5 py-5! z-5 w-100">
            <p className="h-four-style my-3! mt-0!">Status</p>
            <ul className="p-style space-y-2">
              <li><Link className={`block cursor-pointer py-2 px-5 rounded-md ${(params.get("status") === "all" || !params.get("status")) ? "bg-secondary text-main": "hover:bg-secondary"}`} href={persistedURL(params, "status","all")}>All</Link></li>
              <li><Link className={`block cursor-pointer py-2 px-5 rounded-md ${params.get("status") === "pending" ? "bg-secondary text-main": "hover:bg-secondary"}`} href={persistedURL(params, "status","pending")}>Pending</Link></li>
              <li><Link className={`block cursor-pointer py-2 px-5 rounded-md ${params.get("status") === "in-progress" ? "bg-secondary text-main": "hover:bg-secondary"}`} href={persistedURL(params, "status","in-progress")}>In progress</Link></li>
              <li><Link className={`block cursor-pointer py-2 px-5 rounded-md ${params.get("status") === "completed" ? "bg-secondary text-main": "hover:bg-secondary"}`} href={persistedURL(params, "status","completed")}>Completed</Link></li>
            </ul>
        </div>
      }
    </div>
  )
}