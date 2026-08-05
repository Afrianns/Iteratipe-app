import { getCommentsByProjectId } from "@/services/comments.service";
import { formatDistanceStrict } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import Comment from "./Comment";



export default function CommentsList({projectId, ownerProjectId}: {projectId: number, ownerProjectId: number}) {




    const replyThisComment = (data: FormData) => {

        console.log(Object.fromEntries(data.entries()))
    }
    
    return (
        <>
            
        </>
    )
}