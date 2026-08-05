"use server"

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { getNodeIdByUid } from "./nodes.service";
import { tempErrorHandle } from "@/lib/tempErrorHandle";

type DBEdgeType = {
    uid: string,
    source: string,
    target: string
}

export async function saveComment(projectID: number, comments: string, nodeUID?: string, commentID?: number): Promise<returnDataType<{
  id: number;
  message: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
  user_id: number;
  project_id: number;
  node_id: number | null;
  commentC_id: number | null;
}>> {
  
  const { userId } = await auth()

  let nodeResultID = null;

  try {
    let userID = 0;

    if(nodeUID && nodeUID !== "NOT_AN_ID"){
      const resultID = await getNodeIdByUid(nodeUID)

      if(resultID.status == 200 && resultID.data?.id) {
        nodeResultID = resultID.data.id
      } else{
        throw new Error("Node id not found");
      }
    }

    if(userId){
      const resultID = await getUserID(userId)

      if(resultID.status == 200 && resultID.data?.id){
        userID = resultID.data.id
      } else{
        throw new Error("User id not found. Please try again later!");
      }
    }

    console.log(nodeUID, nodeResultID)
    
    const result = await prisma.comments.create({
      data: {
        user_id: userID,
        message: comments,
        project_id: projectID,
        commentC_id: commentID ?? Prisma.skip,
        node_id: nodeResultID ?? Prisma.skip
      }
    });

    if(result){
        return {
            status: 200,
            message: "Success retrieved data",
            data: result
        };
    } else{
        throw new Error("error saving comments")
    }
      
  } catch (error) {
    return tempErrorHandle(error)
  }
}


export async function getCommentsByProjectId(projectId: number): Promise<returnDataType<{
    id: number
    message: string
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
    user_id: number
    project_id: number
    node_id: number | null
    commentC_id: number | null
    Users: {
      id: number
      clerk_user_id: string
      first_name: string
      last_name: string
      full_name: string
      email: string
      image_url: string
    }
    Replies?: {
      id: number;
      user_id: number;
      project_id: number;
      node_id: number | null;
      commentC_id: number | null;
      message: string;
      created_at: Date;
      updated_at: Date | null;
      deleted_at: Date | null;
      Users: {
        id: number
        clerk_user_id: string
        first_name: string
        last_name: string
        full_name: string
        email: string
        image_url: string
      }
    }[]
}[]>> {
  
  try {
    const result = await prisma.comments.findMany({
      where: {
        project_id: projectId
      },
      include: {
        Users: {
          select: {
            id: true,
            clerk_user_id: true,
            first_name: true,
            last_name: true,
            full_name: true,
            email: true,
            image_url: true
          }
        },
        Replies: {
          include: {
            Users: {
              select: {
                id: true,
                clerk_user_id: true,
                first_name: true,
                last_name: true,
                full_name: true,
                email: true,
                image_url: true
              }
            }
          }
        }
      }
    })

    console.log(result, projectId)
    if(result){
      return {
        status: 200,
        message: "Sucessfull get comments",
        data: result
      }
    } else{
      throw new Error("No comments found");
    }
  } catch (error) {
    return tempErrorHandle(error)
  }
}