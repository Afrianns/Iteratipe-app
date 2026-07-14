"use client"

import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { handleScroll } from "@/lib/handleScroll";
import { ToolsType } from "@/types/types";

interface ToolsInterface { tools: ToolsType[], colorFrom: string }

export default function ToolsList({tools, colorFrom}: ToolsInterface) {
    const [scrollToolsRef, showGradientToolsLeft, showGradientToolsRight] = useGradientScrollEdge(handleScroll);
    return (
        <>
            <span className={`scroll-edge-style right-0 bg-linear-to-l ${colorFrom} from-45% to-transparent to-90% ${
                showGradientToolsRight ? 'opacity-100' : 'opacity-0'
            }`}></span>
            
            <span className={`scroll-edge-style left-0 bg-linear-to-r ${colorFrom} from-45% to-transparent to-90% ${
                showGradientToolsLeft ? 'opacity-100' : 'opacity-0'
            }`}></span>

            <div className="scroll-container-style" ref={scrollToolsRef}>
                    {tools.map((tools: ToolsType) =>
                        <span key={tools.id} className="badge-style-secondary">{tools.name}</span>
                    )}
            </div>
        </>
    )
}