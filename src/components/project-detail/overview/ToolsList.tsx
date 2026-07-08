"use client"

import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { handleScroll } from "@/lib/handleScroll";
import { ToolsType } from "@/types/types";

interface ToolsInterface { tools: ToolsType[] }

export default function ToolsList({tools}: ToolsInterface) {
    const [scrollToolsRef, showGradientToolsLeft, showGradientToolsRight] = useGradientScrollEdge(handleScroll);
    return (
        <>
            <span className={`scroll-edge-style right-gradient-edge-style ${
                showGradientToolsRight ? 'opacity-100' : 'opacity-0'
            }`}></span>
            
            <span className={`scroll-edge-style left-gradient-edge-style ${
                showGradientToolsLeft ? 'opacity-100' : 'opacity-0'
            }`}></span>

            <div className="scroll-container-style" ref={scrollToolsRef}>
                    {tools.map((tools: ToolsType) =>
                        <span key={tools.id} className="tag-style">{tools.name}</span>
                    )}
            </div>
        </>
    )
}