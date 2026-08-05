import CommentsSorting from "./comments/CommentsSorting";
import { Suspense, useEffect, useState } from "react";
import CommentsList from "./comments/CommentsList";
import { useTimelineStateStore } from "@/hooks/useTimelineStateStore";
import NodesListDropdown from "./comments/NodesListDropdown";
import { getCommentsByProjectId, saveComment } from "@/services/comments.service";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { toast } from "sonner";
import { saveCommentForm } from "@/actions/comment";
import Image from "next/image";
import { formatDistanceStrict } from "date-fns";

interface CommentsType {
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
    },
    Replies?: {
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
    }[]
}

export default function Comments({projectId, ownerProjectId}: {projectId: number, ownerProjectId: number}) {
    
    // const nodes = useTimelineStateStore((state) => state.globalNodes)
    const [selectedValueComments, setSelectedValueComments] = useState<string>("NOT_AN_ID")
    const [selectedValuePost, setSelectedValuePost] = useState<string>("NOT_AN_ID")
    
    const [comments, setComments] = useState<CommentsType[]>([])

    useEffect(() => {
        const getAllRelatedProjectComments = async () => {
            const result = await getCommentsByProjectId(projectId)

            if(result.status == 200 && result.data){
                setComments(result.data)
            }
        }

        getAllRelatedProjectComments()
    }, [projectId])

    return (
        <div className="container-style">
            <div className="limit-breaker w-full">
                <div className="card-style-secondary space-y-3 col-span-2 max-w-200">
                    <div className="flex justify-between items-center">
                        <div className="max-w-90 w-full relative">
                            <p className="p-style">Comments from</p>
                            <NodesListDropdown setSelectedId={setSelectedValueComments} />
                        </div>
                        <CommentsSorting />
                    </div>
                    <hr className="hr-style" />
                    <div className="space-y-6 mt-5">
                        {comments.length > 0 ? 
                            <CommentLists comments={comments} ownerProjectId={ownerProjectId} projectId={projectId} selectedValuePost={selectedValuePost} />
                        :
                            <CommentsLoading />
                        }
                    </div>

                </div>
                <form action={(e) => saveCommentForm(e, projectId, selectedValuePost)} className="my-5 max-w-200 card-style-secondary space-y-3 px-3! py-5!">
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
    )
}

const CommentLists = ({comments, ownerProjectId, projectId, selectedValuePost}: {comments: CommentsType[], ownerProjectId: number, projectId: number, selectedValuePost: string}) => {
    const [hidReplyInput, setHidReplyInput] = useState<number>(0)

    const toggleReplyForm = (id: number) => {
        setHidReplyInput(id == hidReplyInput ? 0 : id)
    }

    const saveComment = (data: FormData, commentId: number) => {
        saveCommentForm(data, projectId, selectedValuePost, commentId)
    }
    return (
        <>
            {(comments.length > 0) &&
                <>
                    {comments.map((comment: CommentsType) => {
                        if(comment.commentC_id) return
                        return (
                            <div key={comment.id} className="w-fill bg-light-purple/20 border border-purplish/20 px-5 py-3 rounded-md">
                                <CommentItem comment={comment} ownerProjectId={ownerProjectId} />

                                {(comment.Replies && comment.Replies.length > 0) &&
                                    <>
                                        {comment.Replies.map((comment: CommentsType) => {
                                                return (
                                                    <div className="ml-5 py-3 border-t border-grayish" key={comment.id}>
                                                        <CommentItem comment={comment} ownerProjectId={ownerProjectId} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                }
                                <p className="text-purplish text-xs hover:underline cursor-pointer text-right" onClick={() => toggleReplyForm(comment.id)}>Reply</p>
                                <form action={(e) => saveComment(e, comment.id)} className="card-style p-2 ml-5 mt-3" hidden={hidReplyInput != comment.id}>
                                    <textarea name="comment" id="comment" className="input-style"></textarea>
                                    <button className="py-2 px-5 bg-light-purple/50 hover:bg-light-purple cursor-pointer rounded-lg text-purplish text-xs">Post</button>
                                </form>
                            </div>
                        )
                    })}
                </>
            }
        </>
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


const CommentItem = ({comment, ownerProjectId}: {comment: CommentsType, ownerProjectId: number}) => {
    return (
        <div className="flex items-start gap-x-5 py-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                {comment.Users.image_url && 
                    <Image alt="user profile placeholder" src={comment.Users.image_url} fill className="object-cover"/>
                }
            </div>
            <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <h3 className="text-md font-medium underline hover:no-underline cursor-pointer">{comment.Users.first_name}</h3>
                        {ownerProjectId == comment.Users.id &&
                            <span className="badge-style bg-grayish">Author</span>
                        }
                    </div>

                    {comment.created_at &&
                        <span className="span-style">{formatDistanceStrict(new Date(comment.created_at), new Date(), { addSuffix: true })}</span>
                    }
                </div>
                <p className="p-style w-4/5">{comment.message}</p>
            </div>
        </div>
    )
}

const CommentsLoading = () => {
    const counts: number[] = [1,2,3]
    return (
        <>
            {counts.map((count: number) => (
                <div key={count} className="flex items-start gap-x-5 justify-start w-fill animate-pulse">
                    <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0" />
                    
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <div className="h-5 w-32 bg-slate-200 rounded" />
                                <div className="h-5 w-14 bg-slate-200 rounded-full" />
                            </div>

                            <div className="h-4 w-16 bg-slate-200 rounded" />
                        </div>
                        
                        <div className="space-y-2 w-4/5">
                            <div className="h-4 w-full bg-slate-200 rounded" />
                            <div className="h-4 w-5/6 bg-slate-200 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}