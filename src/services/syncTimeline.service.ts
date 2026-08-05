"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { returnDataType, timelineNodeType } from "@/types/types";


export const syncAndDeleteDBWithLocal = async <T extends { id: string }>(tbName: string, items: T[], projectUid: string) => {
    
    let nodeIDs = items.map((node: T) => node.id);

    if(nodeIDs.length <= 0 && items.length <= 0){
        nodeIDs = []
    }
    
    try {
        const result = await syncAndDelete(tbName, nodeIDs, projectUid)

        if(result.status == 200){
            return {
                status: 200,
                message: "Sync delete sucessfuly"
            }
        }

        throw new Error("An error occur");

    } catch (error) {
        return tempErrorHandle(error);
    }

}

interface DeletedRow {
    id: number
}

export async function syncAndDelete(dbName: string, mappedID: string[], projectUid: string): Promise<returnDataType<DeletedRow[]>> {
  
   try {
        let result: DeletedRow[] = [];
    
        if(mappedID.length > 0){
          result = await prisma.$queryRaw<DeletedRow[]>`
                DELETE FROM "${Prisma.raw(dbName)}" WHERE uid NOT IN (${Prisma.join(mappedID)}) AND project_id = (SELECT id FROM "Projects" WHERE uid = ${projectUid})
                RETURNING id`;
        }

        if(mappedID.length <= 0){
          result = await prisma.$queryRaw<DeletedRow[]>`
                DELETE FROM "${Prisma.raw(dbName)}" WHERE project_id = (SELECT id FROM "Projects" WHERE uid = ${projectUid}) RETURNING id`;
        }
      
      if(result && Array.isArray(result) && result.length > 0){
          return {
              status: 200,
              message: `Successfully deleted ${dbName.toLowerCase()}`,
              data: result
          };
        } else if (result && Array.isArray(result) && result.length === 0){
          return {
              status: 200,
              message: `No ${dbName.toLowerCase()} to deleted`,
          };
      } else{
          throw new Error("error while fetching data")
      }
      
  } catch (error) {
    return tempErrorHandle(error);
  } 
} 