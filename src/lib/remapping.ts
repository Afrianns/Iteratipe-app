import { Edge } from "@xyflow/react";
import { convertDate } from "./convertDate";
import { handleEnum } from "@/types/enum";
import { handleTypeEnum } from "@/generated/prisma/enums";
import { timelineNodeType } from "@/types/types";
import { Decimal } from "@prisma/client/runtime/client";

export const remapEdges = <T extends 
    { 
        source: string; 
        target: string; 
        id: number; 
        uid: string; 
        project_id: number; 
    }
>(edges: T[]): Edge[] => {

    const newEdges = edges.map((edge: T): Edge => {

        return {
            id: `e-${edge.source}-to-${edge.target}`,
            source: edge.source,
            target: edge.target,
    //      uid: edge.uid,
    //      project_id: edge.project_id
        }
    })

    return newEdges;
 
}


export const remapNodes = <T extends {
  uid: string
  title: string | null
  updated_at: Date | null
  type: string | null
  project_id: number
  image_url: string | null
  start_at: Date | null
  end_at: Date | null
  content: string | null
  published_at: Date | null
  position_x: Decimal
  position_y: Decimal
  handle_type: handleTypeEnum
}>(nodes: T[]): timelineNodeType[] => {

    let newNodes = nodes.map((node: T): timelineNodeType => {
        return {
            id: node.uid,
            position: {
                x: Number(node.position_x),
                y: Number(node.position_y),
            },
            data: {
                image_url: node.image_url || "",
                title: node.title || "",
                type: node.type || "",
                content: node.content || "",
                start_at: node.start_at ? convertDate(new Date(node.start_at)) : "",
                end_at: node.end_at ? convertDate(new Date(node.end_at)) : "",
                handleType: node.handle_type as handleEnum,
                // updated_at: node.updated_at,
                // published_at: node.published_at
            },
            origin: [0.5, 0.5], 
            type: "cardNode"
        }
    })

    return newNodes
}