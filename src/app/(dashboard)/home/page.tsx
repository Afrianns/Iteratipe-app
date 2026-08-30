"use server"

import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { getUser } from "@/services/user.service";
import { ActivityType, SortingType, StatusType, UserType } from "@/types/types";
import { getTotalAuthUserProjectLikes } from "@/services/like.service";
import { Link2 } from "lucide-react";

import UnauthorizedInfo from "../_components/UnauthorizedInfo";
import AuthenticatedProjectLists from "./_components/AuthenticatedProjectLists";
import HeaderHome from "./_components/HeaderHome";
import useMasonry from "@/hooks/useMasonry";
import Header from "@/components/Header";
import Link from "next/link";

import Redis from "ioredis"
import Activity from "./_components/Activity";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL

interface userWithAdditionalData extends UserType {
   _count: {Followers: number, Followings: number}
   Activities: ActivityType[]
} 

export default async function Home({searchParams}:{searchParams: Promise<{sortby: SortingType, type: string, status: StatusType }>}) {
    const { isAuthenticated, userId } = await auth()

    let totalLike = 0

    const projectLike = await getTotalAuthUserProjectLikes()

    if(projectLike.status == 200 && projectLike.data?.project_total_likes){
        totalLike = projectLike.data?.project_total_likes
    }


    let userAdditionalData: userWithAdditionalData = {
        id: 0,
        clerk_user_id: "",
        first_name: "",
        last_name: "",
        full_name: "",
        username: "",
        email: "",
        image_url: "",
        description: "",
        facebook_link: "",
        twitter_link: "",
        website_link: "",
        created_at: null,
        _count: {
            Followers: 0,
            Followings: 0
        },
        Activities: []
    }

    if(userId){
        const user = await getUser(userId)

        if(user.status == 200 && user.data){
            userAdditionalData = user.data
        }
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
                    <div className="limit-breaker max-md:mb-20">
                        <div className="my-5">
                            <div className="flex items-center gap-x-3">
                                <h1 className="text-3xl!">Hello, <span className="h-two-style text-3xl!">{userAdditionalData.full_name}</span></h1>
                                <Link target="_blank" title="go to public profile." href={`${APP_URL}/user/${userAdditionalData.username}`}>
                                    <Link2 className="w-5 h-5 text-main" /> 
                                </Link>
                            </div>
                            

                            <div className="flex gap-x-3 items-center my-5">
                                <div className="py-1 px-6 rounded-md bg-lightish">{userAdditionalData._count.Followers} Followers</div>
                                <div className="py-1 px-6 rounded-md bg-lightish">{userAdditionalData._count.Followings} Following</div>
                                <div className="py-1 px-6 rounded-md bg-lightish">{totalLike > 1 ? `${totalLike} Likes` : `${totalLike} Like`}</div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <Suspense fallback={<HeaderHomeLoading />}>
                                <HeaderHome />
                            </Suspense>
                        </div>
                        <div className="grid items-start lg:grid-cols-3 gap-5 mt-5">
                            <div className="col-span-2 grid md:grid-cols-2 gap-5">
                                <div className="col-span-full space-y-5">
                                    <h3 className="col-span-full h-three-style">Your Recent Projects</h3>
                                    
                                </div>
                                <Suspense fallback={<ProjectCardSkeleton />}>
                                    <AuthenticatedProjectLists searchParam={searchParams} />
                                </Suspense>
                            </div>
                            <Activity Activities={userAdditionalData.Activities} />
                        </div>
                    </div>
                }
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



const HeaderHomeLoading = () => {
    const ids = [1,2,3,4]
    return (
        <>
            {ids.map((id) =>
                <div key={id} className="card-style-secondary shadow-xs! card-home-list-style animate-pulse flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded-md w-30"></div>
                        <div className="h-9 bg-gray-200 rounded-md w-16"></div>
                    </div>
                    <div className="p-2 bg-gray-200 rounded-full w-16.5 h-16.5"></div>
                </div>
            )}
        </>
    )
}