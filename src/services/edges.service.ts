"use server"

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { returnDataType } from "@/types/types";
import { Sql } from "@prisma/client/runtime/client";

type DBEdgeType = {
    uid: string,
    source: string,
    target: string
}

export async function saveCurrentStateEdges(mappedEdges: Sql[]): Promise<returnDataType<DBEdgeType[]>> {

  try {
      const result = await prisma.$queryRaw`
          INSERT INTO "Edges" (
            uid,
            project_id,
            source,
            target
          )
          VALUES ${Prisma.join(mappedEdges)}
          ON CONFLICT (uid) 
          DO UPDATE SET 
            uid = EXCLUDED.uid,
            project_id = EXCLUDED.project_id,
            source = EXCLUDED.source,
            target = EXCLUDED.target
          RETURNING uid, source, target
      `;

      if(result){
          return {
              status: 200,
              message: "Success retrieved data",
              data: result as DBEdgeType[]
          };
      } else{
          throw new Error("error while fetching data")
      }
      
  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}