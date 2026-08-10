import ProjectCard from "@/components/ProjectCard";
import { getCurrentUserProjects } from "@/services/projects.service";
import { labelType, ProjectType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

interface ProjectPreviewType {
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

export default async function AuthenticatedProjectLists() {
    let projects: ProjectPreviewType[] = []

    const {userId} = await auth()

    if(userId){
        const result = await getCurrentUserProjects(userId)
        if(result.status == 200 && result.data)
            projects = result.data
    }
    return (
        <>
            {projects.map((project, idx) => {
                return <ProjectCard key={idx} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
            })}
        </>
    )
}