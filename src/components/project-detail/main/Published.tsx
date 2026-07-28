"use client"

export default function Published({created_at}: {created_at: Date}) {
    return (
        <span className="ml-2 text-md font-medium">{created_at.toDateString()}</span>
    )
}