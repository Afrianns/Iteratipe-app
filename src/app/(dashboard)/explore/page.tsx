import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import Sidebar from "@/components/Sidebar";
import { getAllProjects } from "@/services/projects.service";
import { ProjectPreviewType } from "@/types/types";

export default async function ExplorePage() {
    
    let projects: ProjectPreviewType[] = []

    const result = await getAllProjects()
    
    if(result.status == 200 && result.data){
        projects = result.data
    }
    return (
        <div className="col-span-5 w-full">
            <div className="container-style container-accent-style">
                <div className="limit-breaker">
                    <Header showSearch={false} />
                    <div className="mt-10">
                        <h1 className="text-4xl font-bold mb-2">Explore Designs</h1>
                        <p className="text-gray-600">Here you can find various design and process from people around the world.</p>

                        <div className="flex gap-5 mt-10 bg-grayish/50 w-full rounded-lg relative">
                            <input type="text" name="search" className="w-full p-5 rounded-lg border outline-main border-grayish focus:ring-0 text-sm" placeholder="Search designs..." />
                            <button className="bg-main text-whitish right-2 top-2 bottom-2 py-2 px-6 rounded-sm absolute">Search</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-style max-md:mb-20">
                <div className="limit-breaker">
                    <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {projects.map((project, idx) => {
                            return <ProjectCard key={idx} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
} 
