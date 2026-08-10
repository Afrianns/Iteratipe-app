"use client"

import { CommentContext } from "@/lib/commentsContex";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { useContext, useState } from "react";

export default function CommentsSorting() {
    const { setSortingComment } = useContext(CommentContext)

    const [isIconFilterAsc, setIsIconFilterAsc] = useState<boolean>(false);

    const commentFilterFn = () => {
        setIsIconFilterAsc(!isIconFilterAsc)
        
        if (isIconFilterAsc) {
            setSortingComment("ASC")
        } else{
            setSortingComment("DSC")
        }
    }
    return (
        <button onClick={commentFilterFn}>
            {isIconFilterAsc ? 
                <ArrowDownWideNarrow className="icon-style" />
            :
                <ArrowUpWideNarrow className="icon-style" />
            }
        </button>
    )
}