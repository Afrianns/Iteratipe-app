"use server"

import { prisma } from "@/lib/db";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { labelType, ProjectPreviewType, returnDataType, UserPreviewType, UserType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";


export const getUserID = async (userId: string): Promise<returnDataType<{
  id: number
}>> => {
  try {
    const user = await prisma.users.findUnique({
        where: {
            clerk_user_id: userId as string
        },
        select: { id: true },
    });

    if(!user?.id) throw new Error("user not found");

    if(user.id){
      return {
        status: 200,
        message: "successful",
        data: {
          id: user.id
        }
      }
    } else{
      throw new Error("ID not found. try again later");
    }
        
  } catch (error) {
      return tempErrorHandle(error)
  }
}

export const getUser = async (clerkUserId: string): Promise<returnDataType<UserType | null>> => {
  try {
    let user = await prisma.users.findFirst({
        where: {
          clerk_user_id: clerkUserId
        }
    });

    return {
      status: 200,
      message: "Successfully",
      data: user
    }    
  } catch (error) {
      return tempErrorHandle(error)
  } 
}

export const getPreviewUser = async (userId: number): Promise<returnDataType<UserPreviewType | null>> => {
  try {
    let previewUser = await prisma.users.findFirst({
        where: {
          id: userId
        }, 
        select: {
          id: true,
          image_url: true,
          description: true,
          first_name: true,
          last_name: true,
          username: true,
        }
    })

    return {
      status: 200,
      message: "Successfully",
      data: previewUser
    }    
  } catch (error) {
    return tempErrorHandle(error)
  } 
}

interface ProjectPreviewTypeWUser extends UserType {
  Projects: ProjectPreviewType[]
}

export const getUserByUsername = async (username: string): Promise<returnDataType<ProjectPreviewTypeWUser>> => {
  
  const { userId } = await auth()
  let userDbId = 0
  
  try {
    
    if(userId){
      const resultID = await getUserID(userId)
  
      if(resultID.status == 200 && resultID.data?.id){
        userDbId = resultID.data.id
      } else{
        throw new Error("User id not found. Please try again later!");
      }
    }

    const user = await prisma.users.findUnique({
        where: {
            username: username as string
        },

        include: {
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
              }
            }
          }
        }
    });

    if(user && user?.id){
      return {
        status: 200,
        message: "successful",
        data: user
      }
    } else{
      throw new Error("username not found. try again later");
    }
  } catch (error) {
      return tempErrorHandle(error)
  }
}