"use client"

import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { CircleUser, Compass, FileStack, House, Plus, SquareChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export default function Sidebar() {
    
    const { isSignedIn } = useAuth()

    const { user } = useUser()
    
    const [isOpen, setIsOpen] = useState(() => {
        if(typeof window !== "undefined"){
            const saved = localStorage.getItem("sidebar_open");
            return saved ? JSON.parse(saved) : false;
        }
    });

    const pathname = usePathname();
    
    const openSidebarFn = () => {
        localStorage.setItem("sidebar_open",JSON.stringify(!isOpen))
        setIsOpen(!isOpen)
    }

    const path = pathname.split('/').filter((path) => path != "")[0]


    return (
        <div className={`max-md:card-style sidebar-card-style max-md:space-y-0! transition-[width] duration-300 ease-in-out ${isOpen ? 'w-60' : 'w-20'}`}>
            <div className="max-md:hidden absolute -right-5 top-20 py-2 px-2 card-style cursor-pointer" onClick={openSidebarFn}>
                <SquareChevronRight className="w-4 h-4" />
            </div>
            <div className="max-md:flex max-md:gap-x-5">
                <Link href="/" className="hidden relative md:flex justify-center items-center h-10 mb-5">
                    <div 
                        className={`absolute transition-all duration-300 ease-in-out ${
                        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        }`}
                    >
                        <Image alt="Iteratipe Logo" src="/Logo.svg" width={130} height={130} priority />
                    </div>

                    <div 
                        className={`absolute transition-all duration-300 ease-in-out ${
                        !isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        }`}
                    >
                        <Image alt="Iteratipe Logo" src="/sort-logo.svg" width={40} height={40} priority />
                    </div>
                </Link>

                {isSignedIn &&
                    <div className="flex justify-center">
                        <Link href="/new" className="flex-centering hovering-detail duration-300 bg-light-purple text-purplish font-medium hover:bg-light-purple hover:underline justify-center whitespace-nowrap w-full">
                            <Plus className="menu-icon-style" /> 
                            <span className={`max-md:hidden menu-name-style ${
                                isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'
                                }`}
                            >
                                New Design
                            </span>
                        </Link>
                    </div>
                }
                
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
            </div>
            <div className="flex justify-center">
                {isSignedIn ?   
                    <UserButton userProfileUrl="/profile" appearance={{
                        elements: {
                            userButtonPopoverCard: "card-style border-t-none",
                            userButtonPopoverMain: "border-none mbe-0!",
                            userButtonPopoverFooter: "hidden",
                            userButtonPopoverActionButton__signOut: "text-red-500 hover:bg-light-red/10",
                            rootBox: "w-full flex-centering justify-center",
                            userButtonTrigger: "block w-full",
                            userButtonOuterIdentifier: `menu-name-style hidden md:block overflow-hidden ${isOpen ? 'max-w-37.5 opacity-100' : 'max-w-0 opacity-0 p-0 m-0'}`,
                            userButtonBox: "flex-row-reverse flex-centering hovering-detail duration-300 bg-light-purple text-purplish font-medium hover:bg-light-purple hover:underline justify-center whitespace-nowrap gap-x-0",
                        }
                    }} showName={true} />
                :
                    <Link href="/auth" className="flex-centering hovering-detail duration-100 bg-grayish/50 text-purple-dark font-medium hover:bg-light-grayish/80 hover:underline whitespace-nowrap w-4/5 justify-center">
                        <CircleUser className="menu-icon-style" /> 
                        <span className={`max-md:hidden menu-name-style ${isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>Get Started</span>
                    </Link>
                }
            </div>
        </div>
    )
}