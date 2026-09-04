"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { returnDataType } from "@/types/types";


export const syncAndDeleteDBWithLocal = async <T extends { id: string }>(tbName: string, items: T[], projectUid: string, itemToReturn: string[]) => {
    
    let nodeIDs = items.map((node: T) => node.id);

    if(nodeIDs.length <= 0 && items.length <= 0){
        nodeIDs = []
    }
    
    try {
        const result = await syncAndDelete(tbName, nodeIDs, projectUid, itemToReturn)

        if(result.status == 200){
            return {
                status: 200,
                message: result.message,
                data: result.data
            }
        }

        throw new Error("An error occur");

    } catch (error) {
        return await serverSideErrorHandle(error);
    }

}

interface DeletedRow {
    id: number
}

export async function syncAndDelete(dbName: string, mappedID: string[], projectUid: string, itemToReturn: string[]): Promise<returnDataType<DeletedRow[]>> {

    const rawFields = itemToReturn.map(field => Prisma.raw(`"${field}"`));
    const separatedReturningClause = Prisma.join(rawFields, ", ")

    try {
        let result: DeletedRow[] = [];
    
        if(mappedID.length > 0){
        result = await prisma.$queryRaw<DeletedRow[]>`
                DELETE FROM "${Prisma.raw(dbName)}" WHERE uid NOT IN (${Prisma.join(mappedID)}) AND project_id = (SELECT id FROM "Projects" WHERE uid = ${projectUid})
                RETURNING ${separatedReturningClause}`;
        }

        if(mappedID.length <= 0){
        result = await prisma.$queryRaw<DeletedRow[]>`
                DELETE FROM "${Prisma.raw(dbName)}" WHERE project_id = (SELECT id FROM "Projects" WHERE uid = ${projectUid}) RETURNING ${separatedReturningClause}`;
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
    return await serverSideErrorHandle(error);
  } 
} 