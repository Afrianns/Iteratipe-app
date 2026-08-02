"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { returnDataType, timelineNodeType } from "@/types/types";


export const syncAndDeleteDBWithLocal = async <T extends { id: string }>(tbName: string, items: T[]) => {
    
    let nodeIDs = items.map((node: T) => node.id);

    if(nodeIDs.length <= 0 && items.length <= 0){
        nodeIDs = ["__EMPTY_UIDS_"]
    }
    
    try {
        const result = await syncAndDelete(tbName, nodeIDs)

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

export async function syncAndDelete(dbName: string, mappedID: string[]): Promise<returnDataType<{
    id: number
}[]>> {
  
   try {
      const result = await prisma.$queryRaw`
                DELETE FROM "${Prisma.raw(dbName)}" WHERE uid NOT IN (${Prisma.join(mappedID)})
                RETURNING id`;
      
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
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      console.log(error)
    }
    return tempErrorHandle(error);
  } 
} 