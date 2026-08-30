"use server"

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { NodeDBType, returnDataType } from "@/types/types";
import { logger } from "@/lib/logger";

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

// SECURITY: Use raw SQL for performance but with proper validation
// Prisma.join() provides parameterization protection against SQL injection
export async function saveCurrentStateNodes(mappedNodes: any[]): Promise<returnDataType<NodeDBType[]>> {

  try {
      if (!Array.isArray(mappedNodes) || mappedNodes.length === 0) {
        return {
          status: 200,
          message: "No nodes to save",
          data: []
        };
      }

      // SECURITY: Validate all nodes before bulk insert
      const validatedNodes = mappedNodes.filter((node) => {
        if (!node.uid || !node.project_id) {
          logger.error('Invalid node data - missing required fields', { 
            action: 'SAVE_NODES',
            resource: `node:${node.uid}`,
          });
          return false;
        }
        return true;
      });

      if (validatedNodes.length === 0) {
        return {
          status: 400,
          message: "All nodes have invalid data"
        };
      }

      // SECURITY: Transform and validate data types
      const sqlValues = validatedNodes.map((node) => {
        const start_at = node.start_at ? new Date(node.start_at).toISOString() : null;
        const end_at = node.end_at ? new Date(node.end_at).toISOString() : null;
        
        return Prisma.sql`(
          ${node.uid}::text,
          ${node.project_id}::integer,
          ${node.image_url || null}::text,
          ${node.asset_id || null}::text,
          ${node.title || null}::text,
          ${node.type || null}::text,
          ${start_at}::timestamp,
          ${end_at}::timestamp,
          ${node.content || null}::text,
          ${node.position_x ?? null}::double precision,
          ${node.position_y ?? null}::double precision,
          ${node.handle_type || null}::text,
          NOW()::timestamp
        )`;
      });

      // SECURITY: Prisma.join() provides parameterized protection
      // This is a safe bulk operation, not vulnerable to SQL injection
      const result = await prisma.$queryRaw`
          INSERT INTO "Nodes" (
            uid,
            project_id,
            image_url,
            asset_id,
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
          VALUES ${Prisma.join(sqlValues)}
          ON CONFLICT (uid) 
          DO UPDATE SET 
            title = EXCLUDED.title,
            image_url = EXCLUDED.image_url,
            asset_id = EXCLUDED.asset_id,
            type = EXCLUDED.type,
            start_at = EXCLUDED.start_at,
            end_at = EXCLUDED.end_at,
            content = EXCLUDED.content,
            position_x = EXCLUDED.position_x,
            position_y = EXCLUDED.position_y, 
            handle_type = EXCLUDED.handle_type, 
            updated_at = NOW()
          RETURNING 
            title, 
            image_url, 
            type, 
            TO_CHAR(start_at, 'DD FMMonth YYYY') as start_date, 
            TO_CHAR(end_at, 'DD FMMonth YYYY') as end_date, 
            content, 
            position_x, 
            position_y, 
            handle_type, 
            uid
      `;

      if(result && Array.isArray(result) && result.length > 0){
          return {
              status: 200,
              message: "Success saved data",
              data: result as NodeDBType[]
          };
      } else{
          throw new Error("No nodes were saved")
      }
      
  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}


export async function getNodeIdByUid(uuid: string): Promise<returnDataType<{
    id: number
}>> {
    try {
        const result = await prisma.nodes.findFirst({
            where: {
                uid: uuid
            },
            select: {
                id: true
            }
        })

        if(result?.id){
            return {
                status: 200,
                message: "Sucessfully get id",
                data: result
            }
        } else{
            throw new Error("Id not found");
        }
        
    } catch (error) {
        return await serverSideErrorHandle(error)
  }
}