"use client"

import { getActivities } from "@/actions/getRelatedActivities";
import { channel } from "@/lib/pusher";
import { ActivityType } from "@/types/types";
import { useAuth } from "@clerk/nextjs";
import { Bell, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ActivityList from "./ActivityList";
import { hasReadAllNotification } from "@/services/comments.service";
import { toast } from "sonner";

export default function Header({ showSearch = true }: {showSearch?: boolean}) {
    const pathname = usePathname()

    const {userId} = useAuth()
    const buttonMenuRef = useRef<HTMLDivElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const paths = pathname.split('/').filter((path) => path != "");

    const [showNotification, setShowNotification] = useState<boolean>(false)
    const [activities, setActivities] = useState<ActivityType[]>([])

    const [notificationCount, setNotificationCount] = useState<number>(0)

    const openNotification = () => {
        setShowNotification(true)
    }

    const hasReadAll = async () => {
        const result = await hasReadAllNotification()
        if(result.data && result.status == 200) {
            toast.success(`${result.message}: ${result.data.totalUpdated} in totals`)

            setActivities(prevActivities =>
                prevActivities.map((activity) => {
                    return {...activity, seen: true}
                })
            )
            setNotificationCount(0)
        }
    }

    useEffect(() => {

        const setInitialActivities = async () => {
            const result = await getActivities()

            if(result.data && result.status == 200){
                setActivities(result.data)
                console.log(result.data)

                const total = result.data.filter(total => total.seen === false).length

                setNotificationCount(total)
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            const clickedElement = event.target as Node;

            console.log(clickedElement, buttonMenuRef.current, menuRef.current)
            const buttonMenu = buttonMenuRef.current?.contains(clickedElement);
            const clickedMenu = menuRef.current?.contains(clickedElement);
            if (!buttonMenu && !clickedMenu) setShowNotification(false);
        }

        document.addEventListener('mousedown', handleClickOutside)
        
        setInitialActivities()

        return () => {
            setActivities([])
            setNotificationCount(0)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    useEffect(() => {
        const handleNotify = (activity: ActivityType) => {
            setActivities(prevActivities => [{...activity, created_at: new Date(activity.created_at)}, ...prevActivities])
            setNotificationCount((prevNotificationCount) => prevNotificationCount + 1)
        }

        channel.bind(`notify-${userId}`, handleNotify)

        return () => {
            channel.unbind(`notify-${userId}`, handleNotify)
        }
    }, [userId])

    return (
        <div className="flex justify-between items-center relative">
            <div className="flex items-center">
                {paths.map((path, idx) => {
                    return <div key={idx} className="flex items-center">
                        <Link href={`/${getRouteLinkFn(paths, idx)}`} className="hover:underline text-sm text-gray-500">{getTitleUrlFn(path)}
                        </Link>
                        {(idx < paths.length-1) && 
                        <ChevronRight className="w-4 h-4 font-extralight text-grayish mx-2" /> }
                    </div>
                })}
            </div>
            {showSearch &&
                <div className="flex items-center relative w-fit lg:w-full lg:max-w-100">
                    <Search className="text-gray-400 absolute left-2 w-5 h-5" />
                    <input type="text" name="search" className="pl-9 py-2 px-5 rounded-full border border-grayish outline-main focus:ring-0 text-xs w-full" placeholder="Search designs..." />
                </div>
            }
            <div className="relative" ref={buttonMenuRef}>
                {notificationCount >= 1 &&
                    <span className="w-fit h-fit px-2 bg-light-red rounded-full absolute top-0 right-0 span-style text-whitish!">{notificationCount}</span>
                }
                <Bell className="icon-style" onClick={openNotification} />
            </div>
            {showNotification &&
                <div ref={menuRef} className="card-style absolute top-10 right-0 px-5 py-3 z-5">
                    {activities.length <= 0 ?
                        <p className="h-four-style text-center">There is no notification</p>
                    :
                        <>
                            <p className="span-style text-right cursor-pointer underline hover:no-underline text-tertiary" onClick={hasReadAll}>Read All</p>
                            {activities.map((activity) => {
                                return <div key={activity.id} className={`px-5 py-4 rounded-md ${!activity.seen && "bg-lime-yellow/30"}`}>
                                    <ActivityList activity={activity} />
                                </div>
                            })}
                        </>
                    }
                </div>
            }
        </div>
    )
}

const getTitleUrlFn = (path: string) => {
    if(path.match("%E2%80%94")){
        return path.split("%E2%80%94")[0].split("-").join(" ")
    } else{
        return path
    }
}

const getRouteLinkFn = (paths: string[], idx: number) => {
    let pathLink = [];

    for (let i = 0; i <= idx; i++) {
        pathLink.push(paths[i])
    }
    
    return pathLink.join("/");
}