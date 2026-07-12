"use client";

export default function TagsSetting({ tags }: {tags: string[]}) {

    return (
        <>
            {tags.map((tag, idx) => <span key={idx} className="tag-style">{tag}</span>)}
        </>
    )
}