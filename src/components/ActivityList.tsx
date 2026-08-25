import { convertDate } from "@/lib/convertDate";
import { ActivityType } from "@/types/types";
import { formatDistance } from "date-fns";
import DOMPurify from "dompurify"
import Image from "next/image";

export default function ActivityList({activity}:{activity: ActivityType}) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between gap-x-5">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-grayish">
            {activity.user_image_url &&
              <Image alt="user profile placeholder" src={activity.user_image_url} fill className="object-cover"/>
            }
          </div>
          <div className="w-6/7">
            <div className='message-content' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(activity.messages) }} />
            <div className="flex items-center justify-between my-2">
              <p className="p-style">{formatDistance(new Date(activity.created_at), new Date(), { addSuffix: true })}</p>
              <p className='span-style'>{convertDate(activity.created_at)}</p>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}