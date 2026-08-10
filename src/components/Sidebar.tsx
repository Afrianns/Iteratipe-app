"use server"

import { UserButton } from "@clerk/nextjs";
import { CircleUser, Plus } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import SidebarMenu from "./SidebarMenu";
import { auth } from "@clerk/nextjs/server";


export default async function Sidebar() {
    
    const { isAuthenticated } = await auth()

    const cookieStore = await cookies()
    
    const isOpen = cookieStore.get('sidebar_collapsed')?.value === 'true'

    return (
        <div className={`max-md:card-style sidebar-card-style max-md:space-y-0! transition-[width] duration-300 ease-in-out ${isOpen ? 'w-60' : 'w-20'}`}>
            
            <div className="max-md:flex max-md:gap-x-5 max-md:justify-center">
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

                {isAuthenticated &&
                    <div className="flex justify-center">
                        <Link href="/new" className="flex-centering hovering-detail duration-300 bg-secondary text-main font-medium hover:bg-secondary hover:underline justify-center whitespace-nowrap w-full">
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
                <SidebarMenu isOpen={isOpen} />
            </div>
            <div className="flex justify-center">
                {isAuthenticated ?   
                    <UserButton userProfileUrl="/profile" appearance={{
                        elements: {
                            userButtonPopoverCard: "card-style border-t-none",
                            userButtonPopoverMain: "border-none mbe-0!",
                            userButtonPopoverFooter: "hidden",
                            userButtonPopoverActionButton__signOut: "text-red-500 hover:bg-light-red/10",
                            rootBox: "w-full flex-centering justify-center max-w-full",
                            userButtonTrigger: "block w-full",
                            userButtonOuterIdentifier: `menu-name-style hidden md:block overflow-hidden ${isOpen ? 'max-w-37.5 opacity-100' : 'max-w-0 opacity-0 p-0 m-0'}`,
                            userButtonBox: "flex-row-reverse flex-centering hovering-detail duration-300 bg-secondary text-main font-medium hover:bg-secondary hover:underline justify-center whitespace-nowrap gap-x-0",
                            avatarBox: `${isOpen ? 'h-7 w-7' :'w-5 h-5'}`
                        }
                    }} showName={true} />
                :
                    <Link href="/auth" className="flex-centering hovering-detail duration-100 bg-grayish/50 text-main-text font-medium hover:bg-light-grayish/80 hover:underline whitespace-nowrap w-4/5 justify-center">
                        <CircleUser className="menu-icon-style" /> 
                        <span className={`max-md:hidden menu-name-style ${isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>Get Started</span>
                    </Link>
                }
            </div>
        </div>
    )
}