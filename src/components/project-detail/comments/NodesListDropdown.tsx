"use client"

import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react";

export default function NodesListDropdown({ direction = "bottom", setSelectedId }: {direction?: string, setSelectedId: (params: string) => void}) {
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonMenuRef = useRef<HTMLDivElement>(null);
    const nodes = useTimelineStateStore((state) => state.globalNodes)

    const [selectedValue, setSelectedValue] = useState<string>("General")
    
    const selectThisNode = (id: string, name: string) => {
        setSelectedValue(name)
        setStepDropdown(false)
        setSelectedId(id)
    }

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
            <div className="flex items-center justify-between bg-light-gray/50 hover:bg-light-gray px-3 rounded-md cursor-pointer" onClick={showStepDropdownFn} ref={buttonMenuRef}>
                <p className="p-style font-medium!">{selectedValue}</p>
                <ChevronDown className={`transition-style icon-style ${stepDropdown && 'rotate-180'}`} />
            </div>
            <div className={`absolute w-full ${direction == 'bottom' ? 'top-18': 'bottom-10'}`}>
                {stepDropdown && 
                    <div className="card-style overflow-hidden right-0 left-0 z-1" ref={menuRef}>
                        <ul>
                            <li className="hover:bg-purple-50 p-style cursor-pointer py-2 px-4" onMouseDown={() => selectThisNode("NOT_AN_ID", "General")}>General</li>
                            {nodes.map((node) => {
                                if(node.data.title != ""){
                                    return <li key={node.id} className="hover:bg-purple-50 p-style cursor-pointer py-2 px-4" onMouseDown={() => selectThisNode(node.id, node.data.title)}>{node.data.title}</li>
                                }
                            })}
                        </ul>
                    </div>
                }

            </div>
        </>
    )
}