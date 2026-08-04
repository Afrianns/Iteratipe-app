"use server"

import { Prisma } from "@/generated/prisma/client"
import { uuidRegex } from "@/lib/regexHelpers"
import { tempErrorHandle } from "@/lib/tempErrorHandle"
import { saveCurrentStateEdges } from "@/services/edges.service"
import { syncAndDeleteDBWithLocal } from "@/services/syncTimeline.service"
import { returnDataType, timelineNodeType } from "@/types/types"
import { Sql } from "@prisma/client/runtime/client"
import { Edge } from "@xyflow/react"

type DBEdgeType = {
    uid: string,
    source: string,
    target: string
}


export const autoUpdateEdges = async (projectUid: string, Edges: Edge[]): Promise<returnDataType<{
    edges: Edge[]
}>> => {

  let mappedEdges: Sql[] = []
  
  for (const edge of Edges) {
    // e-${edge.source}-to-${edge.target}`
    const isValidEdge = `e-${String(edge.source)}-to-${String(edge.target)}` === edge.id;

    if(!isValidEdge || !uuidRegex.test(String(edge.source)) || !uuidRegex.test(String(edge.target))){
        return {
            status: 500,
            message: "Invalid edge format"
        }
    }

     mappedEdges.push(Prisma.sql`(
                ${edge.id},
                (SELECT id FROM "Projects" WHERE uid = ${projectUid}),
                ${edge.source},
                ${edge.target})`)
  }

  // syncing by delete
  try {
      const result = await syncAndDeleteDBWithLocal("Edges", Edges, projectUid);

      console.log("syncing edges: ",result, mappedEdges)
      if(result.status == 200){
          console.log(result);
      }
      
      if(result.status == 500){
          throw new Error("Failed to fetch");   
      }
  } catch (error) {
      return tempErrorHandle(error);
  }


  try {
    if(mappedEdges.length > 0){

        const result = await saveCurrentStateEdges(mappedEdges)
        
        if(result.status == 200 && result.data){

            console.log("edge: ",result.data)
            let mappedTimelineEdges: Edge[] = result.data.map((edge: DBEdgeType) => {
                return {
                    id: edge.uid,
                    source: edge.source,
                    target: edge.target,
                } as Edge
            })

            return {
                status: 200,
                message: "Successfuly updated edges",
                data: {
                    edges: mappedTimelineEdges
                }
            }
        } else {
            throw new Error("Failed to fetch");   
        }
    } else {
        return {
            status: 200,
            message: "No edges to update",
        }
    }

} catch (error) {
    return tempErrorHandle(error);   
}
}