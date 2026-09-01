"use server"

import { NodeSchemaBE } from "@/lib/validations"
import axios from "axios"
import { updateNode } from "./nodes"
import { handleEnum } from "@/types/enum"
import { serverSideErrorHandle } from "@/lib/serverErrorHandle"
import z from "zod"
import { timelineNodeType } from "@/types/types"
import { prisma } from "@/lib/db"
import treeifyErrorHandling from "@/lib/treeifyErrorHandling"
import { getUserID } from "@/services/user.service"
import { auth } from "@clerk/nextjs/server"
import { isUserValidToUpdate } from "@/services/validation.service"

export interface ValidationMessagesType {
    title?: string[]
    type?: string[]
    start_at?: string[]
    end_at?: string[]
    content?: string[]
    image_url?: string[]
}

export interface FormUpdateType {
    status: number
    message: string
    success?: timelineNodeType
    error?: ValidationMessagesType
}


const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export const saveCurrentData = async (prevState: FormUpdateType, formData: FormData): Promise<FormUpdateType> => {    

    const nodeId = formData.get("node_id") as string

    const { isAuthenticated } = await auth()

    if(!isAuthenticated) {
        return {
            status: 401,
            message: "You're trespassing",
        }
    }
    if(!nodeId) {
        return {
            status: 300,
            message: "No id present"
        }
    }
    
    const project_id = formData.get("project_id") as string

    let nodeData = {
        id: formData.get("node_id") as string,
        position: {
            x: formData.get("pos_x") ? Number(formData.get("pos_x")) : null,
            y: formData.get("pos_y") ? Number(formData.get("pos_y")) : null
        },
        data: {
            handleType: formData.get("handle_type") as handleEnum,
            title: formData.get("title") as string,
            type: formData.get("type") as string,
            start_at: formData.get("start_at"),
            end_at: formData.get("end_at"),
            content: formData.get("content") as string,
            image_url: formData.get("image_url") as string,
            asset_id: formData.get("asset_id") as string
        },
        origin: [
            0.5,
            0.5
        ],
        type: "cardNode"
    } as timelineNodeType
    

    const validation = NodeSchemaBE.safeParse(nodeData)

    try {

        if(validation.success){
            
            const { data, status, message } = await isUserValidToUpdate(project_id)

            if(status != 200 && !data?.is_allowed) throw new Error(message);


            const deleteResult = await deleteImageByAssetId(nodeData.id, nodeData.data.image_url)
            
            if(deleteResult.status == 500){
                throw new Error(deleteResult.message);
            }


            if(nodeData.data.asset_id || nodeData.data.image_url) {
                if(!nodeData.data.asset_id && !nodeData.data.image_url)
                    throw new Error("Something went wrong.");
            }


            let remappedTimelineNodeData = {
                id: validation.data.id,
                position: {
                    x: validation.data.position.x,
                    y: validation.data.position.y
                },
                data: {
                    handleType: validation.data.data.handleType,
                    title: validation.data.data.title,
                    type: validation.data.data.type,
                    start_at: validation.data.data.start_at ? new Date(validation.data.data.start_at as string).toISOString() : null,
                    end_at: validation.data.data.end_at ? new Date(validation.data.data.end_at as string).toISOString() : null,
                    content: validation.data.data.content,
                    image_url: validation.data.data.image_url,
                    asset_id: validation.data.data.asset_id
                }
            } as timelineNodeType

            const result = await updateNode(project_id, remappedTimelineNodeData)
        
            if(result.status == 200 && result.data){
                return {
                    status: 200,
                    message: "Successfuly updated",
                    success: result.data as timelineNodeType
                }
            } else{
                throw new Error("Failed to update");
            }
        } else{
            return {
                status: 500,
                message: "data is not valid",
                error: treeifyErrorHandling(z.treeifyError(validation.error))
            }
        }

    } catch (error) {
        if(error instanceof Error){
            return {
                status: 500,
                message: error.message
            }
        }
        return {
            status: 500,
            message: "An error occur"
        }
    }

};


const deleteImageByAssetId = async (nodeId: string, imageUrl: string) => {

    try {
        const result = await prisma.nodes.findFirst({
            where: {
                uid: nodeId
            },
            select: {
                asset_id: true
            }
        })

        if(result?.asset_id){
            if((result.asset_id && imageUrl) || (result.asset_id && !imageUrl)) {
                const response = await axios.delete(`${APP_URL}/api/image`, {
                    data: {
                        asset_id: result.asset_id
                    }
                })

                if(response.status == 200){
                    return {
                        status: 200,
                        message: "updated image"
                    }
                } else{
                    throw new Error(response.statusText);
                }
            }
        }

        return {
            status: 200,
            message: "no changes"
        }
        
    } catch (error) {
        return await serverSideErrorHandle(error)
    }
} 