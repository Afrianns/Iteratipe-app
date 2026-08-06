import CommentsSorting from "./comments/CommentsSorting";
import { useEffect, useState } from "react";
import { CommentLists } from "./comments/CommentsList";
import NodesListDropdown from "./comments/NodesListDropdown";
import { getCommentsByProjectId } from "@/services/comments.service";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { toast } from "sonner";
import { saveCommentForm } from "@/actions/comment";
import { CommentWithReplies } from "@/types/types";
import { CommentsLoading } from "./comments/CommentListsLoading";


import { useImmer } from "use-immer"
import { CommentContext } from "@/lib/commentsContex";

export default function Comments({projectId, ownerProjectId}: {projectId: string, ownerProjectId: number}) {
    
    // const nodes = useTimelineStateStore((state) => state.globalNodes)
    const [selectedNodeIdComments, setSelectedNodeIdComments] = useState<string>("NOT_AN_ID")
    const [selectedValuePost, setSelectedValuePost] = useState<string>("NOT_AN_ID")

    const [isCommentsSet, setIsCommentsSet] = useState<boolean>(false) 
    
    const [comments, setComments] = useImmer<CommentWithReplies[]>([])

    useEffect(() => {
        setIsCommentsSet(false)
        const getAllRelatedProjectComments = async () => {
            await getCommentsByProjectId(projectId, selectedNodeIdComments).then((result) => {
                const dbComments = result.data

                console.log("getting called", result, projectId, selectedNodeIdComments)
                if(result.status == 200){
                        if(dbComments != undefined && dbComments.length > 0){
                            setComments(() => {
                                setIsCommentsSet(true)
                                return dbComments.map((comments) => ({...comments, Replies: []})) 
                            })
                        } else{
                            setIsCommentsSet(true)
                        }
                }
            }).catch((e) => {
                console.log(e)
            })
            
        }
        
        getAllRelatedProjectComments()
    }, [projectId, selectedNodeIdComments])

    // store saved comment
    const beforeSaveComment = async (e: FormData) => {
        try {
            const result = await saveCommentForm(e, projectId, selectedValuePost)
            if(result?.status == 200 && result.data){
                setComments([...comments, {...result.data, Replies: []}])
                toast.success(result.message)
            } else {
                toast.warning(result.message)
            }
             
        } catch (error) {
            tempErrorHandle(error)
        }
    }

    return (
        <CommentContext.Provider value={{comments: comments, ownerProjectId: ownerProjectId, projectId: projectId, selectedValuePost: selectedValuePost, setComments: setComments}}>
            <div className="container-style">
                <div className="limit-breaker w-full">
                    <div className="card-style-secondary space-y-3 col-span-2 max-w-200">
                        <div className="flex justify-between items-center">
                            <div className="max-w-90 w-full relative">
                                <p className="p-style">Comments from</p>
                                <NodesListDropdown setSelectedId={setSelectedNodeIdComments} />
                            </div>
                            <CommentsSorting />
                        </div>
                        <hr className="hr-style" />
                        <div className="space-y-6 mt-5">
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
                    <form action={(e) => beforeSaveComment(e)} className="my-5 max-w-200 card-style-secondary space-y-3 px-3! py-5!">
                        <h3 className="">Write your feedback</h3>
                        <textarea name="comment" id="comment" className="input-style"></textarea>
                        <div className="flex items-center justify-between">
                            <div className="max-w-50 w-full relative">
                                <p className="p-style">Post for</p>
                                <NodesListDropdown direction="top" setSelectedId={setSelectedValuePost} />
                            </div>
                            <div className="text-right">
                                <button className="button-style-secondary rounded-md">Post</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </CommentContext.Provider>
    )
}

const CommentsListLoading = () => {
    return (
        <div className="flex items-center justify-between pt-4 animate-pulse">
            <div className="h-6 w-44 bg-slate-200 rounded" />
            <div className="h-6 w-12 bg-slate-200 rounded" />
        </div>
    )
}