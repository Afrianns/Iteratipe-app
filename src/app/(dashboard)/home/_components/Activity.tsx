"use client"

import { useEffect, useState } from "react"
import { convertDate } from "@/lib/convertDate"

import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react"
import { formatDistance } from "date-fns"
import { useAuth } from "@clerk/nextjs"
import Image from "next/image"
import { channel } from "@/lib/pusher"
import { ActivityType } from "@/types/types"
import ActivityList from "@/components/ActivityList"


export default function Activity({ Activities }: {Activities: ActivityType[]}) {


  const [loading, setLoading] = useState<boolean>(true)

  const [activities, setActivities] = useState<ActivityType[]>([])

  const { userId } = useAuth()

  const [sorting, setSorting] = useState<"ASC"|"DSC">("ASC")

  useEffect(() => {
    console.log(Activities)
    setLoading(false)
    setActivities(Activities)

    return () => {
      setActivities([])
      setLoading(false)
    }
    
  }, [Activities])

  const setSortingActivities = () => {
    if(sorting == "ASC"){
      setSorting("DSC")
    } else{
      setSorting("ASC")
    }
  }

  useEffect(() => {
    const handleNotify = (activity: ActivityType) => {
      setActivities((prevActivities) => [...prevActivities, {...activity, created_at: new Date(activity.created_at)}])
      console.log("counting-- ",activities, {...activity, created_at: new Date(activity.created_at)})
    }

    channel.bind(`notify-${userId}`, handleNotify)

    return () => {
      channel.unbind(`notify-${userId}`, handleNotify)
    }
  }, [userId])

  return (
    <div className="max-md:row-start-1 card-style-secondary p-0! h-fit max-md:col-span-2">
      <div className='flex items-center justify-between p-5'>
        <h3 className="h-three-style">Recent Activities</h3>
        <button onClick={setSortingActivities} className="cursor-pointer">
            {sorting == "ASC" ? 
                <ArrowDownWideNarrow className="icon-style" />
            :
                <ArrowUpWideNarrow className="icon-style" />
            }
        </button>
      </div>
      <hr className="hr-style opacity-45" />
      <div className="p-5 space-y-5">
        {!loading ?
          <>
            {sortActivities(activities, sorting).map((activity) => {
              return <ActivityList key={activity.id} activity={activity} />
            })}
          </>
        :
          <ActivityLoading />
        }
      </div>
  </div>
  )
}

const sortActivities = (activities: ActivityType[], sorting: "ASC"|"DSC") =>{
  if(activities.length <= 0) return []

  return activities.sort((activityA, activityB) => {
    
    let A = activityA.created_at
    let B = activityB.created_at

    if(sorting == "ASC") {
      A = activityB.created_at
      B = activityA.created_at
    } 
    
    return new Date(A).getTime() - new Date(B).getTime()
  })
}


const ActivityLoading = () => {
  const total = [1,2,3]
  return (
    <div className="space-y-5 mt-5">
      {total.map((list) => 
        <div className="space-y-1" key={list}>
          <div className="block h-4 w-50 bg-slate-200 animate-pulse rounded"></div>
          <div className="flex items-center justify-between">
            <div className="block h-4 w-25 bg-slate-200 animate-pulse rounded"></div>
            <div className="block h-4 w-20 bg-slate-200 animate-pulse rounded ml-auto"></div>
          </div>
        </div>
      )}
    </div>
  )
}