import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import Sidebar from "@/components/Sidebar";
import { CircleCheck, Clock4, Layers } from "lucide-react";
import { headers } from "next/headers";

export default async function Home() {
    return (
         <div className="flex bg-light-gray min-h-screen">
            <Sidebar />
            <div className="col-span-5 w-full">
                <div className="w-full h-fit bg-whitish py-5 px-10 border-b border-gray-200 shadow-xs">
                    <div className="max-w-360 mx-auto">
                        <Header showSearch={false} />
                    </div>
                </div>
                <div className="w-full h-fit py-5 px-10">
                    <div className="max-w-360 mx-auto">
                        <div className="grid grid-cols-3 gap-5">
                            <div className="card-style-secondary shadow! h-25 p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-dark/40 font-epilogue font-bold">Total Projects.</p>
                                    <h2 className="text-4xl font-semibold font-raleway">23</h2>
                                </div>
                                <div className="p-2 bg-light-gray rounded-full text-light-red">
                                    <Layers strokeWidth={3} width={50} />
                                </div>
                            </div>
                            <div className="card-style-secondary shadow! h-25 p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-dark/40 font-epilogue font-bold">Completed Projects.</p>
                                    <h2 className="text-4xl font-semibold font-raleway">14</h2>
                                </div>
                                <div className="p-2 bg-light-gray rounded-full text-lime-yellow">
                                    <CircleCheck strokeWidth={3} width={50} />
                                </div>
                            </div>
                            <div className="card-style-secondary shadow! h-25 p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-dark/40 font-epilogue font-bold">Pending Projects.</p>
                                    <h2 className="text-4xl font-semibold font-raleway">9</h2>
                                </div>
                                <div className="p-2 bg-light-gray rounded-full text-light-green">
                                    <Clock4 strokeWidth={3} width={50} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-5 mt-5">
                            <div className="col-span-2 grid grid-cols-2 gap-5">
                                <h3 className="col-span-2 h-three-style">Your Recent Projects</h3>
                                <ProjectCard currentPath="home" imageName="project-placeholder-5.png" />
                                <ProjectCard currentPath="home" imageName="project-placeholder-4.png" />
                            </div>
                            <div className="card-style-secondary shadow!">
                                <h3 className="h-three-style">Recent Activities</h3>
                                <hr className="hr-style my-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}