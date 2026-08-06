import { likeComment, saveCommentForm } from "@/actions/comment"
import { getRepliesComments } from "@/services/comments.service"
import { CommentType, CommentWithReplies } from "@/types/types"
import { formatDistanceStrict } from "date-fns"
import { Heart, MessageSquareMore, SquareArrowOutUpRight } from "lucide-react"
import Image from "next/image"
import { useContext, useRef, useState } from "react"
import { CommentsLoading } from "./CommentListsLoading"
import { toast } from "sonner"
import { tempErrorHandle } from "@/lib/tempErrorHandle"
import { CommentContext } from "@/lib/commentsContex"
import Link from "next/link"

export const CommentLists = () => {

    const { ownerProjectId, comments, projectId, selectedValuePost, setComments } = useContext(CommentContext)

    const [hidReplyInput, setHidReplyInput] = useState<number>(0)
    const [replies, setReplies] = useState<number>(0)

    const toggleReplyForm = (id: number) => {
        setHidReplyInput(id == hidReplyInput ? 0 : id)
    }
    
    
    const saveComment = async (data: FormData, commentId: number) => {
        setHidReplyInput(commentId)
        try {
            const result = await saveCommentForm(data, projectId, selectedValuePost, commentId)
            
            const reply = result.data 
            if(result.status == 200 && reply){

                setComments((draft: CommentWithReplies[]) => {
                    const commentToUpdate = draft.find(u => u.id === commentId);
                    if (commentToUpdate) {
                        commentToUpdate.Replies = [...commentToUpdate.Replies, reply];
                    }
                })
                toast.success(result.message)
            } else {
                toast.warning(result.message)
            }
             
        } catch (error) {
            tempErrorHandle(error)
        }
    }

    const [retrieved, setRetrieved] = useState<boolean>(false)

    const toggleReplies = async (id: number, comment: CommentWithReplies) => {
        setReplies(id == replies ? 0 : id)

        if(!retrieved){
            const result = await getRepliesComments(comment.id)
            const replies = result.data;
            if(result.status == 200 && replies){
                setComments((draft: CommentWithReplies[]) => {
                    const commentToUpdate = draft.find(u => u.id === comment.id);
                    if (commentToUpdate) {
                        commentToUpdate.Replies = replies;
                    }
                })
                setRetrieved(true)
            }
        }

    }


    return (
        <>
            {(comments.length > 0) &&
                <>
                    {comments.map((comment: CommentWithReplies) => {
                        if(comment.commentC_id) return
                        return (
                            <div key={comment.id} className="w-fill bg-light-purple/20 border border-purplish/20 px-5 py-3 rounded-md">
                                <CommentItem comment={comment}>
                                    <div className={`w-fit py-0 px-3 rounded-full cursor-pointer flex items-center gap-x-1 ${replies == comment.id ? 'bg-purplish hover:bg-purplish/90 text-whitish' : 'bg-grayish/50 hover:bg-grayish/30'}`} onClick={() => toggleReplies(comment.id, comment)}>
                            <MessageSquareMore className="w-3" />
                        </div>
                                </CommentItem>
                                
                                <div hidden={replies != comment.id}>
                                    {(comment.Replies && comment.Replies.length > 0) ?
                                        <>
                                            {comment.Replies.map((comment: CommentType) => {
                                                    return (
                                                        <div className="ml-5 py-3 border-t border-grayish" key={comment.id}>
                                                            <CommentItem comment={comment} />
                                                            <LikeButton key={comment.id} comment={comment} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                    :
                                        <CommentsLoading />
                                    }
                                </div>
                            
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



const CommentItem = <T extends CommentType>({children, comment}: {children?: React.ReactElement,comment: T}) => {
    const { ownerProjectId } = useContext(CommentContext)

    return (
        <>
            {comment.Nodes &&
                <Link href="#" className="p-style w-fit text-slate-500! rounded-md hover:underline cursor-pointer flex items-center gap-x-2 hover:bg-slate-100/50 py-1 px-5">
                    {comment.Nodes?.title}
                    <SquareArrowOutUpRight className="w-3" />
                </Link>
            }
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
                    <p className="p-style w-4/5 my-5">{comment.message}</p>

                    <div className="flex gap-x-3 items-center mb-5">
                        {children}
                        
                        <LikeButton key={comment.id} comment={comment} />
                    </div>
                </div>
            </div>
        </>
    )
}


const LikeButton = ({comment}: {comment: CommentType}) => {
    const [liked, setLiked] = useState<boolean>(comment.Comment_likes.length == 1)
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const likeThisPost = (commentId: number) => {
        setLiked(!liked)

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            likeComment(commentId);
        }, 500); // 500ms
    }
    return (
        <div className={`w-fit py-0 px-3 rounded-full cursor-pointer ${liked ? 'bg-light-purple hover:bg-light-purple/80' : 'bg-grayish/50 hover:bg-grayish/30'}`} onClick={() => likeThisPost(comment.id)}>
            <Heart className={`w-3 ${liked && 'fill-purplish stroke-purplish'}`} />
        </div>
    )
}