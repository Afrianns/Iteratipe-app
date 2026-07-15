import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import Sidebar from "@/components/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { Lock } from "lucide-react";
import Link from "next/link";
import UnauthorizedInfo from "../_components/UnauthorizedInfo";
import SidebarWrapper from "@/components/SidebarWrapper";

export default async function Collections() {
    const { isAuthenticated } = await auth()
    return (
        <div className="flex bg-light-gray min-h-screen">
            <SidebarWrapper />
            <div className="col-span-5 w-full">
                <div className="w-full h-fit bg-whitish py-5 px-10 border-b border-gray-200 shadow-xs">
                    <div className="max-w-360 mx-auto">
                        <Header />
                    </div>
                </div>
                <div className="w-full h-fit py-5 px-10">
                    {!isAuthenticated ? 
                        <UnauthorizedInfo />
                    :
                        <div className="max-w-360 mx-auto">
                            <div className=" grid grid-cols-3 gap-5">
                                <ProjectCard currentPath="collections" imageName="project-placeholder-4.png" />
                                <ProjectCard currentPath="collections" imageName="project-placeholder-5.png" />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}