"use server"

import Header from "@/components/Header"
import { getUserByUsername } from "@/services/user.service"
import { labelType, ProjectPreviewType, UserType } from "@/types/types"
import { formatDistanceStrict } from "date-fns"
import Image from "next/image"
import { notFound } from "next/navigation"
import ListProjects from "./_components/projects"
import About from "./_components/about"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { Settings } from "lucide-react"
import Follow from "./_components/follow"
import Profile from "./_components/profile"
import ListMenus from "@/components/ListMenus"

type CurrentUserFollow = {id: number}

export interface UserProjectPreviewType extends UserType {
  Followers: CurrentUserFollow[]
  _count: {Followers: number, Followings: number}
  Projects: ProjectPreviewType[]
}
export default async function Page({params, searchParams}: {params: Promise<{id: string}>, searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
  const data = await params
  const param = await searchParams

  let initialUser: UserProjectPreviewType = {
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
    _count: {Followers: 0, Followings: 0},
    Followers: [],
    Projects: []
  }

  let types: labelType[] = []
  
  const resultUserData = await getUserByUsername(data.id.replace("%40", ""))

  if(resultUserData.status == 200 && resultUserData.data){
    console.log(resultUserData.data)
    initialUser = resultUserData.data as UserProjectPreviewType
    types = resultUserData.data.Projects.map((project) => ({id: project.Type.id, name: project.Type.name}));
  } else{
    notFound()
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
                {initialUser.created_at &&
                    <p className="capitalized font-extralight mb-5 text-xs opacity-45">Designer since {formatDistanceStrict(new Date(initialUser.created_at), new Date(), { addSuffix: true })}</p>
                }
                <div className="card-style-secondary space-y-5 w-full h-fit py-5!">
                  <Profile initialUser={initialUser} />
                </div>
                {/* it list of type project and aboutuser */}
                <ListMenus types={types}> 
                  <Link href={`?section=about`} className={`col-span-2 md:col-span-1 text-center hover:bg-secondary/30 text-xs py-2 px-4 rounded-md cursor-pointer text-nowrap ${param.section === "about" ? "bg-secondary text-main": "hover:bg-secondary"}`}>About Designer</Link>
                </ListMenus>

                {param.section != "about" ?
                  <div className="col-span-2 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <ListProjects projects={initialUser.Projects} />
                  </div>
                :
                  <About user={initialUser} />
                }
            </div>
        </div>
    </div>
  )
}