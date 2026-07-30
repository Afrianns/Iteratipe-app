"use server"

import Header from "@/components/Header";
import { auth } from "@clerk/nextjs/server";
import { CircleCheck, Clock4, Layers } from "lucide-react";
import UnauthorizedInfo from "../_components/UnauthorizedInfo";
import Sidebar from "@/components/Sidebar";
import AuthenticatedProjectLists from "./_components/AuthenticatedProjectLists";
import { Suspense } from "react";
import HeaderHome from "./_components/HeaderHome";
import useMasonry from "@/hooks/useMasonry";
import { prisma } from "@/lib/db";

import Types from "@/../resources/Types.json"
import Tags from "@/../resources/Tags.json"

// import Types from "@/../resources/Types.json";

export default async function Home() {


    // const users = await prisma.additionalUserInfo.findMany();
    
    const { isAuthenticated } = await auth()

    // // const insertData = async () => {
    //     try {
    //         // createMany inserts the entire array into your Neon table in a single query
    //         const result = await prisma.tags.create({
    //             data: {
    //                 name: "book"
    //             }, 
    //             // skipDuplicates: true, // Optional: ignores errors if a unique key matches
    //         });

    //         console.log(result)

    //     //     console.log(`Successfully inserted ${result.count} rows!`);
    //     //     return result;

    //     } catch (error) {
    //         console.error("Failed to insert data:", error instanceof Error ? error.message : "Database connection lost.");
    //     }
    // // }

    return (
         <div className="container-wrapper-style">
            <Sidebar />
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
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                                <HeaderHome />
                            </div>
                            <div className="grid lg:grid-cols-3 gap-5 mt-5">
                                <div className="col-span-2 grid md:grid-cols-2 gap-5">
                                    <h3 className="col-span-full h-three-style">Your Recent Projects</h3>
                                    <Suspense fallback={<ProjectCardSkeleton />}>
                                        <AuthenticatedProjectLists />
                                    </Suspense>
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


function ProjectCardSkeleton() {
    let counts = [1,2,3]
  return (
    <>
        {counts.map((_, key) => {
            return <div key={key}>
                <div className="card-style-secondary p-0! w-full relative h-full max-h-80 overflow-hidden animate-pulse">
                    <div className="h-30 bg-gray-200 relative">
                        <div className="absolute bottom-2 left-2 bg-gray-300 h-5 w-20 rounded" />
                    </div>

                    <div className="p-4 pt-0 space-y-3">
                        <div className="flex items-center justify-between pt-2">
                        <div className="h-4 w-14 bg-gray-200 rounded-full" />
                        <div className="h-4 w-20 bg-gray-200 rounded-full" />
                        </div>

                        <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-3/5 bg-gray-200 rounded" />
                            <div className="h-2 w-1/3 bg-gray-200 rounded" />
                        </div>
                        <div className="h-5 w-9 bg-gray-200 rounded-full" />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                        <div className="h-4 w-10 bg-gray-200 rounded" />
                        <div className="h-5 w-9 bg-gray-200 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        })}
    </>
  );
}

