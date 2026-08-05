"use server"

import { prisma } from "@/lib/db";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { returnDataType, UserPreviewType, UserType } from "@/types/types";


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
          clerk_user_id: true,
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