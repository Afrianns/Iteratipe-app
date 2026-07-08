"use client"

import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { useState } from "react";

export default function CommentsSorting() {
    const [isIconFilterAsc, setIsIconFilterAsc] = useState<boolean>(false);

    const commentFilterFn = () => setIsIconFilterAsc(!isIconFilterAsc)
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