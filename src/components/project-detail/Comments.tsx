import Image from "next/image";;
import CommentsSorting from "./comments/CommentsSorting";
import { Suspense } from "react";
import CommentsSection from "./comments/CommentsSection";
import CommentsList from "./comments/CommentsList";

export default function Comments() {
    return (
        <div className="px-10 py-5">
            <div className="max-w-360 mx-auto w-full">
                <div className="card-style-secondary col-span-2 max-w-200">
                    <div className="flex justify-between items-center">
                        <div className="max-w-90 w-full relative">
                            <p className="p-style">Comments from</p>
                            <Suspense fallback={<CommentsListLoading />}>
                                <CommentsSection />
                            </Suspense>
                        </div>
                        <CommentsSorting />
                    </div>
                    <hr className="hr-style" />
                    <div className="space-y-6 mt-5">
                        <Suspense fallback={<CommentsLoading/>}>
                            <CommentsList />
                        </Suspense>
                    </div>
                </div>      
            </div>
        </div>
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