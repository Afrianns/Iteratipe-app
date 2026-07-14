"use client";

export default function TagsSetting({ tags }: {tags: string[]}) {

    return (
        <>
            {tags.map((tag, idx) => <span key={idx} className="badge-style-secondary">{tag}</span>)}
        </>
    )
}