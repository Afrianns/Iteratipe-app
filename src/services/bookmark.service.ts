"use server"

import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { ProjectPreviewType, returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { prisma } from "@/lib/db";
import { getUserIdAndProjectId } from "./partial.service";
import { previewCardDataQuery } from "@/lib/prismaQuery";
import { pusher } from "@/lib/pusher";
import StoreAndNotify from "@/lib/notifications";
import storeAndNotify from "@/lib/notifications";
import Redis from "ioredis";
import { getProjectIDbyUID } from "./projects.service";

type ReturnType = returnDataType<{newTotalBookmarked: number}>

const URL = process.env.NEXT_PUBLIC_APP_URL

export async function bookmarkProject(projectOwner: string, projectUid: string, projectTitle: string): Promise<ReturnType> {
   
  let userId = 0;
  let projectId = 0;
  let usernameWhoDoTheAction = ""
  let type = "bookmarked"

  const redis = new Redis()

  let newBookmarked = 0

  const user = await auth()

  if(!user.isAuthenticated) {
    return {
      status: 500,
      message: "You can't bookmark this right now, and you seem bypass bookmark :/"
    }
  }

  let returnValue: ReturnType = {
    status: 500,
    message: "Oops..something went wrong :/",
  }

  // this, it will be store in temporary redis then do cron (1 hours?maybe) to store to db and queue notification to targeted activities

  // for now store to db first


  // const deleteKey = await redis.del(`bookmark:${projectId}:${userId}`)
  // let tempBookmarkedCount = 0;

  // if(deleteKey <= 0) {
  //   const result = await redis.set(`bookmark:${projectId}:${userId}`, "bookmark")
  //   tempBookmarkCount = await redis.incr(`bookmark:${projectId}:increment`)
    
  //   if(result){
  //     returnValue = {
  //       status: 200,
  //       message: result
  //     }
  //   }
  // } else{
  //   tempBookmarkCount = await redis.decr(`bookmark:${projectId}:increment`)
  //   returnValue = {
  //     status: 200,
  //     message: "removed bookmark"
  //   }
  // }
  // redis.get("bookmark:", (err, result) => {
  //     if (err) {
  //         console.error(err);
  //     } else {
  //         console.log(result); // Prints "value"
  //     }
  // });

  try {
    const resultGetId = await getUserIdAndProjectId(projectUid)
  
    if(resultGetId.status == 200 && resultGetId.data){
      projectId = resultGetId.data.project_id
      userId = resultGetId.data.user_id
      usernameWhoDoTheAction = resultGetId.data.username
    } else{
      throw new Error("failed fetching in: before bookmark");
    }

    const bookmarked = await prisma.bookmarks.findFirst({
      where: {
        project_id: projectId,
        user_id: userId
      },
      select: {
        id: true
      }
    })
    
    let tempBookmarkedCount = 0

    console.log(bookmarked?.id, "bookmarked?.id")

    if(bookmarked?.id) {
      const redisValue = await redis.get(`bookmark:${projectId}:${userId}`)

      const value = redisValue ? JSON.parse(redisValue) : null

      if(value && value.type === "unbookmark") {
        await redis.del(`bookmark:${projectId}:${userId}`)
        tempBookmarkedCount = await redis.incr(`bookmark:${projectId}:increment`)
        type = "unbookmark"
      } else {
        await redis.set(`bookmark:${projectId}:${userId}`, JSON.stringify({type: "unbookmark", timestamp: new Date().getTime()}))
        tempBookmarkedCount = await redis.decr(`bookmark:${projectId}:increment`)
      }

    } else{
      const redisValue = await redis.get(`bookmark:${projectId}:${userId}`)
      
      const value = redisValue ? JSON.parse(redisValue) : null

      if(value && value.type === "bookmark") {
        await redis.del(`bookmark:${projectId}:${userId}`)
        tempBookmarkedCount = await redis.decr(`bookmark:${projectId}:increment`)
        type = "unbookmark"
      } else {
        await redis.set(`bookmark:${projectId}:${userId}`, JSON.stringify({type: "bookmark", timestamp: new Date().getTime()}))
        tempBookmarkedCount = await redis.incr(`bookmark:${projectId}:increment`)
      }
      
    }
    
    returnValue = {
      status: 200,
      message: type
    }
    // // start
    // const resultRemove = await prisma.bookmarks.deleteMany({
    //   where: {
    //     project_id: projectId,
    //     user_id: userId
    //   }
    // })

    // if(resultRemove.count != 1) {
    //   const resultAdd = await prisma.bookmarks.create({
    //     data: {
    //       project_id: projectId,
    //       user_id: userId
    //     }
    //   })
      
    //   if(resultAdd.id){
    //     returnValue = {
    //       status: 200,
    //       message: "sucessful bookmark this project"
    //     }

    //     newBookmarked = 1
        
    //   } else{
    //     throw new Error("Failed to add bookmark");
    //   }

    // } else {
    //   returnValue = {
    //     status: 200,
    //     message: "sucessful remove bookmark"
    //   }

    //   newBookmarked = -1
    // }

    // // update the the activity to relate user

    // if(newBookmarked == 1){
    //   const message = `<a href="${URL}/user/${usernameWhoDoTheAction}" rel="noopener noreferrer">${usernameWhoDoTheAction}</a> bookmarked your project <a href="${URL}/home/${projectTitle.split(" ").join("-").toLowerCase()}%E2%80%94${projectUid}" rel="noopener noreferrer">${projectTitle.toLowerCase()}</a>`

    //   storeAndNotify(message, userId, projectOwner)
      // const ownerId = await prisma.users.findFirst({where: {username: projectOwner}, select: {id: true, clerk_user_id: true}})

      
      // if(ownerId?.id){

      //   const newlyActivity = await prisma.activities.create({
      //     data: {
      //       messages: `<a href="${URL}/user/${usernameWhoDoTheAction}" rel="noopener noreferrer">${usernameWhoDoTheAction}</a> bookmarked your project <a href="${URL}/home/${projectTitle.split(" ").join("-").toLowerCase()}%E2%80%94${projectUid}" rel="noopener noreferrer">${projectTitle.toLowerCase()}</a>`,
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
    // }
    // end, it will change

    const totalBookmarked = await prisma.bookmarks.count({
      where: {
        project_id: projectId
      }
    })

    return {...returnValue, 
      data: {
        newTotalBookmarked: totalBookmarked + tempBookmarkedCount
      } 
    }
  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}


export async function getBookmarkedProject(): Promise<returnDataType<ProjectPreviewType[]>> {
  const { userId } = await auth()
  let userDbId: number = 0;
  const redis = new Redis()

  try {
      if(userId){
        const resultUserId = await getUserID(userId)
    
        if(resultUserId.status == 200 && resultUserId.data?.id){
          userDbId = resultUserId.data.id
        } else{
          throw new Error("User id not found. Please try again later!");
        }
      }


      // get a temporary redis bookmark id
      const keys = await redis.keys(`bookmark:*:${userDbId}`)
      let undoValue: number[] = []
      let doValue: number[] = []

      for(let key of keys) {
        const result = await redis.get(key)
        const val = result ? JSON.parse(result) : null

        if(val.type == "bookmark") {
          doValue.push(Number(key.split(":")[1]))
        } else{
          undoValue.push(Number(key.split(":")[1]))
        }
      }

      // also filtering redis id that maybe unbookmark
      const result = await prisma.bookmarks.findMany({
          where: {
            user_id: userDbId,
            project_id: {
              notIn: undoValue
            }
          },
          select: {
            Projects: {
              ...previewCardDataQuery(userDbId)
            }
          }
      })

      // find the right project that has those temp redis id
      const resultTemp = await prisma.projects.findMany({
        where: {
          id: {
            in: doValue
          }
        },
        ...previewCardDataQuery(userDbId)
      })

      if(result) {
        return {
          status: 200,
          message: "Sucessfully retrieved",
          data: [...mappingBookmarkedProjects(result), ...mappingBookmarkedProjects(resultTemp.map((temp) => ({Projects: temp})))]
      }
      } else {
        throw new Error("Error getting bookmarked project")
      }

    } catch (error) {
        return await serverSideErrorHandle(error)
    }
}


const mappingBookmarkedProjects = (bookmarkedProjects: {Projects: ProjectPreviewType | null}[]): ProjectPreviewType[] => {
  return bookmarkedProjects.flatMap((bookmarkedProject) => (bookmarkedProject.Projects != null) ? bookmarkedProject.Projects : [])
}


// export async function getBookmarkedWithTempBookmarkedByProjectUid(projectUid: string): Promise<returnDataType<{
//   totalLikes: number,
//   bookmarkedByAuthUser: "bookmark"|"unbookmark"|null
// }>> {
//   const user = await auth();
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

//     const result = await prisma.bookmarks.findMany({
//       select: {
//         project_id: true,
//         user_id: true
//       },
//       where: {
//         project_id: projectId.data.id
//       }
//     })

//     // console.log("inii", userId)

//     const tempBookmarkCount = await redis.get(`bookmark:${projectId.data.id}:increment`);

//     const stringifiedTempBookmarkedByAuthUser = await redis.get(`bookmark:${projectId.data.id}:${userId.data?.id}`)

//     const tempBookmarkedByAuthUser = stringifiedTempBookmarkedByAuthUser ? JSON.parse(stringifiedTempBookmarkedByAuthUser) : null
//     return {
//       status: 200,
//       message: "Successful retrieved total bookmarks",
//       data: {
//         totalLikes: result.length + (tempBookmarkCount ? parseInt(tempBookmarkCount) : 0),
//         bookmarkedByAuthUser: tempBookmarkedByAuthUser?.type as "bookmark"|"unbookmark"|null
//       }
//     };

//   } catch(err) {
//     return await serverSideErrorHandle(err)
//   }
// }