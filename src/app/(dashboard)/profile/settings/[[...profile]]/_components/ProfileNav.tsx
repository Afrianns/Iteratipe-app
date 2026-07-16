"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileNav() {
    const pathname = usePathname();

    const getLastOfArray = (pathname: string) => {
        const pathArray = pathname.split("/")
        return pathArray[pathArray.length-1]
    }

    console.log(pathname)
    return (
        <ul className="flex gap-x-5 items-center">
            <Link href="/profile/settings" className={`p-style ${getLastOfArray(pathname) == "settings" ? "text-purplish!" : ""}`}>Profile</Link>
            <Link href="/profile/settings/security" className={`p-style ${getLastOfArray(pathname) == "security" ? "text-purplish!" : ""}`}>Security</Link>
        </ul>
    )   
}