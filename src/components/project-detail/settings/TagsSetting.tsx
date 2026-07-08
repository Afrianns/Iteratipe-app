"use client";

import { useEffect } from "react";

export default function TagsSetting({ tags }: {tags: string[]}) {

    // useEffect(() => {

    // })

    return (
        <>
            {tags.map((tag, idx) => <span key={idx} className="tag-style">{tag}</span>)}
        </>
    )
}