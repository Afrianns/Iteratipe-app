"use server";

import getStatusFn from "@/services/status.service";
import getTagsFn from "@/services/tags.service";
import getToolsFn from "@/services/tools.service";
import getTypesFn from "@/services/types.service";
import { labelType } from "@/types/types";

export async function getAllTags() {
    let tags = await getTagsFn()
    let remapTag: labelType[] = [];

    tags.forEach((tag) => {
        remapTag.push(tag)
    })

    return remapTag
}

export async function getAllTools() {
    let tools = await getToolsFn()
    let remapTools: labelType[] = [];

    tools.forEach((tool) => {
        remapTools.push(tool)
    })

    return remapTools
}


export async function getAllStatus() {
    let status = await getStatusFn()
    return status

}
export async function getAllTypes() {
    let types = await getTypesFn()
    // return {...types, created_at: 'aasdsajkd'}
    return types
}