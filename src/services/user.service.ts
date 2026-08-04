"use server"

import { prisma } from "@/lib/db";
import { returnDataType, UserPreviewType, UserType } from "@/types/types";


export const getUser = async (userId: number): Promise<returnDataType<UserType | null>> => {
  try {
    let user = await prisma.users.findFirst({
        where: {
          id: userId
        }
    });

    return {
      status: 200,
      message: "Successfully",
      data: user
    }    
  } catch (error) {
    return {
      status: 500,
      message: "Successfully"
    }
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
          clerk_user_id: true,
        }
    })

    return {
      status: 200,
      message: "Successfully",
      data: previewUser
    }    
  } catch (error) {
    return {
      status: 500,
      message: "Successfully"
    }
  } 
}