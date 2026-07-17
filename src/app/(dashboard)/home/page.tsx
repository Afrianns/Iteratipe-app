import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import { auth } from "@clerk/nextjs/server";
import { CircleCheck, Clock4, Layers } from "lucide-react";
import UnauthorizedInfo from "../_components/UnauthorizedInfo";
import SidebarWrapper from "@/components/SidebarWrapper";

// import Types from "@/../resources/Types.json";

export default async function Home() {


    // const users = await prisma.additionalUserInfo.findMany();
    
    const { isAuthenticated } = await auth()

    // const insertData = async () => {
    //     try {
    //         // createMany inserts the entire array into your Neon table in a single query
    //         const result = await prisma.types.createMany({
    //             data: Types, 
    //             skipDuplicates: true, // Optional: ignores errors if a unique key matches
    //         });

    //         console.log(`Successfully inserted ${result.count} rows!`);
    //         return result;
    //     } catch (error) {
    //         console.error("Failed to insert data:", error);
    //     }
    // }
    // insertData()
    return (
         <div className="container-wrapper-style">
            <SidebarWrapper />
            <div className="col-span-5 w-full">
                <div className="container-style container-accent-style">
                    <div className="limit-breaker">
                        <Header showSearch={false} />
                    </div>
                </div>
                <div className="container-style">
                    {!isAuthenticated ? 
                        <UnauthorizedInfo />
                    :
                        <div className="limit-breaker max-md:mb-20">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div className="card-style-secondary card-home-list-style">
                                    <div>
                                        <p className="text-sm text-purple-dark/40 font-epilogue font-bold">Total Projects.</p>
                                        <h2 className="text-4xl font-semibold font-raleway">23</h2>
                                    </div>
                                    <div className="p-2 bg-light-gray rounded-full text-light-red">
                                        <Layers strokeWidth={3} width={50} />
                                    </div>
                                </div>
                                <div className="card-style-secondary card-home-list-style">
                                    <div>
                                        <p className="text-sm text-purple-dark/40 font-epilogue font-bold">Completed Projects.</p>
                                        <h2 className="text-4xl font-semibold font-raleway">14</h2>
                                    </div>
                                    <div className="p-2 bg-light-gray rounded-full text-lime-yellow">
                                        <CircleCheck strokeWidth={3} width={50} />
                                    </div>
                                </div>
                                <div className="card-style-secondary card-home-list-style">
                                    <div>
                                        <p className="text-sm text-purple-dark/40 font-epilogue font-bold">Pending Projects.</p>
                                        <h2 className="text-4xl font-semibold font-raleway">9</h2>
                                    </div>
                                    <div className="p-2 bg-light-gray rounded-full text-light-green">
                                        <Clock4 strokeWidth={3} width={50} />
                                    </div>
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-3 gap-5 mt-5">
                                <div className="col-span-2 grid md:grid-cols-2 gap-5">
                                    <h3 className="col-span-full h-three-style">Your Recent Projects</h3>
                                    <ProjectCard currentPath="home" imageName="project-placeholder-5.png" />
                                    <ProjectCard currentPath="home" imageName="project-placeholder-4.png" />
                                </div>
                                <div className="max-md:row-start-1 card-style-secondary shadow! h-fit max-md:col-span-2">
                                    <h3 className="h-three-style">Recent Activities</h3>
                                    <hr className="hr-style my-2" />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
