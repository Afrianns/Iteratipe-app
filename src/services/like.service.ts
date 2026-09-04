"use server"

import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { prisma } from "@/lib/db";
import { getUserIdAndProjectId } from "./partial.service";

import storeAndNotify from "@/lib/notifications";
import { getProjectIDbyUID } from "./projects.service";
import { redis } from "@/lib/redis";

type ReturnType = returnDataType<{newTotalLiked: number}>

const URL = process.env.NEXT_PUBLIC_APP_URL

export async function likeProject(projectOwner: string, projectUid: string, projectTitle: string): Promise<ReturnType> {
  
  let userId = 0
  let projectId = 0
  let usernameWhoDoTheAction = ""
  let type = "like"

  const user = await auth()

  if(!user || !user.isAuthenticated) {
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

    // get if already liked
    const liked = await prisma.likes.findFirst({
      where: {
        project_id: projectId,
        user_id: userId
      },
      select: {
        id: true
      }
    })
    
    let tempLikeCount = 0

    console.log(liked?.id, "liked?.id")

    if(liked?.id) {
      const redisValue = await redis.get(`like:${projectId}:${userId}`)

      const value = redisValue ? JSON.parse(redisValue) : null

      if(value && value.type === "unlike") {
        await redis.del(`like:${projectId}:${userId}`)
        tempLikeCount = await redis.incr(`like:${projectId}:increment`)
        type = "unlike"
      } else {
        await redis.set(`like:${projectId}:${userId}`, JSON.stringify({type: "unlike", timestamp: new Date().getTime()}))
        tempLikeCount = await redis.decr(`like:${projectId}:increment`)
      }

    } else{

      const redisValue = await redis.get(`like:${projectId}:${userId}`)
      console.log("redisValue", redisValue)

      const value = redisValue ? JSON.parse(redisValue) : null

      if(value && value.type === "like") {
        await redis.del(`like:${projectId}:${userId}`)
        tempLikeCount = await redis.decr(`like:${projectId}:increment`)
        type = "unlike"
      } else {
        await redis.set(`like:${projectId}:${userId}`, JSON.stringify({type: "like", timestamp: new Date().getTime()}))
        tempLikeCount = await redis.incr(`like:${projectId}:increment`)
      }
      
    }
    
    returnValue = {
      status: 200,
      message: type
    }
    // const deleteKey = await redis.del(`like:${projectId}:${userId}`)

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

    // const resultRemove = await prisma.likes.deleteMany({
    //   where: {
    //     project_id: projectId,
    //     user_id: userId
    //   }
    // })

    // if(resultRemove.count != 1) {
    //   const resultAdd = await prisma.likes.create({
    //     data: {
    //       project_id: projectId,
    //       user_id: userId
    //     }
    //   })
      
    //   if(resultAdd.id){
    //     returnValue = {
    //       status: 200,
    //       message: "sucessful liked this project"
    //     }
    //   } else{
    //     throw new Error("Failed to like");
    //   }

    // } else {
    //   returnValue = {
    //     status: 200,
    //     message: "sucessful unlike"
    //   }

    //   type = "unlike"
    // }

    // if(type == "like"){
    //   const message = `<a href="${URL}/user/${usernameWhoDoTheAction}" rel="noopener noreferrer">${usernameWhoDoTheAction}</a> Liked your project <a href="${URL}/home/${projectTitle.split(" ").join("-").toLowerCase()}%E2%80%94${projectUid}" rel="noopener noreferrer">${projectTitle.toLowerCase()}</a>`
    //   storeAndNotify(message, userId, projectOwner)
    // }

    const totalLikes = await prisma.likes.count({
      where: {
        project_id: projectId
      }
    })

    return {...returnValue, 
      data: {
        newTotalLiked: totalLikes + tempLikeCount
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

    console.log("hasdjas", resultTotalLikes)

    return {
      status: 200, 
      message: "Successful retrieved total likes",
      data: {
        project_total_likes: resultTotalLikes.length >= 1 ? combineTheLikes(resultTotalLikes) : 0
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


// export async function getLikedWithTempLikedByProjectUid(projectUid: string): Promise<returnDataType<{
//   totalLikes: number,
//   likedByAuthUser: "like"|"unlike"|null
// }>> {

//   // console.log("[action] fired", new Date().toISOString());
//   const user = await auth();
//   // console.log("[action] auth() resolved", new Date().toISOString(), user.isAuthenticated);

//   // // const user = await auth()
//   // if (user.sessionClaims) {
//   //   console.log("[action] exp:", user.sessionClaims.exp, "iat:", user.sessionClaims.iat, "now:", Math.floor(Date.now() / 1000));
//   // }
//   const redis = new Redis()

//   try {

//     if(!user.isAuthenticated) {
//       return {
//         status: 500,
//         message: "User not found"
//       }
//     }

//     const userId = await getUserID(user.userId)

//     const projectId = await getProjectIDbyUID(projectUid)

//     if(projectId.status != 200 || !projectId.data?.id){
//       throw new Error("Failed to get project id")
//     }

//     const result = await prisma.likes.findMany({
//       select: {
//         project_id: true,
//         user_id: true
//       },
//       where: {
//         project_id: projectId.data.id
//       }
//     })

//     // console.log("inii", userId)

//     const tempLikeCount = await redis.get(`like:${projectId.data.id}:increment`);

//     const stringifiedTempLikedByAuthUser = await redis.get(`like:${projectId.data.id}:${userId.data?.id}`)

//     const tempLikedByAuthUser = stringifiedTempLikedByAuthUser ? JSON.parse(stringifiedTempLikedByAuthUser) : null
//     return {
//       status: 200,
//       message: "Successful retrieved total likes",
//       data: {
//         totalLikes: result.length + (tempLikeCount ? parseInt(tempLikeCount) : 0),
//         likedByAuthUser: tempLikedByAuthUser?.type as "like"|"unlike"|null
//       }
//     };

//   } catch(err) {
//     return await serverSideErrorHandle(err)
//   }
// }

// first refresh
// [action] fired 2026-09-01T10:05:44.725Z
// [action] auth() resolved 2026-09-01T10:05:44.735Z true

// [action] fired 2026-09-01T10:05:45.128Z
// [action] auth() resolved 2026-09-01T10:05:45.147Z true

// [action] fired 2026-09-01T10:05:45.320Z
// [action] auth() resolved 2026-09-01T10:05:45.328Z true


// refresh second
// [action] fired 2026-09-01T10:07:19.443Z
// [action] auth() resolved 2026-09-01T10:07:19.465Z false

// [action] fired 2026-09-01T10:07:19.657Z
// [action] auth() resolved 2026-09-01T10:07:19.671Z false

// [action] fired 2026-09-01T10:07:19.845Z
// [action] auth() resolved 2026-09-01T10:07:19.855Z false