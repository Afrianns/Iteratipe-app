import { prisma } from "@/lib/db";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { labelType, returnDataType } from "@/types/types";



export default async function getTypesFn(query?: string): Promise<returnDataType<labelType[]>> {
    try {
        const result = await prisma.types.findMany({
            take: 10,
            where: {
                name: {
                    contains: query?.trim(),
                    mode: "insensitive"
                }
            }
        });
        if(result){
            return {
                status: 200,
                message: "Success retrieved data",
                data: result
            };
        } else{
            throw new Error("error while fetching data")
        }
        
    } catch (error) {
        return tempErrorHandle(error)
    }
}