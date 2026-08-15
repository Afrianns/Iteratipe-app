"use client"

import { likeComment, saveCommentForm } from "@/actions/comment"
import { getRepliesComments } from "@/services/comments.service"
import { CommentType, CommentWithReplies } from "@/types/types"
import { formatDistanceStrict } from "date-fns"
import { Heart, MessageSquareMore, SquareArrowOutUpRight } from "lucide-react"
import { createRef, useContext, useEffect, useRef, useState } from "react"
import { CommentsLoading } from "./CommentListsLoading"
import { toast } from "sonner"
import { tempErrorHandle } from "@/lib/tempErrorHandle"
import { CommentContext } from "@/lib/commentsContex"
import { usePathname } from "next/navigation"

import DOMPurify from 'dompurify'
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL

const CommentTextEditor = dynamic(() => import('./CommentTextEditor'), { 
  ssr: false 
});

type CommentTextEditorHandle = {
  getContent: () => string
  resetContent: () => void
}

export const CommentLists = () => {

    const { comments, projectId, selectedValuePost, setComments, selectedNodeIdComments, sortingComment } = useContext(CommentContext)

    const [hidReplyInput, setHidReplyInput] = useState<number>(0)
    const [showRepliesByID, setShowRepliesByID] = useState<number>(0)
    
    const [retrieved, setRetrieved] = useState<Set<number>>(new Set())

    let editorRef = useRef<React.RefObject<CommentTextEditorHandle | null>[]>([])
    const [editorContent, setEditorContent] = useState<string>("")

    const toggleReplyForm = (id: number) => {
        setHidReplyInput(id == hidReplyInput ? 0 : id)
    }

    useEffect(() => {
        setComments((draft: CommentWithReplies[]) => draft.sort((a, b) => (sortingComment == "ASC") ? a.created_at.getTime() - b.created_at.getTime() : b.created_at.getTime() - a.created_at.getTime()))
    }, [sortingComment])

    useEffect(() => {
        editorRef.current = comments.map(() => createRef<CommentTextEditorHandle>())
    }, [])
    
    const saveComment = async (comment: CommentWithReplies, id: number) => {
        const quillRef = editorRef.current[id].current;
        console.log(quillRef, "?")
        if(!quillRef) return;
        let purifiedComment = '';
        const impureComment = quillRef.getContent();

        setEditorContent(quillRef.getContent())
        
        if(impureComment) purifiedComment = DOMPurify.sanitize(impureComment);

        console.log(impureComment, purifiedComment)
        try {
            const result = await saveCommentForm(purifiedComment, projectId, selectedValuePost, comment.id)
            
            const reply = result.data 
            if(result.status == 200 && reply){

                setComments((draft: CommentWithReplies[]) => {
                    const commentToUpdate = draft.find(u => u.id === comment.id)
                    if (commentToUpdate) {
                        commentToUpdate.Replies = [...commentToUpdate.Replies, reply]
                    }
                })
                console.log(result, quillRef)
                toast.success(result.message)
            } else {
                toast.warning(result.message)
            }
             
        } catch (error) {
            tempErrorHandle(error)
        } finally {
            setShowRepliesByID(comment.id)

            quillRef.resetContent()
            // it will not rerender after every chained function completed
            // setRetrieved(prevSet =>  {
            //     let set = new Set(prevSet)
            //     set.delete(comment.id)
            //     return set
            // })
            getReplies(comment)
        }
    }

    const toggleReplies = (id: number, comment: CommentWithReplies) => {
        setShowRepliesByID(id == showRepliesByID ? 0 : id)
        getReplies(comment);
    }

    const getReplies = async (comment: CommentWithReplies) => {

        // cause of that this will false(id is in there)
        if(!retrieved.has(comment.id)){        

            const result = await getRepliesComments(comment.id)
            const replies = result.data;

            if(result.status == 200){

                if(replies){
                    setComments((draft: CommentWithReplies[]) => {
                        const commentToUpdate = draft.find(u => u.id === comment.id);
                        if (commentToUpdate) {
                            commentToUpdate.Replies = replies;
                        }
                    })
                }
                setRetrieved(prevSet =>  new Set(prevSet).add(comment.id))
            }
        }

    }

    return (
        <>
            {(comments.length > 0) &&
                <>
                    {filterComments(comments, selectedNodeIdComments).map((comment: CommentWithReplies, id: number) => {
                        if(comment.commentC_id) return
                        return (
                            <div key={comment.id} className="w-fill border border-grayish/80 px-5 py-3 rounded-md relative">
                                <div className="relative">
                                    <CommentItem comment={comment}>
                                            <div className={`w-fit py-0 px-3 rounded-full cursor-pointer flex items-center gap-x-1 ${showRepliesByID == comment.id ? 'bg-main hover:bg-main/90 text-whitish' : 'bg-grayish/50 hover:bg-grayish/30'}`} onClick={() => toggleReplies(comment.id, comment)}>
                                                <MessageSquareMore className="w-3" />
                                            </div>
                                    </CommentItem>

                                    {/* <div className="top-10 bottom-5 left-5 z-1 border-l-5 border-gray-200 w-0 absolute" /> */}
                                    
                                    <div hidden={showRepliesByID != comment.id}>
                                        {retrieved.has(comment.id) ? 
                                            <>
                                                {(comment.Replies && comment.Replies.length > 0) ?
                                                    <div className="relative">
                                                        {comment.Replies.map((comment: CommentType) => {
                                                            return (
                                                                    <div className="ml-15 py-3" key={comment.id}>
                                                                        <CommentItem comment={comment} />
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                :
                                                    <p className="h-four-style text-center mt-5!">No Replies, Be The First!</p>
                                                }
                                            </>
                                        :
                                            <div className="ml-15">
                                                <CommentsLoading />
                                            </div>
                                        }
                                    </div>
                                </div>
                            
                                <p className="text-main text-xs hover:underline cursor-pointer text-right" onClick={() => toggleReplyForm(comment.id)}>Reply</p>
                                <div className="my-5 max-w-200 card-style-secondary space-y-3 p-3!" hidden={hidReplyInput != comment.id}>
                                    <CommentTextEditor key={comment.id} id={comment.id} ref={editorRef.current[id]} />
                                    <button
                                        onClick={() => saveComment(comment, id)}
                                        className="button-style-secondary text-xs! py-2! px-5! rounded-full text-right"
                                    >
                                        Post
                                    </button>
                                </div>
                                {/* <form action={(e) => saveComment(comment)} className="card-style p-2 ml-5 mt-3" hidden={hidReplyInput != comment.id}>
                                    <textarea name="comment" id="comment" className="input-style"></textarea>
                                    <button className="py-2 px-5 bg-main/2 hover:bg-secondary cursor-pointer rounded-lg text-main text-xs">Post</button>
                                </form> */}
                            </div>
                        )
                    })}
                </>
            }
        </>
    )
}


const filterComments = (comments: CommentWithReplies[], params: string) => {
    if(params != "NOT_AN_ID") {
        return comments.filter((comment) => comment.Nodes?.uid == params)
    }
    
    return comments
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
            <div className="flex items-start gap-x-5 py-3 h-full">
                <div className="top-10 bottom-0 left-4.5 z-1 border-l-5 border-gray-100 w-0 absolute" />
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 z-2">
                    {comment.Users.image_url && (
                        <>
                            <Image alt="user profile placeholder" src={comment.Users.image_url} fill className="object-cover"/>
                        </>
                        )
                    }
                </div>
                                    
                <div className="space-y-2 w-full rounded-xl">
                    <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-x-3">
                                    <h3 className="text-md font-medium">{comment.Users.first_name} {comment.Users.last_name}</h3>
                                    {ownerProjectId == comment.Users.id &&
                                        <span className="badge-style bg-grayish">Author</span>
                                    }
                                </div>
                                <Link href={`${APP_URL}/user/${comment.Users.username}`} className="span-style hover:underline cursor-pointer text-main!" target="_blank">@{comment.Users.username}</Link>
                            </div>

                        {comment.created_at &&
                            <span className="span-style">{formatDistanceStrict(new Date(comment.created_at), new Date(), { addSuffix: true })}</span>
                        }
                    </div>
                    <div className="message-content p-style w-full my-5 [word-break:break-word]" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.message, { ADD_ATTR: ['target'] }) }} />

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
        <div className={`w-fit py-0 px-3 rounded-full cursor-pointer ${liked ? 'bg-secondary hover:bg-secondary/80' : 'bg-grayish/50 hover:bg-grayish/30'}`} onClick={() => likeThisPost(comment.id)}>
            <Heart className={`w-3 ${liked && 'fill-main stroke-main'}`} />
        </div>
    )
}