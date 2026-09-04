"use server"

import { getUserByUsername } from "@/services/user.service"
import { labelType, ProjectPreviewType, SortingType, UserType } from "@/types/types"
import { formatDistanceStrict } from "date-fns"
import { getTypeAndSort } from "@/lib/sorting"
import { notFound } from "next/navigation"

import Header from "@/components/Header"
import ListProjects from "./_components/projects"
import About from "./_components/about"
import Link from "next/link"
import Profile from "./_components/profile"
import Menu from "@/components/Menu"

type CurrentUserFollow = {id: number}

export interface UserProjectPreviewType extends UserType {
  Followers: CurrentUserFollow[]
  _count: {Followers: number, Followings: number}
  Projects: ProjectPreviewType[]
}
export default async function Page({params, searchParams}: {params: Promise<{id: string}>, searchParams: Promise<{ type: string, sortby: SortingType, section: string }>}) {
  
  let sortBy: SortingType = "ASC"
  let types: labelType[] = []

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
    instagram_link: "",
    facebook_link: "",
    twitter_link: "",
    website_link: "",
    created_at: null,
    _count: {Followers: 0, Followings: 0},
    Followers: [],
    Projects: []
  }

  if(param.sortby == "ASC") sortBy = "DSC"
  
  const resultUserData = await getUserByUsername(data.id.replace("%40", ""))

  if(resultUserData.status == 200 && resultUserData.data){
    console.log(resultUserData.data)
    initialUser = resultUserData.data as UserProjectPreviewType
    types = getTypeAndSort(resultUserData.data.Projects)
  } else{
    notFound()
  }

  return (
    <div className="col-span-5 w-full">
        <div className="container-style container-accent-style">
            <div className="limit-breaker">
                <Header />
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

                <div className="flex items-center gap-x-3 my-3 h-15">
                  <div className="w-full">
                    <Menu sortType={sortBy} types={types} />
                  </div>
                  <div className="card-style-secondary p-2!">
                    <Link href={`?section=about`} className={`block rounded-md text-xs text-nowrap hover:bg-secondary cursor-pointer py-2 px-5 ${param.section === "about" ? "bg-secondary text-main": "hover:bg-secondary"}`}>About Designer</Link>
                  </div>
                </div>

                {param.section != "about" ?
                  <div className="col-span-2 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <ListProjects sortBy={sortBy} projects={initialUser.Projects} />
                  </div>
                :
                  <About user={initialUser} />
                }
            </div>
        </div>
    </div>
  )
}