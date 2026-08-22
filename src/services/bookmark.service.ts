"use server"

import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { ProjectPreviewType, returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { prisma } from "@/lib/db";
import { getUserIdAndProjectId } from "./partial.service";
import { previewCardDataQuery } from "@/lib/prismaQuery";

type ReturnType = returnDataType<{newBookmarked: number}>

const URL = process.env.NEXT_PUBLIC_APP_URL

export async function bookmarkProject(projectOwner: string, projectUid: string, projectTitle: string): Promise<ReturnType> {
   
  let userId = 0;
  let projectId = 0;
  let usernameWhoDoTheAction = ""

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
  // let tempLikeCount = 0;

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

    // start
    const resultRemove = await prisma.bookmarks.deleteMany({
      where: {
        project_id: projectId,
        user_id: userId
      }
    })

    if(resultRemove.count != 1) {
      const resultAdd = await prisma.bookmarks.create({
        data: {
          project_id: projectId,
          user_id: userId
        }
      })
      
      if(resultAdd.id){
        returnValue = {
          status: 200,
          message: "sucessful bookmark this project"
        }

        newBookmarked = 1
        
      } else{
        throw new Error("Failed to add bookmark");
      }

    } else {
      returnValue = {
        status: 200,
        message: "sucessful remove bookmark"
      }

      newBookmarked = -1
    }

    // update the the activity to relate user

    if(newBookmarked == 1){

      const ownerId = await prisma.users.findFirst({where:{username:projectOwner},select:{id:true}})

      if(ownerId?.id){
        await prisma.activities.create({
              data: {
                messages: `<a href="${URL}/user/${usernameWhoDoTheAction}" rel="noopener noreferrer">${usernameWhoDoTheAction}</a> bookmarked your project <a href="${URL}/home/${projectTitle.split(" ").join("-").toLowerCase()}%E2%80%94${projectUid}" rel="noopener noreferrer">${projectTitle.toLowerCase()}</a>`,
                user_id: ownerId.id
              }
          })
      }
    }
    // end, it will change

    return {...returnValue, 
      data: {
        newBookmarked: newBookmarked
      } 
    }
  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}


export async function getBookmarkedProject(): Promise<returnDataType<ProjectPreviewType[]>> {
  const { userId } = await auth()
  let userDbId: number = 0;

  try {
      if(userId){
        const resultUserId = await getUserID(userId)
    
        if(resultUserId.status == 200 && resultUserId.data?.id){
          userDbId = resultUserId.data.id
        } else{
          throw new Error("User id not found. Please try again later!");
        }
      }

      const result = await prisma.bookmarks.findMany({
          where: {
            user_id: userDbId
          },
          select: {
            Projects: {
              ...previewCardDataQuery(userDbId)
            }
          }
      })

      if(result) {
        return {
          status: 200,
          message: "Sucessfully retrieved",
          data: mappingBookmarkedProjects(result)
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

