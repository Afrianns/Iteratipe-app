"use server"

import { prisma } from "@/lib/db";
import { previewCardDataQuery } from "@/lib/prismaQuery";
import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { ActivityType, labelType, ProjectPreviewType, returnDataType, UserDataType, UserPreviewType, UserType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";


interface actionDataType {
    clerk_user_id: string
}

export default async function syncUser(params: UserDataType): Promise<returnDataType<actionDataType>> {
    let resultAction: returnDataType<actionDataType>

    try {
        const dbActionResult = await prisma.users.upsert({
            where: { clerk_user_id: params.id },
            update: { 
                first_name: params.first_name,
                last_name: params.last_name,
                full_name: params.full_name,
                username: params.username,
                description: params.description,
                facebook_link: params.facebook_link,
                twitter_link: params.twitter_link,
                website_link: params.website_link,
                completed_onboarding: true,
                image_url: params.image_url
            },
            create: { 
                clerk_user_id: params.id,
                first_name: params.first_name,
                last_name: params.last_name,
                full_name: params.full_name,
                username: params.username,
                description: params.description,
                facebook_link: params.facebook_link,
                twitter_link: params.twitter_link,
                website_link: params.website_link,
                email: params.email,
                completed_onboarding: true,
                image_url: params.image_url
            },
            select: {
                id: true,
                clerk_user_id: true
            }
        })

        resultAction = {
            status: 200,
            message: "Successfully",
            data: {
                clerk_user_id: dbActionResult.clerk_user_id
            }
        }

    } catch (er) {
        resultAction = {
            status: 500,
            message: "Failed"
        }
        
    }

    return resultAction
}

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
      seen: boolean
      user_image_url: string
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
          Object: {
            include: {
              Subject: {
                select: {
                  image_url: true
                }
              }
            }              
          },
          _count: {
            select: {
              Followers: true,
              Followings: true
            }
          }
        }
    });

    console.log("user is ",user)

    if(user) { 
      return {
        status: 200,
        message: "Successfully",
        data: {...user, Activities: user?.Object ? mapActivities(user.Object) : []}
      }    
    } else{
      throw new Error("Ops... Something went wrong");
      
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


const mapActivities = (activities: {
      id: number
      Subject_user_id: number
      Object_user_id: number
      messages: string
      seen: boolean
      created_at: Date
      Subject: {
        image_url: string
      }
  }[]): ActivityType[] =>  {
    const newActivities = activities.map((activity) => {
      return {
        user_image_url: activity.Subject.image_url,
        id: activity.id,
        user_id: activity.Subject_user_id,
        messages: activity.messages,
        seen: activity.seen,
        created_at: activity.created_at
      }
    })

    return newActivities
  
}