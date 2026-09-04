"use client"

import Image from "next/image";
import { UserProjectPreviewType } from "../page";
import Link from "next/link";
import { Settings } from "lucide-react";
import Follow from "./follow";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";


export default function Profile({initialUser}: {initialUser: UserProjectPreviewType}) {

  const [user, setUser] = useState<UserProjectPreviewType>({
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
  })

  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    setUser(initialUser)
  }, [initialUser])

  return (
    <div className="mx-auto flex gap-x-5 items-start justify-around max-w-4xl rounded-md">
      <div className="flex gap-x-4">
        <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 z-2">
        {user.image_url && (
              <>
                  <Image alt="user profile placeholder" src={user.image_url} fill className="object-cover"/>
              </>
              )
          }
        </div>
        <div>
          <h1 className="h-two-style text-2xl! flex items-center">{user.full_name} 
            <span className="bg-main-text text-secondary text-xs ml-2 py-1 px-3 rounded">Pro</span> </h1>
          <p className="p-style text-main!">@{user.username}</p>

          <div className="flex items-center gap-x-3 mt-2">
              <p className="span-style">{user._count.Followers} Followers</p>
              <p className="span-style">{user._count.Followings} Following</p>
          </div>
        </div>
      </div>
      <div className="space-y-3 text-right">
        {isLoaded &&
          <>
            {userId == user.clerk_user_id ?
              <Link href="/profile">
                <div className="button-style-tertiary rounded-full flex items-center gap-x-2">
                  {/* Settings */}
                  <Settings className="w-4 h-4" />
                </div>
              </Link>
              : <Follow user={user} setUser={setUser} />
            }
          </>
        }
      </div>
    </div>
  )
}