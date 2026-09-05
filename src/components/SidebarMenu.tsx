"use client"

import { openSidebarFn } from "@/actions/setCookies";
import { useAuth } from "@clerk/nextjs";
import { Compass, FileStack, House, Plus, SquareChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarMenu({isOpen}: {isOpen: boolean }) {

    const path = usePathname().split('/').filter((path) => path != "")[0]

    const { isLoaded, isSignedIn } = useAuth()

    return (
        <> 
            {(isLoaded && isSignedIn) &&
                <div className="flex justify-center">
                    <Link prefetch={false} href="/new" className={`flex-centering hovering-detail duration-300 hover:bg-secondary group transition-colors ${path === 'new' ? 'bg-secondary' : ''} whitespace-nowrap`}>
                        <Plus className={`menu-icon-style ${path === 'new' ? 'text-main' : ''}`} /> 
                        <span className={`max-md:hidden menu-name-style
                            ${
                                path === 'new' ? 'text-main' : 'group-hover:text-main'
                            }
                            ${
                            isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'
                            }`}
                        >
                            New Design
                        </span>
                    </Link>
                </div>
            }
            <div className="max-md:hidden absolute -right-5 top-20 py-2 px-2 card-style cursor-pointer" onClick={openSidebarFn}>
                <SquareChevronRight className="w-4 h-4" />
            </div>
            <ul className="max-md:space-x-5 md:space-y-3 gap-y-3 md:mt-10 w-full mx-auto max-md:flex">
                <li>
                    <Link prefetch={false} className={`flex-centering hovering-detail duration-300 hover:bg-secondary group transition-colors ${path === 'home' ? 'bg-secondary' : ''} whitespace-nowrap `} href="/home">
                        <House className={`menu-icon-style ${path === 'home' ? 'text-main' : ''}`} />
                        
                        <span className={`max-md:hidden menu-name-style ${
                            path === 'home' ? 'text-main' : 'group-hover:text-main'
                        } ${
                            isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'
                        }`}
                        >
                        Home
                        </span>
                    </Link>
                </li>
                <li><Link prefetch={false} className={`flex-centering hovering-detail duration-300 hover:bg-secondary group ${path === 'explore' ? 'bg-secondary' : ''}`} href="/explore">
                    <Compass className={`menu-icon-style ${path == 'explore' ? 'text-main' : ''}`} />
                    <span className={`max-md:hidden menu-name-style ${
                        path === 'explore' ? 'text-main' : 'group-hover:text-main'
                    } ${isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                        Explore
                    </span>
                </Link></li>
                <li><Link prefetch={false} className={`flex-centering hovering-detail duration-300 hover:bg-secondary group ${path === 'collections' ? 'bg-secondary' : ''}`} href="/collections">
                    <FileStack className={`menu-icon-style ${path == 'collections' ? 'text-main' : ''}`} />
                    <span className={`max-md:hidden menu-name-style ${
                        path === 'collections' ? 'text-main' : 'group-hover:text-main'
                    } ${isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                        Collections
                    </span>
                </Link></li>
            </ul>
        </>
    )
}