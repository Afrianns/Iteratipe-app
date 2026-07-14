import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import Sidebar from "@/components/Sidebar";

export default async function ExplorePage() {

    return (
        <div className="flex bg-light-gray min-h-screen">
            <Sidebar />
            <div className="col-span-5 w-full">
                <div className="w-full h-fit bg-whitish py-5 px-10 border-b border-gray-200 shadow-xs">
                    <div className="max-w-360 mx-auto">
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
                <div className="w-full h-fit py-5 px-10">
                    <div className="max-w-360 mx-auto">
                        <div className=" grid grid-cols-3 gap-5">
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
