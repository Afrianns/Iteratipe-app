"use client"

import { bookmarkProject } from "@/services/bookmark.service";
import { ProjectPreviewType, VISIBLE } from "@/types/types";
import { Bookmark, GlobeLock, Heart, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Image from "next/image";
import Link from "next/link";
import { likeProject } from "@/services/like.service";
import { useAuth } from "@clerk/nextjs";
import { getItemWithTempItemByProjectUid } from "@/services/partial.service";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL 

export default function ProjectCard({currentPath, projectData, imageName}: {currentPath: string, projectData: ProjectPreviewType, imageName: string}) {

    const { isSignedIn, userId, isLoaded } = useAuth()

    const [bookmark, setBookmark] = useState<boolean>(false)
    const [bookmarkCount, setBookmarkCount] = useState<number>(projectData._count.Bookmarks);
    
    const [like, setLike] = useState<boolean>(false)
    const [likeCount, setLikeCount] = useState<number>(projectData._count.Likes);

    useEffect(() => {
        if (!isLoaded) return;
        
        const fetchLikeStatus = async () => {
            const result = await getItemWithTempItemByProjectUid(projectData.uid, "like");

            let liked = projectData.Likes.length >= 1;
            setLike(liked);
            
            if(result.status == 200 && result.data){
                setLikeCount(result.data.totalItems)

                if(result.data.ItemByAuthUser != null) {
                    setLike(result.data.ItemByAuthUser == "like" ? true : false)
                }
            }
        };


        const fetchBookmarkStatus = async () => {
            const result = await getItemWithTempItemByProjectUid(projectData.uid, "bookmark");
            let bookmarked = projectData.Bookmarks.length >= 1;
            setBookmark(bookmarked);
            
            if(result.status == 200 && result.data){
                setBookmarkCount(result.data.totalItems)

                if(result.data.ItemByAuthUser != null) {
                    setBookmark(result.data.ItemByAuthUser == "bookmark" ? true : false)
                }
            }
        }
        
        fetchLikeStatus()
        fetchBookmarkStatus()

    }, [projectData, isLoaded, userId]);

    const bookmarkThis = async () => {
        if(!isSignedIn) return toast.warning("You need to signin first!")

        setBookmark(!bookmark)
        const result = await bookmarkProject(projectData.Users.username, projectData.uid, projectData.title)
        
        if(result.status == 200 && result.data){
            setBookmarkCount(result.data.newTotalBookmarked)
            toast.success(`${result.message}: ${projectData.title}`)
        } else{
            toast.warning(result.message)
            setBookmark(false)
        }
    }
    
    const likeThis = async () => {
        if(!isSignedIn) return toast.warning("You need to signin first!")

        console.log(projectData)
        setLike(!like)
        const result = await likeProject(projectData.Users.username, projectData.uid, projectData.title)
        
        if(result.status == 200 && result.data){
            setLikeCount(result.data.newTotalLiked)
            toast.success(`${result.message}: ${projectData.title}`)
        } else{
            toast.warning(result.message)
            setLike(false)
        }
    }
    
    return (
        <div className="card-style-secondary p-0! w-full transition-style hover:shadow-lg! hover:-translate-y-1 h-fit overflow-hidden space-y-3">
            <div className={`relative ${ projectData.Nodes[0]?.image_url ? "h-50":"h-20"}`}>
                {projectData.Nodes[0]?.image_url ?
                    <Image src={projectData.Nodes[0].image_url} draggable={false} fill alt="thumbnail" className="absolute object-cover" />
                :
                    <Image src={`/images/${imageName}`} draggable={false} fill alt="thumbnail" className="absolute object-cover" />
                }

                <span className="flex items-center gap-x-2 text-xs badge-style-secondary absolute bottom-3 left-3 rounded-2xl">
                    <Layers className="w-3 h-3 text-main-text" />
                    {stepReadability(projectData._count.Nodes)}
                </span>
                <span title={`this project is ${visiblityReadability(projectData.visibility)}`} className="flex items-center gap-x-2 text-xs badge-style-secondary absolute bottom-3 right-3 rounded-2xl">
                    <GlobeLock className="w-3 h-3 text-main-text" />
                    {visiblityReadability(projectData.visibility)}
                </span>
            </div>
            <div className="p-4 pt-0 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="badge-style bg-green-100">{projectData.Type?.name}</p>
                    <p className="badge-style bg-amber-100">{projectData.Status?.name}</p>
                </div>
                <div>
                    <Link href={`./${currentPath}/${(projectData.title).toLowerCase().split(" ").join("-")}—${projectData.uid}`} className="h-three-style capitalize hover:underline cursor-pointer">{projectData.title}
                    </Link>
                    <p className="span-style flex items-center gap-x-1 text-xs">
                        By
                        <Link href={`${APP_URL}/user/${projectData.Users.username}`} className="p-style hover:underline hover:cursor-pointer text-xs! text-main!">{projectData.Users?.full_name}</Link>
                    </p>    
                </div>
                <div className="flex items-center justify-between">
                    <p onClick={bookmarkThis} className={`flex text-xs items-center gap-x-1 px-3 rounded-full cursor-pointer hover:bg-light-gray ${bookmark && "bg-blue-500/10 text-blue-500"}`}>
                        <Bookmark className={`w-3 ${bookmark && "text-blue-500 fill-blue-500"}`} />
                        {bookmarkCount}
                    </p>

                     <p onClick={likeThis} className={`flex text-xs items-center gap-x-1 hover:bg-light-gray px-3 rounded-full cursor-pointer ${like && "bg-light-red/10 text-light-red"}`}>
                        <Heart className={`w-3 ${like && "text-light-red fill-light-red"}`} />
                        {likeCount}
                    </p>
                </div>
            </div>
        </div>
    )
}

const visiblityReadability = (visibility: VISIBLE) => {
    return (visibility == "SEMI") ? "hybrid" : visibility.toLowerCase()
}

const stepReadability = (step: number) => {
    return (step > 1) ? `${step} steps` : `${step} step`
}