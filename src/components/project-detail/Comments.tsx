"use client"

import CommentsSorting from "./comments/CommentsSorting";
import { useEffect, useRef, useState } from "react";
import { CommentLists } from "./comments/CommentsList";
import NodesListDropdown from "./comments/NodesListDropdown";
import { getCommentsByProjectId } from "@/services/comments.service";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { toast } from "sonner";
import { saveCommentForm } from "@/actions/comment";
import { CommentWithReplies, SortingType } from "@/types/types";
import { CommentsLoading } from "./comments/CommentListsLoading";


import { useImmer } from "use-immer"
import { CommentContext } from "@/lib/commentsContex";
import dynamic from "next/dynamic";

import DOMPurify from 'dompurify';


const CommentTextEditor = dynamic(() => import('./comments/CommentTextEditor'), { 
  ssr: false 
});

// Define the RichTextEditorHandle type
type RichTextEditorHandle = {
  getContent: () => string
  resetContent: () => void
}

export default function Comments({projectId, ownerProjectId}: {projectId: string, ownerProjectId: number}) {
    
    const [selectedNodeIdComments, setSelectedNodeIdComments] = useState<string>("NOT_AN_ID")
    const [selectedValuePost, setSelectedValuePost] = useState<string>("NOT_AN_ID")

    const [isCommentsSet, setIsCommentsSet] = useState<boolean>(false) 
    
    const [comments, setComments] = useImmer<CommentWithReplies[]>([])

    const [SortingComment, setSortingComment] = useState<SortingType>("ASC")

    const editorRef = useRef<RichTextEditorHandle>(null);

    useEffect(() => {
        
        setIsCommentsSet(false)

        const getAllRelatedProjectComments = async () => {
            await getCommentsByProjectId(projectId, selectedNodeIdComments).then((result) => {
                const dbComments = result.data

                if(result.status == 200){
                    if(dbComments != undefined && dbComments.length > 0){
                        setComments(() => {
                            setIsCommentsSet(true)
                            return dbComments.map((comments) => ({...comments, Replies: []})) 
                        })
                    } else{
                        setIsCommentsSet(true)
                        setComments([])
                    }
                }
            }).catch((e) => {
                console.log(e)
            })
            
        }
        
        getAllRelatedProjectComments()
    }, [projectId, selectedNodeIdComments])

    // store saved comment
    const beforeSaveComment = async () => {
        const quillRef = editorRef.current

        if (!quillRef) return
        let purifiedMessage = ""
        const content = quillRef.getContent();
        if(content) purifiedMessage = DOMPurify.sanitize(content, { ADD_ATTR: ['target'] });

        try {
            const result = await saveCommentForm(purifiedMessage, projectId, selectedValuePost)
            if(result?.status == 200 && result.data){
                setComments([...comments, {...result.data, Replies: []}])
                toast.success(result.message)
                quillRef.resetContent()
            } else {
                toast.warning(result.message)
            }
             
        } catch (error) {
            tempErrorHandle(error)
        }
    }

    return (
        <CommentContext.Provider value={{comments: comments, ownerProjectId: ownerProjectId, projectId: projectId, selectedValuePost: selectedValuePost, selectedNodeIdComments: selectedNodeIdComments, setComments: setComments, sortingComment: SortingComment, setSortingComment: setSortingComment}}>
            <div className="container-style">
                <div className="limit-breaker w-full">
                    <div className="card-style-secondary p-0! space-y-3 col-span-2 max-w-200">
                        <div className="flex justify-between items-center p-5">
                            <div className="max-w-90 w-full relative space-y-3">
                                <p className="p-style">Comments from</p>
                                <NodesListDropdown setSelectedId={setSelectedNodeIdComments} />
                            </div>
                            <CommentsSorting />
                        </div>
                        <hr className="hr-style" />
                        <div className="space-y-6 p-5">
                            {isCommentsSet ? 
                                comments.length > 0 ?
                                    <CommentLists />
                                :   
                                    <div className="flex flex-col justify-center items-center space-y-5 my-10">
                                        {/* <Image src="/assets/no-comments-available.svg" width={200} height={200} alt="empty post box" /> */}
                                        <h1 className="h-four-style">Currently No Comments Available</h1>
                                    </div>
                            :
                                <CommentsLoading />
                            }
                        </div>

                    </div>
                    <div className="my-5 max-w-200 card-style-secondary space-y-3 p-5!">
                        <h3 className="">Write your feedback</h3>
                        <div>
                            <CommentTextEditor id={1} ref={editorRef} />
                        </div>
                        <div className="flex items-center gap-x-10 justify-between">
                            <div className="max-w-50 w-full relative">
                                <p className="p-style">Post for</p>
                                <NodesListDropdown direction="top" setSelectedId={setSelectedValuePost} />
                            </div>
                            <button
                                onClick={beforeSaveComment}
                                className="button-style-secondary text-xs! py-2! px-5! rounded-full text-right"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CommentContext.Provider>
    )
}