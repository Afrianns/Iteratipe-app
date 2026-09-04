"use server"

import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { getProjectIDbyUID } from "./projects.service";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";

export async function getUserIdAndProjectId(projectId: string): Promise<returnDataType<{
 user_id: number
 project_id: number
 username: string
}>> {

  const { userId } = await auth()
  let userDbId: number = 0;
  let projectDbId: number = 0;
  let username: string = ""

  try {
    if(userId){
      const resultUserId = await getUserID(userId)
  
      if(resultUserId.status == 200 && resultUserId.data?.id && resultUserId.data?.username){
        userDbId = resultUserId.data.id,
        username = resultUserId.data.username
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
          project_id: projectDbId,
          username: username
        }
      }
    } else{
      throw new Error("project ID or user ID not found!");
      
    }

  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}

export async function getItemWithTempItemByProjectUid(projectUid: string, type: string): Promise<returnDataType<{
  totalItems: number,
  ItemByAuthUser: string|null
}>> {
  const user = await auth();

  const prismaClient = prisma as any;

  try {

    if(!user.isAuthenticated) {
      return {
        status: 500,
        message: "User not found"
      }
    }

    const userId = await getUserID(user.userId)

    const projectId = await getProjectIDbyUID(projectUid)

    if(projectId.status != 200 || !projectId.data?.id){
      throw new Error("Failed to get project id")
    }

    const result = await prismaClient[`${type}s`].findMany({
      select: {
        project_id: true,
        user_id: true
      },
      where: {
        project_id: projectId.data.id
      }
    })

    // console.log("inii", userId)

    const tempItemCount = await redis.get(`${type}:${projectId.data.id}:increment`);

    const stringifiedTempItemByAuthUser = await redis.get(`${type}:${projectId.data.id}:${userId.data?.id}`)

    const tempItemByAuthUser = stringifiedTempItemByAuthUser ? JSON.parse(stringifiedTempItemByAuthUser) : null
    return {
      status: 200,
      message: "Successful retrieved total Items",
      data: {
        totalItems: result.length + (tempItemCount ? parseInt(tempItemCount) : 0),
        ItemByAuthUser: tempItemByAuthUser?.type
      }
    };

  } catch(err) {
    return await serverSideErrorHandle(err)
  }
}