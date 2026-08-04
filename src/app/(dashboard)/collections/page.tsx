import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import { auth } from "@clerk/nextjs/server";
import UnauthorizedInfo from "../_components/UnauthorizedInfo";
import Sidebar from "@/components/Sidebar";

export default async function Collections() {
    const { isAuthenticated } = await auth()
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
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}