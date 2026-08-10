"use client"

import ProjectCard from "@/components/ProjectCard"
import { labelType } from "@/types/types"
import { useSearchParams } from "next/navigation"

interface ProjectsType {
    uid: string
    title: string
    Status: labelType
    Type: labelType
    created_at: Date
    _count: { 
        Nodes: number
    }
    Users: {
        full_name: string
        username: string
    }
}

export default function ListProjects({ projects }: {projects: ProjectsType[]}) {

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

const filterTypes = (projects: ProjectsType[], params: string) => {
    if(params != "All") return projects.filter((projects) => projects.Type.name == params)
    return projects
}
