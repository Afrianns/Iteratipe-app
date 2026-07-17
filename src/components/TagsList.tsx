"use client"

import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { handleScroll } from "@/lib/handleScroll";
import { labelType } from "@/types/types";

interface TagsInterface { tags: labelType[], colorFrom: string }

export default function TagsList({tags, colorFrom}: TagsInterface) {
    const [scrollTagsRef, showGradientTagsLeft, showGradientTagsRight] = useGradientScrollEdge(handleScroll);
    return (
        <>
            <span className={`scroll-edge-style right-0 bg-linear-to-l ${colorFrom} from-45% to-transparent to-90% ${
                showGradientTagsRight ? 'opacity-100' : 'opacity-0'
            }`}></span>
            
            <span className={`scroll-edge-style left-0 bg-linear-to-r ${colorFrom} from-45% to-transparent to-90% ${
                showGradientTagsLeft ? 'opacity-100' : 'opacity-0'
            }`}></span>

            <div className="scroll-container-style" ref={scrollTagsRef}>
                    {tags.map((tag: labelType, index: number) =>
                        <span key={index} className="badge-style-secondary">{tag.name}</span>
                    )}
            </div>
        </>
    )
}