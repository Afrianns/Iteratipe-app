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
import { usePathname } from "next/navigation"

import DOMPurify from 'dompurify';

export const CommentLists = () => {

    const { comments, projectId, selectedValuePost, setComments } = useContext(CommentContext)

    const [hidReplyInput, setHidReplyInput] = useState<number>(0)
    const [showRepliesByID, setShowRepliesByID] = useState<number>(0)
    
    const [retrieved, setRetrieved] = useState<number[]>([])
    const [anyReplies, setAnyReplies] = useState<number[]>([])

    const [commentContent, setCommentContent] = useState<string>("")
    const [commentContentLength, setCommentContentLength] = useState<number>(0)

    const toggleReplyForm = (id: number) => {
        setHidReplyInput(id == hidReplyInput ? 0 : id)
    }
    
    
    const saveComment = async (comment: CommentWithReplies) => {
        
        const purifyMessage = DOMPurify.sanitize('<b>hello there</b>');
        try {
            const result = await saveCommentForm(purifyMessage, projectId, selectedValuePost, comment.id)
            
            const reply = result.data 
            if(result.status == 200 && reply){

                setComments((draft: CommentWithReplies[]) => {
                    const commentToUpdate = draft.find(u => u.id === comment.id);
                    if (commentToUpdate) {
                        commentToUpdate.Replies = [...commentToUpdate.Replies, reply];
                    }
                })
                console.log(result)
                toast.success(result.message)
            } else {
                toast.warning(result.message)
            }
             
        } catch (error) {
            tempErrorHandle(error)
        } finally {
            setShowRepliesByID(comment.id)
            getReplies(comment)
        }
    }

    const toggleReplies = async (id: number, comment: CommentWithReplies) => {
        setShowRepliesByID(id == showRepliesByID ? 0 : id)
        getReplies(comment);
    }

    const getReplies = async (comment: CommentWithReplies) => {

        if(!retrieved.includes(comment.id)){
            const result = await getRepliesComments(comment.id)
            const replies = result.data;

            console.log(result)
            if(result.status == 200){

                if(replies){
                    setComments((draft: CommentWithReplies[]) => {
                        const commentToUpdate = draft.find(u => u.id === comment.id);
                        if (commentToUpdate) {
                            commentToUpdate.Replies = replies;
                        }
                    })
                    setRetrieved([...retrieved, comment.id])
                    setAnyReplies([...retrieved, comment.id])
                } else{   
                    console.log("top ", anyReplies)
                    setAnyReplies([...retrieved, comment.id])
                }
                console.log("lower ", anyReplies)
            }
        }

    }

    const commentChanges = (e:  React.ChangeEvent<HTMLTextAreaElement>) => {
        
    }


    return (
        <>
            {(comments.length > 0) &&
                <>
                    {comments.map((comment: CommentWithReplies) => {
                        if(comment.commentC_id) return
                        return (
                            <div key={comment.id} className="w-fill bg-purplish/5 border border-purplish/50 px-5 py-3 rounded-md">
                                <CommentItem comment={comment}>
                                        <div className={`w-fit py-0 px-3 rounded-full cursor-pointer flex items-center gap-x-1 ${showRepliesByID == comment.id ? 'bg-purplish hover:bg-purplish/90 text-whitish' : 'bg-grayish/50 hover:bg-grayish/30'}`} onClick={() => toggleReplies(comment.id, comment)}>
                                            <MessageSquareMore className="w-3" />
                                        </div>
                                </CommentItem>
                                
                                <div hidden={showRepliesByID != comment.id}>
                                    {anyReplies.includes(comment.id) ? 
                                        <>
                                            {(comment.Replies && comment.Replies.length > 0) ?
                                                <>
                                                    {comment.Replies.map((comment: CommentType) => {
                                                            return (
                                                                <div className="ml-15 py-3" key={comment.id}>
                                                                    <CommentItem comment={comment} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </>
                                            :
                                                <p className="h-four-style text-center mt-0!">No Replies, Be The First!</p>
                                        }
                                        </>
                                    :
                                        <div className="ml-15">
                                            <CommentsLoading />
                                        </div>
                                    }
                                    
                                </div>
                            
                                <p className="text-purplish text-xs hover:underline cursor-pointer text-right" onClick={() => toggleReplyForm(comment.id)}>Reply</p>
                                <form action={(e) => saveComment(comment)} className="card-style p-2 ml-5 mt-3" hidden={hidReplyInput != comment.id}>
                                    <textarea name="comment" id="comment" className="input-style" value={commentContent} onChange={commentChanges}></textarea>
                                    <button className="py-2 px-5 bg-purplish/2 hover:bg-light-purple cursor-pointer rounded-lg text-purplish text-xs">Post</button>
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

    const result = usePathname()
    return (
        <>
            {comment.Nodes &&
                <Link href={`${result}?menu=timeline&node=${comment.Nodes.uid}`} className="p-style w-fit text-slate-500! rounded-md hover:underline cursor-pointer flex items-center gap-x-2 hover:bg-slate-100/50 py-1 px-5">
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
                <div className="space-y-2 w-full border border-grayish p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-x-3">
                                    <h3 className="text-md font-medium">{comment.Users.first_name} {comment.Users.last_name}</h3>
                                    {ownerProjectId == comment.Users.id &&
                                        <span className="badge-style bg-grayish">Author</span>
                                    }
                                </div>
                                <Link href="#" className="span-style hover:underline cursor-pointer text-purplish!">@{comment.Users.username}</Link>
                            </div>

                        {comment.created_at &&
                            <span className="span-style">{formatDistanceStrict(new Date(comment.created_at), new Date(), { addSuffix: true })}</span>
                        }
                    </div>
                    <p className="message-content p-style w-4/5 my-5" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.message, { ADD_ATR: ['target'], ALLOWED_VALS: ['_blank'] } as any) }} />

                    <div className="flex gap-x-3 items-center">
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