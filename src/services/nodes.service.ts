"use server"

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { NodeDBType, returnDataType } from "@/types/types";
import { Sql } from "@prisma/client/runtime/client";



export async function getTotalNodesByProjectId(ProjectUid: string): Promise<returnDataType<{
  count: number
}>> {
    try {
        const result = await prisma.nodes.count({
            where: {
              uid: ProjectUid
            },
        });

        console.log('ssss---',result)
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

export async function saveCurrentStateNodes(mappedNodes: Sql[]): Promise<returnDataType<NodeDBType[]>> {

  try {
      const result = await prisma.$queryRaw`
          INSERT INTO "Nodes" (
            uid,
            project_id,
            thumbnail,
            title,
            type,
            start_at,
            end_at,
            content,
            position_x,
            position_y,
            handle_type,
            updated_at
          )
          VALUES ${Prisma.join(mappedNodes)}
          ON CONFLICT (uid) 
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
          RETURNING title, thumbnail, type, TO_CHAR(start_at, 'DD FMMonth YYYY') as start_date, TO_CHAR(end_at, 'DD FMMonth YYYY') as end_date, content, position_x, position_y, handle_type, uid
      `;

      if(result){
          return {
              status: 200,
              message: "Success retrieved data",
              data: result as NodeDBType[]
          };
      } else{
          throw new Error("error while fetching data")
      }
      
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      console.log(error)
    }
    console.log(error)
      return {
          status: 500,
          message: "An Error Occur"
      };
  }
}