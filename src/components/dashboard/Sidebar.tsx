"use client"

import { CircleUser, Compass, FileStack, House, Plus, SquareChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function Sidebar({ current }: { current: string }) {

    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`sidebar-card-style transition-all duration-300 ease-in-out ${isOpen ? 'w-60' : 'w-20'}`}>
            <div className="absolute -right-5 top-20 py-2 px-2 card-style cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <SquareChevronRight className="w-4 h-4" />
            </div>
            <div>
                <div className="relative flex justify-center items-center h-10 mb-5">
                    {/* Large Logo */}
                    <div 
                        className={`absolute transition-all duration-300 ease-in-out ${
                        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        }`}
                    >
                        <Image alt="Iteratipe Logo" src="/Logo.svg" width={130} height={130} priority />
                    </div>

                    {/* Small/Short Logo */}
                    <div 
                        className={`absolute transition-all duration-300 ease-in-out ${
                        !isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        }`}
                    >
                        <Image alt="Iteratipe Logo" src="/sort-logo.svg" width={40} height={40} priority />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button className="flex-centering hovering-detail duration-300 bg-light-purple text-purplish font-medium hover:bg-light-purple hover:underline w-4/5 justify-center whitespace-nowrap">
                        <Plus className="menu-icon-style" /> 
                        <span 
                            className={`menu-name-style ${
                            isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'
                            }`}
                        >
                            New Design
                        </span>
                    </button>
                </div>
                
                <ul className="space-y-3 gap-y-3 mt-10 w-full mx-auto">
                    <li className={`hovering-detail duration-300 hover:bg-light-purple group transition-colors ${current === 'home' ? 'bg-light-purple' : ''} whitespace-nowrap `}>
                        <Link className="flex-centering overflow-hidden" href="/">
                            <House className={`menu-icon-style ${current === 'home' ? 'text-purplish' : ''}`} />
                            
                            <span 
                            className={`menu-name-style ${
                                current === 'home' ? 'text-purplish' : 'group-hover:text-purplish'
                            } ${
                                isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'
                            }`}
                            >
                            Home
                            </span>
                        </Link>
                    </li>
                    <li className={`hovering-detail duration-300 hover:bg-light-purple group ${current === 'explore' ? 'bg-light-purple' : ''}`}><Link className="flex-centering" href="/explore">
                        <Compass className={`menu-icon-style ${current == 'explore' ? 'text-purplish' : ''}`} />
                        <span className={`menu-name-style ${
                            current === 'explore' ? 'text-purplish' : 'group-hover:text-purplish'
                        } ${isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                            Explore
                        </span>
                    </Link></li>
                    <li className={`hovering-detail duration-300 hover:bg-light-purple group ${current === 'collections' ? 'bg-light-purple' : ''}`}><Link className="flex-centering" href="/collections">
                        <FileStack className={`menu-icon-style ${current == 'collections' ? 'text-purplish' : ''}`} />
                        <span className={`menu-name-style ${
                            current === 'collections' ? 'text-purplish' : 'group-hover:text-purplish'
                        } ${isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                            Collections
                        </span>
                    </Link></li>
                </ul>
            </div>
            <div className="flex justify-center">
                <button className="flex-centering hovering-detail duration-100 bg-grayish/50 text-purple-dark font-medium hover:bg-light-grayish/80 hover:underline whitespace-nowrap w-4/5 justify-center">
                    <CircleUser className="menu-icon-style" /> 
                    <span className={`menu-name-style ${isOpen ? 'max-w-37.5 opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>New Design</span>
                </button>
            </div>
        </div>
    )
}