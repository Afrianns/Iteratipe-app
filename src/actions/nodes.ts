"use server"

import { Prisma } from "@/generated/prisma/client";
import { saveCurrentStateNodes, syncAndDeleteNodes } from "@/services/nodes.service";

import { returnDataType, timelineNodeType } from "@/types/types";
import { Sql } from "@prisma/client/runtime/client";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const autoUpdateNodes = async (projectUid: string, Nodes: timelineNodeType[]): Promise<returnDataType<{
    nodes: timelineNodeType[]
}>> => {

    let mappedNodes: Sql[] = []

    // syncing by delete
    try {
        const result = await syncAndDeleteNodeDBWithLocal(Nodes);

        if(result.status == 200){
            console.log(result);
        } 
        
        if(result.status == 500){
            throw new Error("Failed to fetch");   
        }
    } catch (error) {
        return {
            status: 500,
            message: "An error ocur, please try again later"
        }
    }

    for (const node of Nodes) {
    
        const isRealUuid = uuidRegex.test(String(node.id));
        
        const startDate = node.data.start_at ? new Date(node.data.start_at).toISOString() : null;
        const endDate = node.data.end_at ? new Date(node.data.end_at).toISOString() : null;
        
        const isTemp = String(node.id).startsWith('node_');

        let uid: Sql 

        if(isTemp){
            uid = Prisma.raw("DEFAULT")
        } else if(isRealUuid){
            uid = Prisma.sql`${node.id}::uuid`
        } else{
            throw new Error("node id is not valid");
        }

        mappedNodes.push(Prisma.sql`(
            ${uid},
            (SELECT id FROM "Projects" WHERE uid = ${projectUid}),
            ${null},
            ${node.data.title},
            ${node.data.type},
            ${startDate}::timestamp,
            ${endDate}::timestamp,
            ${node.data.content},
            ${node.position.x},
            ${node.position.y},
            ${node.data.handleType},
            NOW())`)
    }

    try {
        if(mappedNodes.length > 0){

            const result = await saveCurrentStateNodes(mappedNodes)
            
            if(result.status == 200 && result.data){

                let mappedTimelineNodes: timelineNodeType[] = result.data.map((node) => {
                    return {
                        id: node.uid,
                        position: {x: Number(node.position_x), y: Number(node.position_y)},
                        data: { 
                            handleType: node.handle_type,
                            title: node.title,
                            type: node.type,
                            start_at: node.start_at,
                            end_at: node.end_at,
                            content: node.content
                        },
                        origin: [0.5, 0.5],
                        type: 'cardNode',
                    } as timelineNodeType
                })

                return {
                    status: 200,
                    message: "Successfuly mapped",
                    data: {
                        nodes: mappedTimelineNodes
                    }
                }
            } 
        }


        throw new Error("An error occur");
    } catch (error) {
        return {
            status: 500,
            message: "An error ocur, please try again later"
        }   
    }
}



export const syncAndDeleteNodeDBWithLocal = async (nodes: timelineNodeType[]) => {
    const nodeUIDs = nodes.map((node: timelineNodeType) => uuidRegex.test(node.id) ? node.id : '').filter((data) => data.length > 2);
    
    if(nodeUIDs.length <= 0){
        return {
            status: 404,
            message: "No nodes found"
        }
    }
    
    try {
        const result = await syncAndDeleteNodes(nodeUIDs)

        if(result.status == 200){
            return {
                status: 200,
                message: "Sync delete sucessfuly"
            }
        }

        throw new Error("An error occur");

    } catch (error) {
        console.log("an error: ", error)
        return {
            status: 500,
            message: "An error ocur, please try again later"
        }
    }

}