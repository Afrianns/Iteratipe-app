"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Menu() {
    const tab = useSearchParams();

    const activeSubSettingFn = (currentTab: string) => (currentTab == tab.get("tab") || (currentTab == "general" && tab.get("tab") == undefined))  && "bg-grayish/50"
    return (
        <div className="space-y-3">
            <Link href="?menu=settings&tab=general" className={`block menu-setting-style ${activeSubSettingFn('general')}`}>General</Link>
            <Link href="?menu=settings&tab=visibility" className={`block menu-setting-style ${activeSubSettingFn('visibility')}`}>Visibility</Link>
        </div>
    )
}