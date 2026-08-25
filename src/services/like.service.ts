"use server"

import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { prisma } from "@/lib/db";
import { getProjectIDbyUID } from "./projects.service";
import { getUserIdAndProjectId } from "./partial.service";

import Redis from "ioredis";

import storeAndNotify from "@/lib/notifications";

type ReturnType = returnDataType<{newTotalLiked: number}>

const URL = process.env.NEXT_PUBLIC_APP_URL

export async function likeProject(projectOwner: string, projectUid: string, projectTitle: string): Promise<ReturnType> {
  
  let userId = 0
  let projectId = 0
  let usernameWhoDoTheAction = ""

  const user = await auth()

  let type = "like"

  // const redis = new Redis()

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
      usernameWhoDoTheAction = resultGetId.data.username

    } else{
      throw new Error("failed fetching in: before like");
    }

    // this, it will be store in temporary redis then do cron (1 hours?maybe) to store to db and queue notification to targeted activities

    // for now store to db first

    // const deleteKey = await redis.del(`like:${projectId}:${userId}`)
    // let tempLikeCount = 0;

    // if(deleteKey <= 0) {
    //   const result = await redis.set(`like:${projectId}:${userId}`, "like")
    //   tempLikeCount = await redis.incr(`like:${projectId}:increment`)
      
    //   if(result){
    //     returnValue = {
    //       status: 200,
    //       message: result
    //     }
    //   }
    // } else{
    //   tempLikeCount = await redis.decr(`like:${projectId}:increment`)
    //   returnValue = {
    //     status: 200,
    //     message: "unliked"
    //   }
    // }
    // redis.get("like:", (err, result) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.log(result); // Prints "value"
    //     }
    // });

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

      type = "unlike"
    }


    if(type == "like"){
      const message = `<a href="${URL}/user/${usernameWhoDoTheAction}" rel="noopener noreferrer">${usernameWhoDoTheAction}</a> Liked your project <a href="${URL}/home/${projectTitle.split(" ").join("-").toLowerCase()}%E2%80%94${projectUid}" rel="noopener noreferrer">${projectTitle.toLowerCase()}</a>`

      storeAndNotify(message, userId, projectOwner)
      // const ownerId = await prisma.users.findFirst({where: {username: projectOwner}, select: {id: true, clerk_user_id: true}})
      
      // if(ownerId?.id){
      //   const newlyActivity = await prisma.activities.create({
      //     data: {
      //       messages: `<a href="${URL}/user/${usernameWhoDoTheAction}" rel="noopener noreferrer">${usernameWhoDoTheAction}</a> Liked your project <a href="${URL}/home/${projectTitle.split(" ").join("-").toLowerCase()}%E2%80%94${projectUid}" rel="noopener noreferrer">${projectTitle.toLowerCase()}</a>`,
      //       Object_user_id: ownerId.id,
      //       Subject_user_id: userId,
      //       seen: false
      //     },
      //     include: {
      //       Subject: {
      //         select: {
      //           image_url: true
      //         }
      //       }
      //     }
      //   })

      //   pusher.trigger("notification-channel", `notify-${ownerId.clerk_user_id}`, {         
      //     id: newlyActivity.id as number,
      //     user_id: newlyActivity.Subject_user_id as number,
      //     messages: newlyActivity.messages as string,
      //     created_at: newlyActivity.created_at as Date,
      //     user_image_url: newlyActivity.Subject.image_url as string
      //   });

      // }
    }


    const totalLikes = await prisma.likes.count({
      where: {
        project_id: projectId
      }
    })

    return {...returnValue, 
      data: {
        newTotalLiked: totalLikes
      } 
    }
  } catch (error) {
    return await serverSideErrorHandle(error)
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

    const resultTotalLikes = await prisma.projects.findMany({
        where: {
          user_id: userDbId
        }, 
        select: {
          _count: {
            select: {
              Likes: true
            }
          }
        }
    })

    return {
      status: 200, 
      message: "Successful retrieved total likes",
      data: {
        project_total_likes: combineTheLikes(resultTotalLikes)
      } 
    }
  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}


const combineTheLikes = (projectLikes: {_count:{Likes: number}}[]) => {
  let result = projectLikes.reduce((a,b) => ({_count: {Likes: a._count.Likes + b._count.Likes}}))
  return result._count.Likes
}