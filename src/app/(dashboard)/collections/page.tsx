"use server"

import Header from "@/components/Header";
import { auth } from "@clerk/nextjs/server";
import UnauthorizedInfo from "../_components/UnauthorizedInfo";
import { getBookmarkedProject } from "@/services/bookmark.service";
import { labelType, ProjectPreviewType, SortingType, StatusType } from "@/types/types";
import ProjectCard from "@/components/ProjectCard";
import Menu from "@/components/Menu";
import { filtering, getTypeAndSort } from "@/lib/sorting";
import { Link } from "lucide-react";
import DropdownFilter from "../explore/_components/DropdownFilter";


export default async function Collections({searchParams}: {searchParams: Promise<{ sortby: SortingType, type: string, status: StatusType }>}) {
    const { isAuthenticated } = await auth()
    
    let sortBy: SortingType = "ASC"
    let types: labelType[] = []


    const params = await searchParams;

    const type = params.type || "All";
    const status = params.status || "all";

    if(params.sortby == "ASC") sortBy = "DSC"

    let projects: ProjectPreviewType[] = []

    const result = await getBookmarkedProject()

    if(result.status == 200 && result.data){
        projects = result.data
        types = getTypeAndSort(result.data)
    }

    return (
        <div className="col-span-5 w-full">
            <div className="container-style container-accent-style">
                <div className="limit-breaker">
                    <Header />
                </div>
            </div>
            <div className="container-style">
                {!isAuthenticated ? 
                    <UnauthorizedInfo />
                :
                    <div className="limit-breaker space-y-5">
                        {/* ${param.section === "about" ? "bg-secondary text-main": "hover:bg-secondary"} */}
                        <div className="flex items-center gap-x-3 h-15 w-full">
                            <div className="w-full">
                                <Menu sortType={sortBy} types={types} />
                            </div>
                            <div className="w-fit">
                                <DropdownFilter />
                            </div>
                        </div>
                        <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtering(projects, type, sortBy, status).map((project, idx) => {
                                return <ProjectCard key={idx} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
                            })}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}