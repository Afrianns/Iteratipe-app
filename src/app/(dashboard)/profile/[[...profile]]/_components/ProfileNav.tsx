"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProfileNav() {
    const pathname = usePathname();
    const params = useSearchParams();
    
    const menu = params.get("additional")

    const getLastOfArray = (pathname: string) => {
        const pathArray = pathname.split("/")
        return pathArray[pathArray.length-1]
    }

    return (
        <ul className="flex gap-x-5 items-center">
            <Link href={`${persistSearchparams(menu, "/profile")}`} className={`p-style ${getLastOfArray(pathname) != "security" && "text-main!"}`}>Profile</Link>
            <Link href={`${persistSearchparams(menu, "/profile/security")}`} className={`p-style ${getLastOfArray(pathname) == "security" && "text-main!"}`}>Security</Link>
        </ul>
    )   
}


const persistSearchparams = (menu: string | null, url: string) => {
    return menu ? `${url}?additional=${menu}` : `${url}`
}