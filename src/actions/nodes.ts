"use server"

import { Prisma } from "@/generated/prisma/client";
import { uuidRegex } from "@/lib/regexHelpers";
import { tempErrorHandle } from "@/lib/tempErrorHandle";
import { saveCurrentStateNodes } from "@/services/nodes.service";
import { syncAndDelete, syncAndDeleteDBWithLocal } from "@/services/syncTimeline.service";

import { returnDataType, timelineNodeType } from "@/types/types";
import { Sql } from "@prisma/client/runtime/client";

export const autoUpdateNodes = async (projectUid: string, Nodes: timelineNodeType[]): Promise<returnDataType<{
    nodes: timelineNodeType[]
}>> => {

    let mappedNodes: Sql[] = []

    // mapping nodes to sql format
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
            return {
                status: 500,
                message: "node id is not valid"
            };
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

    // syncing by delete
    try {
        const result = await syncAndDeleteDBWithLocal("Nodes", Nodes);

        if(result.status == 200){
            console.log(result);
        }
        
        if(result.status == 500){
            throw new Error("Failed to fetch");   
        }
    } catch (error) {
        return tempErrorHandle(error);
    }

    try {
        if(mappedNodes.length > 0){

            const result = await saveCurrentStateNodes(mappedNodes)
            
            if(result.status == 200 && result.data){

                console.log("node: ",result.data)
                let mappedTimelineNodes: timelineNodeType[] = result.data.map((node) => {
                    return {
                        id: node.uid,
                        position: {x: Number(node.position_x), y: Number(node.position_y)},
                        data: { 
                            handleType: node.handle_type,
                            title: node.title,
                            type: node.type,
                            start_at: node.start_date,
                            end_at: node.end_date,
                            content: node.content
                        },
                        origin: [0.5, 0.5],
                        type: 'cardNode',
                    } as timelineNodeType
                })

                return {
                    status: 200,
                    message: "Successfuly updated nodes",
                    data: {
                        nodes: mappedTimelineNodes
                    }
                }
            } 
        }


        throw new Error("An error occur");
    } catch (error) {
        return tempErrorHandle(error);
    }
}

