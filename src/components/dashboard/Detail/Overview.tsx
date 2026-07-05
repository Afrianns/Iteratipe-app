import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type toolType = {
    id: number,
    name: string,
    logo?: string
}

type scrollReturnType = boolean

export default function Overview() {

    let tags = ["UI Design", "Figma", "Brand Design", "Logo"];

    let tools: toolType[] = [
        {
            "id": 1,
            "name": "figma",
            "logo": ".."
        },
        {
            "id": 2,
            "name": "sketch",
            "logo": ".."
        },
        {
            "id": 3,
            "name": "illustrator",
            "logo": ".."
        },
        {
            "id": 4,
            "name": "illustrator",
            "logo": ".."
        },
        {
            "id": 5,
            "name": "illustrator",
            "logo": ".."
        }
    ]

    const handleScroll = (el: HTMLDivElement): boolean[] => {
        const isAtEnd = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth;
        return [Math.ceil(el.scrollLeft) > 0, isAtEnd]
    }

    
    const [scrollTagsRef, showGradientTagsLeft, showGradientTagsRight] = useGradientScrollEdge(handleScroll);

    const [scrollToolsRef, showGradientToolsLeft, showGradientToolsRight] = useGradientScrollEdge(handleScroll);



    return (
        <div className="px-10 py-5">
            <div className="max-w-360 mx-auto w-full grid grid-cols-3 gap-5 items-start">
                <div className="card-style-secondary col-span-2">
                    <h3 className="h-three-style">Project Summary</h3> 
                    <p className="p-style pb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam temporibus voluptas, inventore, dolores repudiandae quibusdam sit aliquid maxime corrupti eveniet, vitae a ullam officia ducimus nulla autem. Quia, doloremque minus!</p>
                    <hr className="h-style text-purple-dark/20" />
                    <div className="flex items-center gap-x-3 justify-between pt-3">
                        <h4 className="text-md">Project Durations</h4>
                        <p className="text-sm text-purple-dark/70 flex items-center gap-x-3">
                            <span>1 January 2025</span> - 
                            <span>23 April 2025</span>
                        </p>
                    </div>
                </div>
                <div className="col-span-1 space-y-5">
                    <div className="card-style-secondary">
                        <div className="flex justify-between items-center">
                            <h3 className="h-three-style">About Designer</h3>
                            <SquareArrowOutUpRight className="icon-style-secondary" /> 
                        </div>
                        <div className="flex items-start gap-x-5">
                            <Image alt="profile placeholder" src="/images/profile-placeholder.jpg" width={50} height={50} className="rounded-full"/>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium underline hover:no-underline cursor-pointer">Andreas Bunchaco</h3>
                                <div className="flex gap-x-2 text-sm">
                                    <p><span className="font-medium">5</span> Following</p>
                                    <p><span className="font-medium">43</span> Followers</p>
                                </div>
                                <p className="p-style">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel non aperiam inventore aut vero! Ratione, similique totam?</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-style-secondary relative overflow-hidden">
                        <h3 className="h-three-style z-2 relative">Tags</h3> 
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
                    </div>
                    <div className="card-style-secondary relative overflow-hidden">
                        <h3 className="h-three-style z-2 relative">Tool Use</h3>
                        <span className={`scroll-edge-style right-gradient-edge-style ${
                            showGradientToolsRight ? 'opacity-100' : 'opacity-0'
                        }`}></span>
                        
                        <span className={`scroll-edge-style left-gradient-edge-style ${
                            showGradientToolsLeft ? 'opacity-100' : 'opacity-0'
                        }`}></span>

                        <div className="scroll-container-style" ref={scrollToolsRef}>
                                {tools.map((tools: toolType) =>
                                    <span key={tools.id} className="tag-style">{tools.name}</span>
                                )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}