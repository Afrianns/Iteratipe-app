"use client"

import ProjectCard from "@/components/ProjectCard"
import { labelType, ProjectPreviewType } from "@/types/types"
import { useSearchParams } from "next/navigation"


export default function ListProjects({ projects }: {projects: ProjectPreviewType[]}) {

  const params = useSearchParams();
  const type = params.get("type") || "All";

  return (
    <>
        {filterTypes(projects, type).map((project, idx) => {
            return <ProjectCard key={idx} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
        })}
    </>
  )
}

const filterTypes = (projects: ProjectPreviewType[], params: string) => {
    if(params != "All") return projects.filter((projects) => projects.Type.name == params)
    return projects
}
