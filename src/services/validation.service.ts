"use server"

import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { returnDataType } from "@/types/types"
import { serverSideErrorHandle } from "@/lib/serverErrorHandle"

export async function isCompletedOnboarding(): Promise<returnDataType<{
  already_onboarding: boolean
}>> {

  const { userId } = await auth()
  
  try {
    
    if(userId) {
      const result = await prisma.users.findFirst({
        where: {
          clerk_user_id: userId
        },
        select: {
          completed_onboarding: true
        }
      })
  
      return {
        status: 200,
        message: "success",
        data: {
          already_onboarding: result?.completed_onboarding || false
        }
      }
    } 
    throw new Error("Something went wrong");
  } catch (error) {
    return serverSideErrorHandle(error)
  }
}

export async function isUserValidToUpdate(projectUid: string): Promise<returnDataType<{
  is_allowed: boolean
}>> {
  const { userId } = await auth()
  
  try {
    
    if(userId) {
      const result = await prisma.projects.findFirst({
        where: {
          uid: projectUid,
          clerk_user_id: userId
        },
        select: {
          id: true
        }
      })
  
      return {
        status: 200,
        message: "success",
        data: {
          is_allowed: result?.id != null
        }
      }
    } 
    throw new Error("Something went wrong");
  } catch (error) {
    return serverSideErrorHandle(error)
  }
}