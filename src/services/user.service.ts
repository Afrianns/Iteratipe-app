"use server"

import { prisma } from "@/lib/db";
import { previewCardDataQuery } from "@/lib/prismaQuery";
import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { labelType, ProjectPreviewType, returnDataType, UserPreviewType, UserType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";


export const getUserID = async (userId: string): Promise<returnDataType<{
  id: number
  username: string
}>> => {
  try {
    const user = await prisma.users.findUnique({
        where: {
            clerk_user_id: userId as string
        },
        select: { id: true, username: true },
    });

    if(!user?.id) throw new Error("user not found");

    if(user.id){
      return {
        status: 200,
        message: "successful",
        data: {
          id: user.id,
          username: user.username
        }
      }
    } else{
      throw new Error("ID not found. try again later");
    }
        
  } catch (error) {
      return await serverSideErrorHandle(error)
  }
}

interface userDataWithFollow extends UserType {
  _count: {Followers: number, Followings: number}
  Activities: {
      id: number
      user_id: number
      messages: string
      created_at: Date
  }[]
} 

export const getUser = async (clerkUserId: string): Promise<returnDataType<userDataWithFollow | null>> => {
  try {
    let user = await prisma.users.findFirst({
        where: {
          clerk_user_id: clerkUserId
        },
        include: {
          Activities: true,
          _count: {
            select: {
              Followers: true,
              Followings: true
            }
          }
        }
    });

    return {
      status: 200,
      message: "Successfully",
      data: user
    }    
  } catch (error) {
      return await serverSideErrorHandle(error)
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
          _count: {
            select: {
              Followers: true,
              Followings: true
            }
          }
        }
    })

    return {
      status: 200,
      message: "Successfully",
      data: previewUser
    }    
  } catch (error) {
    return await serverSideErrorHandle(error)
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
          _count: {
            select: {
              Followers: true,
              Followings: true,
            }
          },
          Followers: {
            where: {
              following_id: userDbId
            }, 
            select: {
              id: true
            }
          },
          Projects: {
            ...previewCardDataQuery(userDbId)
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
      return await serverSideErrorHandle(error)
  }
}