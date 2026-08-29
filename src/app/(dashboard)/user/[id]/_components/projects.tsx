"use client"

import ProjectCard from "@/components/ProjectCard"
import { filtering } from "@/lib/sorting";
import { ProjectPreviewType, SortingType, StatusType } from "@/types/types"
import { useSearchParams } from "next/navigation"


export default function ListProjects({ sortBy, projects }: {sortBy: SortingType, projects: ProjectPreviewType[]}) {

  const params = useSearchParams();

  const type = params.get("type") || "All"
  const status = params.get("status") || "all"

  return (
    <>
      {filtering(projects, type, sortBy, status as StatusType).map((project, idx) => {
          return <ProjectCard key={idx} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
      })}
    </>
  )
}
