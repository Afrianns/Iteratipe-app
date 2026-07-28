import { ProjectType } from "@/types/types";
import { Bookmark, Eye, Heart, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({currentPath, projectData, imageName}: {currentPath: string, projectData: ProjectType, imageName: string}) {
    return (
        <div className="card-style-secondary p-0! w-full transition-style hover:shadow-lg! hover:-translate-y-1 relative h-full max-h-80 overflow-hidden">
            <div className="h-30 relative">
                <Image src={`/images/projectholders/${imageName}`} fill alt="thumbnail" className="absolute object-cover" />
                <span className="badge-style-secondary absolute bottom-2 left-2 text-grayish-dark text-xs flex gap-x-1 items-center">
                    <Layers className="w-3" />
                    15 Steps
                </span>
            </div>
            <div className="p-4 pt-0 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="badge-style bg-green-100">{projectData.Type?.name}</p>
                    <p className="badge-style bg-amber-100">{projectData.Status?.name}</p>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={`./${currentPath}/${(projectData.title).toLowerCase().split(" ").join("-")}—${projectData.uid}`} className="h-three-style capitalize hover:underline cursor-pointer">{projectData.title}</Link>
                        <p className="span-style flex items-center gap-x-1 text-xs">
                            By
                            <span className="p-style hover:underline hover:cursor-pointer text-xs!">{projectData.Users?.full_name}</span>
                        </p>    
                    </div>
                    <p className="flex text-xs items-center gap-x-1 hover:bg-light-gray px-3 rounded-full cursor-pointer">
                        <Heart className="w-3" />
                        120
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="flex text-xs items-center gap-x-1">
                        <Eye className="w-3" />
                        1,120
                    </p>
                    <p className="flex text-xs items-center gap-x-1 hover:bg-light-gray px-3 rounded-full cursor-pointer">
                        <Bookmark className="w-3" />
                        120
                    </p>
                </div>
            </div>
        </div>
    )
}