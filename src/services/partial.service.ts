import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { getProjectIDbyUID } from "./projects.service";

export async function getUserIdAndProjectId(projectId: string): Promise<returnDataType<{
 user_id: number;
 project_id: number;
}>> {

  const { userId } = await auth()
  let userDbId: number = 0;
  let projectDbId: number = 0;

  try {
    if(userId){
      const resultUserId = await getUserID(userId)
  
      if(resultUserId.status == 200 && resultUserId.data?.id){
        userDbId = resultUserId.data.id
      } else{
        throw new Error("User id not found. Please try again later!");
      }
    }
    
    const resultProjectId = await getProjectIDbyUID(projectId)
    
    if(resultProjectId.status == 200 && resultProjectId.data?.id){
      projectDbId = resultProjectId.data.id
    } else{
      throw new Error("User id not found. Please try again later!");
    }


    if(userDbId != 0 && projectDbId != 0) {
      return {
        status: 200,
        message: "fetched the id",
        data: {
          user_id: userDbId,
          project_id: projectDbId
        }
      }
    } else{
      throw new Error("project ID or user ID not found!");
      
    }

  } catch (error) {
    return tempErrorHandle(error)
  }
}