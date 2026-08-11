"use server"

import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { ProjectPreviewType, returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { prisma } from "@/lib/db";
import { getUserIdAndProjectId } from "./partial.service";

type ReturnType = returnDataType<{total_bookmarked: number}>

export async function bookmarkProject(projectUid: string): Promise<ReturnType> {
  
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
      throw new Error("failed fetching in: before bookmark");
    }

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
      } else{
        throw new Error("Failed to add bookmark");
      }

    } else {
      returnValue = {
        status: 200,
        message: "sucessful remove bookmark"
      }
    }

    // get newest bookmark count
    const resultUpdatedBookmark = await prisma.bookmarks.findMany({
        where: {
          project_id: projectId
        }, 
        select: {
          id: true
        }
      })

    return {...returnValue, 
      data: {
        total_bookmarked: resultUpdatedBookmark.length
      } 
    }
  } catch (error) {
    return tempErrorHandle(error)
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
              select: {
                  uid: true,
                  title: true,
                  Status: true,
                  Type: true,
                  created_at: true,
                  _count: {
                      select: {
                          Nodes: true,
                          Bookmarks: true,
                          Likes: true,
                      }
                  },
                  Users: {
                      select: {
                          full_name: true,
                          username: true,
                      }
                  },
                  Bookmarks: {
                      where: {
                          user_id: userDbId
                      },

                      take: 1,
                      select: {
                          project_id: true,
                      }
                  },
                  Likes: {
                      where: {
                          user_id: userDbId
                      },

                      take: 1,
                      select: {
                          project_id: true,
                      }
                  },
                  visibility: true
              }
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
        return tempErrorHandle(error)
    }
}


const mappingBookmarkedProjects = (bookmarkedProjects: {Projects: ProjectPreviewType | null}[]): ProjectPreviewType[] => {
  return bookmarkedProjects.flatMap((bookmarkedProject) => (bookmarkedProject.Projects != null) ? bookmarkedProject.Projects : [])
}

