"use server"

import { prisma } from "@/lib/db";
import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { ActivityType, returnDataType } from "@/types/types";


export async function getRelatedActivities(userID: number): Promise<returnDataType<ActivityType[]>> {
  try {  
    const activities = await prisma.activities.findMany({
      where: {
        Object_user_id: userID
      },

      select: {
        id: true,
        messages: true,
        seen: true,
        created_at: true,
        Subject_user_id: true,
        Subject: {
          select: {
            image_url: true
          }
        }
      }
    })


    if(activities.length > 0) {
      return {
        status: 200,
        message: "success",
        data: mappingActivities(activities)
      }
    } else{
      throw new Error("No Activities");
      
    }
      
  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}


const mappingActivities = (activities: {
  id: number,
  Subject_user_id: number;
  messages: string;
  seen: boolean;
  created_at: Date;
  Subject: {
      image_url: string;
  };
}[]) => {
  return activities.map((activity) => {
      return {
        user_image_url: activity.Subject.image_url,
        id: activity.id,
        user_id: activity.Subject_user_id,
        messages: activity.messages,
        seen: activity.seen,
        created_at: activity.created_at
      }
  }).sort((activityA, activityB) => new Date(activityB.created_at).getTime() - new Date(activityA.created_at).getTime())
}