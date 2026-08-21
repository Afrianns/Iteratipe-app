"use server"

import { auth } from "@clerk/nextjs/server"
import { getUserID } from "./user.service"
import { serverSideErrorHandle } from "@/lib/serverErrorHandle"
import { prisma } from "@/lib/db"
import { returnDataType } from "@/types/types"

export const followUser = async (userIdtoFollow: number): Promise<returnDataType<{
 id: number
 follower_id: number
 following_id: number
}>> => {

  const { userId } = await auth()

  let currentUserId = 0

  try {
    
    if(userId) {
      const resut = await getUserID(userId)

      if(resut.status == 200 && resut.data){
        currentUserId = resut.data.id
      }
    }

    if(currentUserId != 0){
      const result = await prisma.follows.create({
        data: {
          follower_id: userIdtoFollow,
          following_id: currentUserId
        }
      })

      if(result) {
        return {
          status: 200,
          message: "Successfuly",
          data: result
        }
      } else{
        throw new Error("Ooops..., something went wrong");
      }

    } else{
      throw new Error("Ooops..., current user not found");
    }

  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}
export const unfollowUser = async (userIdtoUnfollow: number): Promise<returnDataType<{
 id: number
 follower_id: number
 following_id: number
}>> => {

  const { userId } = await auth()

  let currentUserId = 0

  try {
    
    if(userId) {
      const resut = await getUserID(userId)

      if(resut.status == 200 && resut.data){
        currentUserId = resut.data.id
      }
    }

    if(currentUserId != 0){
      const result = await prisma.follows.delete({
        where: {
          follower_id_following_id: {
            follower_id: userIdtoUnfollow,
            following_id: currentUserId
          }
        }
      })

      if(result) {
        return {
          status: 200,
          message: "Successfuly unfollow",
          data: result
        }
      } else{
        throw new Error("Ooops..., something went wrong");
      }
    } else{
      throw new Error("User not found")
    }

  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}