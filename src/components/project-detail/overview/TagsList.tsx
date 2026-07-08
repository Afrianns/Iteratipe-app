"use client"

import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { handleScroll } from "@/lib/handleScroll";
import { TagsType } from "@/types/types";

interface TagsInterface { tags: TagsType }

export default function TagsList({tags}: TagsInterface) {
    const [scrollTagsRef, showGradientTagsLeft, showGradientTagsRight] = useGradientScrollEdge(handleScroll);
    return (
        <>
            <span className={`scroll-edge-style right-gradient-edge-style ${
                showGradientTagsRight ? 'opacity-100' : 'opacity-0'
            }`}></span>
            
            <span className={`scroll-edge-style left-gradient-edge-style ${
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