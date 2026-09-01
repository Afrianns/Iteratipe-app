import { CommentWithReplies, SortingType } from "@/types/types";
import { createContext } from "react";

interface CommentContextType {
  comments: CommentWithReplies[]
  ownerProjectId: number
  projectId: string
  setComments: (params: (draft: CommentWithReplies[]) => void) => void
  selectedValuePost: string
  selectedNodeIdComments: string
  sortingComment: SortingType
  setSortingComment: (params: SortingType) => void
  // setSelectedValuePost: (params: string) => void
}

export const CommentContext = createContext<CommentContextType>({
  comments: [],
  ownerProjectId: 0, 
  projectId: "",
  setComments: (params: (draft: CommentWithReplies[]) => void) => {},
  selectedValuePost: "",
  selectedNodeIdComments: "",
  sortingComment: "ASC",
  setSortingComment: (params: SortingType) => {}
})