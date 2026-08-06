"use server"

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { CommentType, CommentWithReplies, returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { getUserID } from "./user.service";
import { getNodeIdByUid } from "./nodes.service";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { getProjectIDbyUID } from "./projects.service";

type DBEdgeType = {
    uid: string,
    source: string,
    target: string
}

export async function saveComment(projectID: number, comments: string, nodeUID?: string, commentID?: number): Promise<returnDataType<CommentType>> {
  
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
          },
        },
        Comment_likes: {
          where: {
            user_id: userID
          }
        },
        Nodes: {
          select: {
            uid: true,
            title: true
          }
        }
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


export async function getCommentsByProjectId(projectUid: string, nodeUID?: string): Promise<returnDataType<CommentType[]>> {
  []
  const { userId } = await auth()
  let userID = 0
  let nodeID = null
  let projectID = null

  try {

    if(projectUid) {
      const resultProjectID = await getProjectIDbyUID(projectUid);
      if(resultProjectID.status == 200 && resultProjectID.data?.id){
        projectID = resultProjectID.data.id
      } else{
        throw new Error("Selected Node not found");
      }
    }

    if(nodeUID && nodeUID !== "NOT_AN_ID"){
      const resultNodeID = await getNodeIdByUid(nodeUID) 

      if(resultNodeID.status == 200 && resultNodeID.data?.id){
        nodeID = resultNodeID.data.id
      } else{
        throw new Error("Selected Node not found");
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

    if(projectID == null) throw new Error("Can't find the project");


    const result = await prisma.comments.findMany({
      where: {
        project_id: projectID,
        node_id: nodeID ?? Prisma.skip
      },
      include: {
        Comment_likes: {
          where: {
            user_id: userID
          }
        },
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
        Nodes: {
          select: {
            uid: true,
            title: true
          }
        }
      }
    })

    console.log(result, projectID)
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



export async function setLikeComment(commentId: number): Promise<returnDataType<{
  created_at: Date;
  id: number;
  user_id: number;
  comment_id: number;
} | { count: number }>> {
  const { userId } = await auth()
  let userID = 0;

  try {
      if(userId){
        const resultID = await getUserID(userId)

        if(resultID.status == 200 && resultID.data?.id){
          userID = resultID.data.id
        } else{
          throw new Error("User id not found. Please try again later!");
        }
      }

      const resultRemove = await prisma.user_like_comments.deleteMany({
        where: {
          // user_id_comment_id: {
          comment_id: commentId,
          user_id: userID
          // }
        }
      })

      if(resultRemove.count != 1) {
        const resultAdd = await prisma.user_like_comments.create({
          data: {
            comment_id: commentId,
            user_id: userID
          }
        })
        
        if(resultAdd.id){
          return {
            status: 200,
            message: "sucessful liked this post",
            data: resultAdd
          }
        } else{
          throw new Error("Cannot like this post");
        }

      } else {
        return {
          status: 200,
          message: "sucessful liked this post",
          data: resultRemove
        }
      }
  } catch (error) {
    return tempErrorHandle(error)
  }
}


export async function getRepliesComments(commentId: number): Promise<returnDataType<CommentType[]>> {
  const { userId } = await auth()
  let userID = 0
  
  try {

    if(userId){
      const resultID = await getUserID(userId)

      if(resultID.status == 200 && resultID.data?.id){
        userID = resultID.data.id
      } else{
        throw new Error("User id not found. Please try again later!");
      }
    }

    const result = await prisma.comments.findMany({
      where: {
        commentC_id: commentId
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
          },
        },
        Comment_likes: {
          where: {
            user_id: userID
          }
        },
        Nodes: {
          select: {
            uid: true,
            title: true
          }
        }
      }
    })

    if(result.length > 0){
      return {
        status: 200,
        message: "sucessful retrieved",
        data: result
      }
    } else{
      throw new Error("No replies found");
    }
  } catch (error) {
    return tempErrorHandle(error)
  }
}
