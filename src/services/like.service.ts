"use server"

import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { prisma } from "@/lib/db";
import { getProjectIDbyUID } from "./projects.service";
import { getUserIdAndProjectId } from "./partial.service";

type ReturnType = returnDataType<{total_liked: number}>

export async function likeProject(projectUid: string): Promise<ReturnType> {
  
  let userId = 0;
  let projectId = 0;
  
  const user = await auth()

  if(!user.isAuthenticated) {
    return {
      status: 500,
      message: "You can't like this right now, and you seem bypass like :/"
    }
  }

  let returnValue: ReturnType = {
    status: 500,
    message: "Oops..something went wrong :/",
  }

  try {

    const resultGetId = await getUserIdAndProjectId(projectUid)
  
    if(resultGetId.status == 200 && resultGetId.data){
      projectId = resultGetId.data.project_id
      userId = resultGetId.data.user_id
    } else{
      throw new Error("failed fetching in: before like");
    }

    const resultRemove = await prisma.likes.deleteMany({
      where: {
        project_id: projectId,
        user_id: userId
      }
    })

    if(resultRemove.count != 1) {
      const resultAdd = await prisma.likes.create({
        data: {
          project_id: projectId,
          user_id: userId
        }
      })
      
      if(resultAdd.id){
        returnValue = {
          status: 200,
          message: "sucessful liked this project"
        }
      } else{
        throw new Error("Failed to like");
      }

    } else {
      returnValue = {
        status: 200,
        message: "sucessful unlike"
      }
    }

    // get newest bookmark count
    const resultUpdatedLike = await prisma.likes.findMany({
        where: {
          project_id: projectId
        }, 
        select: {
          id: true
        }
      })

    return {...returnValue, 
      data: {
        total_liked: resultUpdatedLike.length
      } 
    }
  } catch (error) {
    return tempErrorHandle(error)
  }
}


export async function getTotalAuthUserProjectLikes(): Promise<returnDataType<{project_total_likes: number}>> {

  const { userId } = await auth();
  let userDbId = 0;

  try{
    if(userId){
      const resultUserId = await getUserID(userId)
  
      if(resultUserId.status == 200 && resultUserId.data?.id){
        userDbId = resultUserId.data.id
      } else{
        throw new Error("User id not found. Please try again later!");
      }
    }

    const resultTotalLikes = await prisma.likes.findMany({
        where: {
          user_id: userDbId
        }, 
        select: {
          id: true
        }
    })

    return {
      status: 200, 
      message: "Successful retrieved total likes",
      data: {
        project_total_likes: resultTotalLikes.length
      } 
    }
  } catch (error) {
    return tempErrorHandle(error)
  }
}