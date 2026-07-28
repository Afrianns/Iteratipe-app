"use server";

import getStatusFn from "@/services/status.service";
import {getTagsFn} from "@/services/tags.service";
import getToolsFn from "@/services/tools.service";
import getTypesFn from "@/services/types.service";
import { labelType, returnDataType } from "@/types/types";


export async function getLabels(query: string, name: string): Promise<returnDataType<labelType[]>> {

    switch (name) {
        case "type":
            return await getTypesFn(query)
        case "status":
            return await getStatusFn(query)
        case "tags":
            return await getTagsFn(query)
        case "tools":
            return await getToolsFn(query)
        default:
            return {
                status: 500,
                message: "An error occur, failed to retrieved data",
                data: []
            }
    }
}

export async function getAllTags() {
    let tags = await getTagsFn()
    // let remapTag: labelType[] = [];

    // tags.forEach((tag) => {
    //     remapTag.push(tag)
    // })

    return tags
}

export async function getAllTools() {
    let tools = await getToolsFn()
    // let remapTools: labelType[] = [];

    // tools.forEach((tool) => {
    //     remapTools.push(tool)
    // })

    return tools;
}


export async function getAllStatus() {
    let status = await getStatusFn()
    return status

}


export async function getAllTypes() {
    let types = await getTypesFn()
    return types
}