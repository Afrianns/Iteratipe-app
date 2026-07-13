"use client"

import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { handleScroll } from "@/lib/handleScroll";
import { TagsType } from "@/types/types";

interface TagsInterface { tags: TagsType, colorFrom: string }

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
                    {tags.map((tag: string, index: number) =>
                        <span key={index} className="tag-style">{tag}</span>
                    )}
            </div>
        </>
    )
}