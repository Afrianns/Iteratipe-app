"use server"

import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { saveComment, setLikeComment } from "@/services/comments.service";
import { getProjectIDbyUID } from "@/services/projects.service";
import { CommentType, returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export const saveCommentForm = async (messages: string, projectOwner: string, projectUid: string, selectedValuePost: string, commentId?: number): Promise<returnDataType<CommentType>> => {

    // purify again the message, idk
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

        if(projectID == null) throw new Error("Can't find the project");

        if(messages){
            const result = await saveComment(projectID, projectOwner, messages, selectedValuePost, commentId)

            if(result.status == 200 && result.data){
                return {
                    status: 200,
                    message: "Sucessfully post",
                    data: result.data
                }
            } 
            throw new Error(result.message);
        } else{
            // temporary
            return {
                status: 404,
                message: "message not found"
            }
        }
    } catch (error) {
        return await serverSideErrorHandle(error)
    }
}


export const likeComment = async (commentId: number) => {

    const { isAuthenticated } = await auth()

    try {
        if(!isAuthenticated) throw new Error("Bypass is prohibited, signing first!");
        if(commentId){
            const result = await setLikeComment(commentId)
    
            if(result.status == 200 && result.data){
                console.log(result)
            } else{
                throw new Error(result.message);
            }
        } 
    } catch (error) {
        return await serverSideErrorHandle(error)
    }
    
}