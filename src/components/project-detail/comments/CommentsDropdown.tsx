"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react";

export default function CommentsDropdown({ children }: {children: React.ReactNode}) {
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonMenuRef = useRef<HTMLDivElement>(null);
    const [stepDropdown, setStepDropdown] = useState<boolean>(false);

    const showStepDropdownFn = () => setStepDropdown(!stepDropdown)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const clickedElement = event.target as Node;
            const buttonMenu = buttonMenuRef.current?.contains(clickedElement);
            const clickedMenu = menuRef.current?.contains(clickedElement);

            if (!buttonMenu && !clickedMenu) setStepDropdown(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <>
            <div className="flex items-center justify-between hover:bg-light-gray px-3 rounded-md cursor-pointer" onClick={showStepDropdownFn} ref={buttonMenuRef}>
                <h3 className="h-three-style">All</h3>
                <ChevronDown className={`transition-style icon-style ${stepDropdown && 'rotate-180'}`} />
            </div>

            {stepDropdown && 
                <div className="card-style p-5 absolute right-0 left-0 z-1" ref={menuRef}>
                    {children}
                </div>
            }
        </>
    )
}