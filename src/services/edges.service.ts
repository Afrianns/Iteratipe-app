"use server"

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { returnDataType } from "@/types/types";
import { logger } from "@/lib/logger";

type DBEdgeType = {
    uid: string,
    source: string,
    target: string
}

// SECURITY: Use raw SQL for performance but with proper validation
// Prisma.join() provides parameterization protection against SQL injection
export async function saveCurrentStateEdges(mappedEdges: any[]): Promise<returnDataType<DBEdgeType[]>> {

  try {
      if (!Array.isArray(mappedEdges) || mappedEdges.length === 0) {
        return {
          status: 200,
          message: "No edges to save",
          data: []
        };
      }

      // SECURITY: Validate all edges before bulk insert
      const validatedEdges = mappedEdges.filter((edge) => {
        if (!edge.uid || !edge.project_id || !edge.source || !edge.target) {
          logger.error('Invalid edge data - missing required fields', { 
            action: 'SAVE_EDGES',
            resource: `edge:${edge.uid}`,
          });
          return false;
        }
        return true;
      });

      if (validatedEdges.length === 0) {
        return {
          status: 400,
          message: "All edges have invalid data"
        };
      }

      // SECURITY: Transform and validate data types
      const sqlValues = validatedEdges.map((edge) => {
        return Prisma.sql`(
          ${edge.uid}::text,
          ${edge.project_id}::integer,
          ${edge.source}::text,
          ${edge.target}::text
        )`;
      });

      // SECURITY: Prisma.join() provides parameterized protection
      // This is a safe bulk operation, not vulnerable to SQL injection
      const result = await prisma.$queryRaw`
          INSERT INTO "Edges" (
            uid,
            project_id,
            source,
            target
          )
          VALUES ${Prisma.join(sqlValues)}
          ON CONFLICT (uid) 
          DO UPDATE SET 
            source = EXCLUDED.source,
            target = EXCLUDED.target,
            project_id = EXCLUDED.project_id
          RETURNING uid, source, target
      `;

      if(result && Array.isArray(result) && result.length > 0){
          return {
              status: 200,
              message: "Success saved data",
              data: result as DBEdgeType[]
          };
      } else{
          throw new Error("No edges were saved")
      }
      
  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}