"use client"

import { openSidebarFn } from "@/actions/setCookies";
import { Compass, FileStack, House, SquareChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarMenu({isOpen}: {isOpen: boolean }) {

    const path = usePathname().split('/').filter((path) => path != "")[0]

    return (
        <>
            <div className="max-md:hidden absolute -right-5 top-20 py-2 px-2 card-style cursor-pointer" onClick={openSidebarFn}>
                <SquareChevronRight className="w-4 h-4" />
            </div>
            <ul className="max-md:space-x-5 md:space-y-3 gap-y-3 md:mt-10 w-full mx-auto max-md:flex">
                <li>
                    <Link className={`flex-centering hovering-detail duration-300 hover:bg-light-purple group transition-colors ${path === 'home' ? 'bg-light-purple' : ''} whitespace-nowrap `} href="/home">
                        <House className={`menu-icon-style ${path === 'home' ? 'text-purplish' : ''}`} />
                        
                        <span className={`max-md:hidden menu-name-style ${
                            path === 'home' ? 'text-purplish' : 'group-hover:text-purplish'
                        } ${
                            isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'
                        }`}
                        >
                        Home
                        </span>
                    </Link>
                </li>
                <li><Link className={`flex-centering hovering-detail duration-300 hover:bg-light-purple group ${path === 'explore' ? 'bg-light-purple' : ''}`} href="/explore">
                    <Compass className={`menu-icon-style ${path == 'explore' ? 'text-purplish' : ''}`} />
                    <span className={`max-md:hidden menu-name-style ${
                        path === 'explore' ? 'text-purplish' : 'group-hover:text-purplish'
                    } ${isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                        Explore
                    </span>
                </Link></li>
                <li><Link className={`flex-centering hovering-detail duration-300 hover:bg-light-purple group ${path === 'collections' ? 'bg-light-purple' : ''}`} href="/collections">
                    <FileStack className={`menu-icon-style ${path == 'collections' ? 'text-purplish' : ''}`} />
                    <span className={`max-md:hidden menu-name-style ${
                        path === 'collections' ? 'text-purplish' : 'group-hover:text-purplish'
                    } ${isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                        Collections
                    </span>
                </Link></li>
            </ul>
        </>
    )
}