"use client"

import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import { MoveLeft, SquarePen } from "lucide-react";

export default function TimelineToggleSidebar({children}: {children: React.ReactNode}) {
    const {showSidebar, setShowSidebar } = useTimelineStateStore();
    
    return (
        <div className={`card-style absolute transition-style right-0 top-0 h-full overflow-y-auto flex flex-col ${showSidebar ? 'w-140' : 'w-0'}`}>
            <section className="p-5 pb-0 flex items-center justify-between mb-5">
                <button onClick={setShowSidebar} className="py-1 px-3 bg-light-gray hover:bg-grayish/50 cursor-pointer rounded-lg">
                    <MoveLeft className="w-5 h-5 text-grayish-dark" />
                </button>

                <button className="p-2 bg-light-gray hover:bg-grayish rounded-full cursor-pointer">
                    <SquarePen className="w-3 h-3 text-grayish-dark" />
                </button>
            </section>
            {children}
        </div>
    )
}
