import ProjectCard from "@/components/ProjectCard";
import { getCurrentUserProjects } from "@/services/projects.service";
import { ProjectType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export default async function AuthenticatedProjectLists() {
    let projects: ProjectType[] = []

    const {userId} = await auth()

    if(userId){
        const result = await getCurrentUserProjects(userId)
        if(result.status == 200 && result.data)
            projects = result.data.Projects
    }
    return (
        <>
            {projects.map((project) => {
                return <ProjectCard key={project.id} projectData={project} currentPath="home" imageName={"project-placeholder-5.png"} />
            })}
        </>
    )
}