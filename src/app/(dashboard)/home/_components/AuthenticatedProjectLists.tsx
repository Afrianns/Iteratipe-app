"use server"

import Menu from "@/components/Menu";
import ProjectCard from "@/components/ProjectCard";
import { filtering, getTypeAndSort } from "@/lib/sorting";
import { getCurrentUserProjects } from "@/services/projects.service";
import { labelType, ProjectPreviewType, SortingType, StatusType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import DropdownFilter from "../../explore/_components/DropdownFilter";

export default async function AuthenticatedProjectLists({searchParam}: {searchParam: Promise<{ sortby: SortingType, type: string, status: StatusType}>}) {
    let projects: ProjectPreviewType[] = []

    let types: labelType[] = []

    let sortBy: SortingType = "ASC"

    const {userId} = await auth()

    const params = await searchParam

    const type = params.type || "All"
    const status = params.status || "all"

    if(params.sortby == "ASC") {
        sortBy = "DSC"
    }

    if(userId){
        const result = await getCurrentUserProjects(userId)
        if(result.status == 200 && result.data) {
            projects = result.data
            types = getTypeAndSort(result.data)
        }
    }

    console.log(params.sortby)
    return (
        <>
            <div className="col-span-full flex items-center gap-x-5">
                <div className="w-full">
                    <Menu types={types} sortType={sortBy} />
                </div>
                <DropdownFilter />
            </div>
            {filtering(projects, type, sortBy, status as StatusType).map((project, idx) => {
                return <ProjectCard key={idx} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
            })}
        </>
    )
}