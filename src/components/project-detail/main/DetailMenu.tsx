"use client"

import { subMenuEnum } from '@/types/enum';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function DetailMenu() {

    const searchParams = useSearchParams();
    const currentMenu = searchParams.get('menu') || "timeline";

    const activeSubMenu = (current: subMenuEnum) => currentMenu == current ? "border-purplish text-purplish" : "border-transparent";    
    return (
        <div className="list-none text-gray-600 text-sm mt-2 flex items-center">
            <Link href="?menu=timeline" className={`detail-list-style ${activeSubMenu(subMenuEnum.TIMELINE)}`}>Timeline</Link>
            <Link href="?menu=overview" className={`detail-list-style ${activeSubMenu(subMenuEnum.OVERVIEW)}`}>Overview</Link>
            <Link href="?menu=comments" className={`detail-list-style ${activeSubMenu(subMenuEnum.COMMENTS)}`}>Comment</Link>
            <Link href="?menu=settings" className={`detail-list-style ${activeSubMenu(subMenuEnum.SETTINGS)}`}>Settings</Link>
        </div>
    )
}