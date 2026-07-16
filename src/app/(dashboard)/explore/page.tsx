import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import SidebarWrapper from "@/components/SidebarWrapper";

export default async function ExplorePage() {

    return (
        <div className="container-wrapper-style">
            <SidebarWrapper />
            <div className="col-span-5 w-full">
                <div className="container-style container-accent-style">
                    <div className="limit-breaker">
                        <Header showSearch={false} />
                        <div className="mt-10">
                            <h1 className="text-4xl font-bold mb-2">Explore Designs</h1>
                            <p className="text-gray-600">Here you can find various design and process from people around the world.</p>

                            <div className="flex gap-5 mt-10 bg-grayish/50 w-full rounded-lg relative">
                                <input type="text" name="search" className="w-full p-5 rounded-lg border outline-purplish border-grayish focus:ring-0 text-sm" placeholder="Search designs..." />
                                <button className="bg-purplish text-whitish right-2 top-2 bottom-2 py-2 px-6 rounded-sm absolute">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-style max-md:mb-20">
                    <div className="limit-breaker">
                        <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:grid-cols-2">
                            <ProjectCard currentPath="explore" imageName="project-placeholder-1.png" />
                            <ProjectCard currentPath="explore" imageName="project-placeholder-2.png" />
                            <ProjectCard currentPath="explore" imageName="project-placeholder-3.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 
