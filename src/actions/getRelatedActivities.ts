"use server";

import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { getRelatedActivities } from "@/services/activities.service";
import { getUserID } from "@/services/user.service";
import { ActivityType, returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export async function getActivities(): Promise<returnDataType<ActivityType[]>> {
  const { userId } = await auth()

  try {
    if(userId) {
      const userID = await getUserID(userId)

      if(userID.data && userID.status == 200) {
        const result = await getRelatedActivities(userID.data?.id)


        if(result.status == 200){
          return {
            status: 200,
            message: "success",
            data: result.data
          }
        }
      }
    }

    throw new Error("Ops... Something went wrong");
    
  } catch (error) {
    return serverSideErrorHandle(error)
  }
}