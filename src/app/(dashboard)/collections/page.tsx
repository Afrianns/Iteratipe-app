import Header from "@/components/Header";
import { auth } from "@clerk/nextjs/server";
import UnauthorizedInfo from "../_components/UnauthorizedInfo";
import { getBookmarkedProject } from "@/services/bookmark.service";
import { labelType, ProjectPreviewType } from "@/types/types";
import ProjectCard from "@/components/ProjectCard";


export default async function Collections() {
    const { isAuthenticated } = await auth()

    let projects: ProjectPreviewType[] = []

    const result = await getBookmarkedProject()

    if(result.status == 200 && result.data){
        projects = result.data
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
                    <div className="limit-breaker">
                        <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {projects.map((project, idx) => {
                                return <ProjectCard key={idx} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
                            })}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}