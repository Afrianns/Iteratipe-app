"use server"

import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { saveComment } from "@/services/comments.service";

export const saveCommentForm = async (data: FormData, projectId: number, selectedValuePost: string, commentId?: number) => {

    const messages = data.get("comment") as string;

    try {
        if(messages){
            const result = await saveComment(projectId, messages, selectedValuePost, commentId)

            if(result.status == 200 && result.data){
                console.log(result)
            } else{
                throw new Error(result.message);
            }
            
        } 
    } catch (error) {
        tempErrorHandle(error)
    }
}