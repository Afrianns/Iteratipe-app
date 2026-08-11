"use server"

import { NodeDataSchema } from "@/lib/validations"
import axios from "axios"
import { updateNode } from "./nodes"
import { handleEnum } from "@/types/enum"
import { tempErrorHandle } from "@/lib/tempErrorHandle"
import z from "zod"
import { timelineNodeType } from "@/types/types"
import { convertDateToISOString } from "@/lib/convertDate"

export interface ValidationMessagesType {
    title?: string[]
    type?: string[]
    start_at?: string[]
    end_at?: string[]
    content?: string[]
}

export interface FormUpdateType {
    status: number
    message: string
    success?: timelineNodeType
    error?: ValidationMessagesType
}

export const storeImage = async (file: File) => {
    const formData  = new FormData()

    console.log("check file:", file)

    // formData.append("file", file)

    // try {
    //     const response = await axios.post("/api/upload", formData)

    //     if(response.status == 200){
    //         return {
    //             status: 200,
    //             image_url: response.data.secure_url
    //         }
    //     } else{
    //         throw new Error(response.statusText);
            
    //     }
    // } catch (error) {
    //     if(error instanceof Error){
    //         console.log(error.message)
    //     }
    //     return {
    //         status: 500
    //     }
    // }
}

export const saveCurrentData = async (prevState: FormUpdateType, formData: FormData): Promise<FormUpdateType> => {    

    const nodeId = formData.get("node_id") as string

    if(!nodeId) {
        return {
            status: 300,
            message: "No id present"
        }
    } 

    
    let nodeData = {
        id: formData.get("node_id") as string,
        project_id: formData.get("project_id") as string,
        title: formData.get("title") as string,
        image_url: formData.get("image_url") as string,
        type: formData.get("type") as string,
        content: formData.get("content") as string,
        start_at: formData.get("start_at"),
        end_at: formData.get("end_at"),
        handle_type: formData.get("handle_type") as handleEnum,
        position_x: formData.get("pos_x"),
        position_y: formData.get("pos_y")
    }
    const validation = NodeDataSchema.safeParse(nodeData)

    try {
        let remappedTimelineNodeData = {
            id: nodeData.id,
            position: {
                x: Number(nodeData.position_x),
                y: Number(nodeData.position_y)
            },
            data: {
                handleType: nodeData.handle_type,
                title: nodeData.title,
                type: nodeData.type,
                start_at: nodeData.start_at ? convertDateToISOString(nodeData.start_at as string) : null,
                end_at: nodeData.end_at ? convertDateToISOString(nodeData.end_at as string) : null,
                content: nodeData.content,
                image_url: nodeData.image_url
            }
        } as timelineNodeType

        console.log("mapped: ", remappedTimelineNodeData)
        
        if(validation.success){

            const result = await updateNode(nodeData.project_id, remappedTimelineNodeData)
        

            if(result.status == 200 && result.data){
                return {
                    status: 200,
                    message: "Successfuly updated",
                    success: result.data
                }
            } else{
                throw new Error("Failed to update");
                
            }
        } else{
            return {
                status: 300,
                message: "data is not valid",
                error: z.flattenError(validation.error).fieldErrors
            }
        }
            // console.log("checking: ",globalEdges, globalNodes)
        // } else{
            // setValidationMessages(z.flattenError(validation.error).fieldErrors);
        // }

    } catch (error) {
        if(error instanceof Error){
            console.log(error.message)
        }
        return {
            status: 500,
            message: "An error occur"
        }
        // return tempErrorHandle(error)
    }

};