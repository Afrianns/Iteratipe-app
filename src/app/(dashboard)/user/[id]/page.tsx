"use server"

import Header from "@/components/Header"
import { getUserByUsername } from "@/services/user.service"
import { labelType, ProjectPreviewType, UserType } from "@/types/types"
import { formatDistanceStrict } from "date-fns"
import Image from "next/image"
import { notFound } from "next/navigation"
import ListProjects from "./_components/projects"
import ListMenus from "./_components/menu"
import About from "./_components/about"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { Settings } from "lucide-react"

interface UserProjectPreviewType extends UserType {
  Projects: ProjectPreviewType[]
}
export default async function Page({params, searchParams}: {params: Promise<{id: string}>, searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
  const data = await params
  const param = await searchParams

  const { userId } = await auth()

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
    Projects: []
  }

  let types: labelType[] = []
  
  const resultUserData = await getUserByUsername(data.id.replace("%40", ""))

  if(resultUserData.status == 200 && resultUserData.data){
    initialUser = resultUserData.data
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
                  <div className="mx-auto flex gap-x-5 items-start justify-around max-w-4xl rounded-md">
                    <div className="flex gap-x-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 z-2">
                      {initialUser.image_url && (
                            <>
                                <Image alt="user profile placeholder" src={initialUser.image_url} fill className="object-cover"/>
                            </>
                            )
                        }
                      </div>
                      <div>
                        <h1 className="h-two-style text-2xl! flex items-center">{initialUser.full_name} 
                          <span className="bg-main-text text-secondary text-xs ml-2 py-1 px-3 rounded">Pro</span> </h1>
                        <p className="p-style text-main!">@{initialUser.username}</p>

                        <div className="flex items-center gap-x-3 mt-2">
                            <p className="span-style">5 Followers</p>
                            <p className="span-style">12 Following</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 text-right">
                      {userId == initialUser.clerk_user_id ?
                        <Link href="/profile">
                          <div className="button-style-tertiary rounded-full flex items-center gap-x-2">
                            {/* Settings */}
                            <Settings className="w-4 h-4" />
                          </div>
                        </Link>
                        : <div className="button-style rounded-full">Follow</div>
                      }
                    </div>
                  </div>
                </div>
                {/* it list of type project and aboutuser */}
                <ListMenus types={types} />

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