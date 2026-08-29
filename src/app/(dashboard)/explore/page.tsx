"use server"

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/services/projects.service";
import { getAllTypes } from "@/services/types.service";
import { labelType, ProjectPreviewType, SortingType } from "@/types/types";
import Menu from "../../../components/Menu";
import DropdownFilter from "./_components/DropdownFilter";
import Search from "./_components/Search";

type StatusType = "pending"|"in_progress"|"completed"|"all"

export default async function ExplorePage({searchParams}: {searchParams: Promise<{sortby: string, type: string, status: StatusType, search: string}>}) {
    
    let projects: ProjectPreviewType[] = []
    let types: labelType[] = []

    let sortBy: SortingType = "ASC"
    let status: StatusType = "all"

    const param = await searchParams

    if(param.sortby == "ASC") {
        sortBy = "DSC"
    }

    if(param.status) {
        status = param.status
    }

    const result = await getAllProjects(sortBy, param.type, status, param.search)
    const allTypes = await getAllTypes()
    
    if(result.status == 200 && result.data){
        projects = result.data
    }

    if(allTypes.status == 200 && allTypes.data){
        types = allTypes.data
    }
    return (
        <div className="col-span-5 w-full">
            <div className="container-style container-accent-style">
                <div className="limit-breaker">
                    <Header showSearch={false} />
                    <div className="mt-10 space-y-5">
                        <h1 className="text-4xl font-bold mb-2">Explore Designs</h1>
                        <p className="text-gray-600">Here you can find various design and process from people around the world.</p>
                        <Search />
                        <Menu types={types} sortType={sortBy} />
                    </div>
                </div>
            </div>
            <div className="container-style max-md:mb-20">
                <div className="limit-breaker">
                    <DropdownFilter />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                        {projects.map((project, idx) => {
                            return <ProjectCard key={idx} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
} 
