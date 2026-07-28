"use server"

import { prisma } from "@/lib/db";
import { labelType, returnDataType } from "@/types/types";

export async function getTagsFn(query?: string): Promise<returnDataType<labelType[]>> {
    try {
        const result = await prisma.tags.findMany({
            take: 20,
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
        return {
            status: 500,
            message: "An Error Occur"
        };
    }
}

export async function getProjectTags(projectId: number) {

    try {
        const tags = await prisma.project_tags.findMany({
            where: {
                project_id: projectId
            },
            select: {
                Tags: true
            }
        })
        return {
            status: 200,
            message: "Successfuly",
            tags: tags
        }
        
    } catch (error) {
        return {
            status: 500,
            message: "An Error Occur",
        }
        
    }
}

export async function getProjectTools(projectId: number) {

    try {
        const tools = await prisma.project_tools.findMany({
            where: {
                project_id: projectId
            },
            select: {
                Tools: true
            }
        })

        return {
            status: 200,
            message: "Successfuly",
            tools: tools
        }
        
    } catch (error) {
        return {
            status: 500,
            message: "An Error Occur",
        }
        
    }
}