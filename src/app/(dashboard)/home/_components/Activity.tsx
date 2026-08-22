"use client"

import { useEffect, useState } from "react"
import { convertDate } from "@/lib/convertDate"
import DOMPurify from "dompurify"
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react"
import { formatDistance, subDays } from "date-fns"

export interface ActivityType {
  id: number
  user_id: number
  messages: string
  created_at: Date
}

export default function Activity({ Activities }: {Activities: ActivityType[]}) {

  const [loading, setLoading] = useState<boolean>(false)

  const [sorting, setSorting] = useState<"ASC"|"DSC">("ASC")

  useEffect(() => {
    setLoading(true)
  }, [])

  const setSortingActivities = () => {
    if(sorting == "ASC"){
      setSorting("DSC")
    } else{
      setSorting("ASC")
    }
  }

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
      <div className="p-5">
        {loading ?
          <>
            {sortActivities(Activities, sorting).map((activity) => {
              return <div key={activity.id} className='my-5 space-y-3'>
                  <div className='message-content' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(activity.messages) }} />
                  <div className="flex items-center justify-between my-2">
                    <p className="p-style">{formatDistance(new Date(activity.created_at), new Date(), { addSuffix: true })}</p>
                    <p className='span-style'>{convertDate(activity.created_at)}</p>
                  </div>
                  {/* <hr className="hr-style" /> */}
              </div>
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