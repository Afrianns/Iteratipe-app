import Header from "@/components/Header";
import { UserAvatar } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { formatDistanceStrict } from "date-fns";
import Link from "next/link";
import { SignOut } from "./_components/SignOut";
import ProjectCard from "@/components/ProjectCard";
import { getCurrentUserProjects } from "@/services/projects.service";
import { ProjectType } from "@/types/types";

export default async function Profile() {
    let projects: ProjectType[] = []

    const user = await currentUser();

    const userId = user?.id;

    if(userId){
        const result = await getCurrentUserProjects(userId)
        if(result.status == 200 && result.data)
            projects = result.data.Projects
    }
    return (

        <div className="col-span-5 w-full">
            <div className="container-style container-accent-style">
                <div className="limit-breaker">
                    <Header showSearch={false} />
                </div>
            </div>
            <div className="container-style">
                <div className="limit-breaker">
                    {user?.createdAt &&
                        <p className="capitalized font-extralight mb-5 text-xs opacity-45">Designer since {formatDistanceStrict(new Date(user.createdAt), new Date(), { addSuffix: true })}</p>
                    }
                    <div className="card-style-secondary space-y-5 p-5">
                        <div className="flex gap-x-5 items-center justify-center">
                            <UserAvatar appearance={{
                                elements: {
                                    avatarBox: "w-20 h-20"
                                }
                            }} />
                            <div>
                                <div>
                                    <h1 className="h-two-style">{user?.fullName}</h1>
                                    <p className="span-style">{user?.id}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-x-5 justify-center items-center">
                            <div className="flex justify-center gap-x-5">
                                <Link href="/profile/settings" className="button-style-secondary rounded-full">Edit Profile</Link>
                            </div>
                            <SignOut />
                        </div>
                    </div>

                    <h4 className="my-3">All Design.</h4>

                    <div className="col-span-2 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {projects.map((project) => {
                            return <ProjectCard key={project.id} projectData={project} currentPath="home" imageName={"no-thumbnail-placeholder.png"} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}