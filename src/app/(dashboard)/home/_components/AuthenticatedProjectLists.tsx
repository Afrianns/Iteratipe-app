import ProjectCard from "@/components/ProjectCard";
import { getCurrentUserProjects } from "@/services/projects.service";
import { ProjectPreviewType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export default async function AuthenticatedProjectLists() {
    let projects: ProjectPreviewType[] = []

    const {userId} = await auth()

    if(userId){
        const result = await getCurrentUserProjects(userId)
        if(result.status == 200 && result.data) projects = result.data
    }
    return (
        <>
            {projects.map((project, idx) => {
                return <ProjectCard key={idx} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
            })}
        </>
    )
}