"use client"

import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { handleScroll } from "@/lib/handleScroll";
import { labelType } from "@/types/types";

interface LabelsInterface { labels: labelType[], colorFrom: string }

export default function LabelsList({labels, colorFrom}: LabelsInterface) {
    const [scrollLabelsRef, showGradientLabelsLeft, showGradientLabelsRight] = useGradientScrollEdge(handleScroll);
    return (
        <>
            <span className={`scroll-edge-style right-0 bg-linear-to-l ${colorFrom} from-45% to-transparent to-90% ${
                showGradientLabelsRight ? 'opacity-100' : 'opacity-0'
            }`}></span>
            
            <span className={`scroll-edge-style left-0 bg-linear-to-r ${colorFrom} from-45% to-transparent to-90% ${
                showGradientLabelsLeft ? 'opacity-100' : 'opacity-0'
            }`}></span>

            <div className="scroll-container-style" ref={scrollLabelsRef}>
                    {labels.map((label: labelType, index: number) =>
                        <span key={index} className="badge-style-secondary">{label.name}</span>
                    )}
            </div>
        </>
    )
}