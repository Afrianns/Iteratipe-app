import AboutDesigner from "@/components/project-detail/overview/AboutDesigner";
import Tags from "@/components/project-detail/overview/Tags";
import Tools from "@/components/project-detail/overview/Tools";
import { TagsType } from "@/types/types";

import { Suspense } from "react";
import Summary from "./overview/Summary";

type toolType = {
    id: number,
    name: string,
    logo?: string
}

export default function Overview() {

    let tags: TagsType = ["UI Design", "Figma", "Brand Design", "Logo"];

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

    return (
        <div className="container-style">
            <div className="limit-breaker w-full grid md:grid-cols-2 lg:grid-cols-3 max-lg:gap-y-5 lg:gap-5 items-start">
                <Suspense fallback={<SummaryLoading />}>
                    <Summary />
                </Suspense>
                <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 space-y-5 min-w-0">
                    <div className="card-style-secondary">
                        <Suspense fallback={<AboutDesignLoading />}>
                            <AboutDesigner />
                        </Suspense>
                    </div>
                    <div className="card-style-secondary relative overflow-hidden">
                        <Suspense fallback={<TagsLoading />}>
                            <Tags tags={tags} />
                        </Suspense>
                    </div>
                    <div className="card-style-secondary relative overflow-hidden">
                        <Suspense fallback={<ToolsLoading />}>
                            <Tools tools={tools} />
                        </Suspense>
                    </div>
                </div>

            </div>
        </div>
    )
}


const SummaryLoading = () => {
    return (
        <div className="card-style-secondary">
            <h3 className="h-three-style">Project Summary</h3>
            
            <div className="space-y-2 pb-4 animate-pulse">
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-4/5 bg-slate-200 rounded" />
            </div>
            
            <hr className="h-style text-purple-dark/20 animate-pulse" />
            
            <div className="flex items-center justify-between pt-4">
                <h4 className="text-md">Project Durations</h4>

                <div className="h-4 w-44 bg-slate-200 rounded animate-pulse" />
            </div>
        </div>
    )
}



const AboutDesignLoading = () => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="h-three-style">About Designer</h3>
                <div className="h-5 w-5 bg-slate-200 rounded animate-pulse" /> 
            </div>

            <div className="animate-pulse flex items-start gap-x-5">
                <div className="w-12.5 h-12.5 bg-slate-200 rounded-full shrink-0" />
                
                <div className="space-y-3 flex-1">
                    <div className="h-5 w-40 bg-slate-200 rounded" />
                    
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-full bg-slate-200 rounded" />
                        <div className="h-4 w-2/3 bg-slate-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    )
}

const TagsLoading = () => {
    return (
        <>
            <h3 className="h-three-style z-2 relative">Tags</h3> 
            
            <div className="animate-pulse scroll-container-style flex gap-x-2 overflow-hidden"> 
                <div className="h-7 w-16 bg-slate-200 rounded-lg shrink-0" />
                <div className="h-7 w-24 bg-slate-200 rounded-lg shrink-0" />
                <div className="h-7 w-14 bg-slate-200 rounded-lg shrink-0" />
            </div>
        </>
    )
}

const ToolsLoading = () => {
    return (
        <>
            <h3 className="h-three-style z-2 relative">Tools</h3>  
            
            <div className="animate-pulse scroll-container-style flex gap-x-2 overflow-hidden"> 
                <div className="h-7 w-20 bg-slate-200 rounded-lg shrink-0" />
                <div className="h-7 w-28 bg-slate-200 rounded-lg shrink-0" />
                <div className="h-7 w-16 bg-slate-200 rounded-lg shrink-0" />
            </div>
        </>
    )
}