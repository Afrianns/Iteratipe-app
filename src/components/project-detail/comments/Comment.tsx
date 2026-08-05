import { formatDistanceStrict } from "date-fns"
import Image from "next/image"
import { useState } from "react"

interface CommentType {
    id: number
    message: string
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
    user_id: number
    project_id: number
    node_id: number | null
    comment_id: number | null
    Users: {
      id: number
      clerk_user_id: string
      first_name: string
      last_name: string
      full_name: string
      email: string
      image_url: string
    }
}

export default function Comment({comment, ownerProjectId}: {comment: CommentType, ownerProjectId: number}) {
  return (
    <>
      
    </>
  )
}