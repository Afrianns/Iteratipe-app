"use server"

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { labelType, nodeDataType, returnDataType, timelineNodeType } from "@/types/types";



export async function getTotalNodesByProjectId(ProjectUid: string): Promise<returnDataType<{
  count: number
}>> {
    try {
        const result = await prisma.nodes.count({
            where: {
              uid: ProjectUid
            },
        });
        if(result){
            return {
                status: 200,
                message: "Success retrieved data",
                data: {
                  count: result
                }
            };
        } else{
            throw new Error("error while fetching data")
        }
        
    } catch (error) {
        return {
            status: 500,
            message: "An Error Occur"
        };
    }
}


export async function saveCurrentStateNodes(ProjectUid: string, Nodes: timelineNodeType[]): Promise<returnDataType<{
  count: number
}>> {

  let projectID = 0;

  try {
    const result = await prisma.projects.findFirst({
      where: {
        uid: ProjectUid,
      },
      select: {
        id: true
      }
    })

    if(result?.id){
      projectID = result.id
    } else{
      throw new Error("No Id found");
    }

  } catch (error) {
    return {
        status: 500,
        message: "An Error Occur. Project not found"
    };
  }

  try {
    // {
    //     project_id: ProjectUid,
    //     thumbnail: null,
    //     Title: node.data.title,
    //     type: node.data.type,
    //     start_at: node.data.start_at,
    //     end_at: node.data.end_at,
    //     summary: node.data.content,
    //     node_id: node.id,
    //     position_x: node.position.x,
    //     position_y: node.position.y
    //   }

    let mappedNodes = Nodes.map((node: timelineNodeType) => {
      const startDate = node.data.start_at ? new Date(node.data.start_at).toISOString() : null;
      const endDate = node.data.end_at ? new Date(node.data.end_at).toISOString() : null;
      return Prisma.sql`(
        ${projectID},
        ${null},
        ${node.data.title},
        ${node.data.type},
        ${startDate}::timestamp,
        ${endDate}::timestamp,
        ${node.data.content},
        ${node.id},
        ${node.position.x},
        ${node.position.y},
        ${node.data.handleType},
        NOW())`
    })


      const result = await prisma.$queryRaw`
          INSERT INTO "Nodes" (
            project_id,
            thumbnail,
            title,
            type,
            start_at,
            end_at,
            content,
            node_id,
            position_x,
            position_y,
            handle_type,
            updated_at
          )
          VALUES ${Prisma.join(mappedNodes)}
          ON CONFLICT (ProjectUid, node_id) 
          DO UPDATE SET 
          title = EXCLUDED.title,
          thumbnail = EXCLUDED.thumbnail,
          type = EXCLUDED.type,
          start_at = EXCLUDED.start_at,
          end_at = EXCLUDED.end_at,
          content = EXCLUDED.content,
          position_x = EXCLUDED.position_x,
          position_y = EXCLUDED.position_y, 
          handle_type = EXCLUDED.handle_type, 
          updated_at = NOW()
      `;

      console.log(result)
      
      if(result){
          return {
              status: 200,
              message: "Success retrieved data",
              data: {
                count: 0
              }
          };
      } else{
          throw new Error("error while fetching data")
      }
      
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      console.log(error)
    }
      return {
          status: 500,
          message: "An Error Occur"
      };
  }
}