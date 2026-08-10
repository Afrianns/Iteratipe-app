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

