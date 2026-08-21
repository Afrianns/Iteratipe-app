"use server"

import { Prisma } from "@/generated/prisma/client";
import { convertDateToISOString } from "@/lib/convertDate";
import { prisma } from "@/lib/db";
import { uuidRegex } from "@/lib/regexHelpers";
import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { saveCurrentStateNodes } from "@/services/nodes.service";
import { getProjectIDbyUID } from "@/services/projects.service";
import { syncAndDeleteDBWithLocal } from "@/services/syncTimeline.service";

import { returnDataType, timelineNodeType } from "@/types/types";
import { Sql } from "@prisma/client/runtime/client";
import axios from "axios";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL

export const autoUpdateNodes = async (projectUid: string, Nodes: timelineNodeType[]): Promise<returnDataType<{
    nodes: timelineNodeType[]
}>> => {

    let mappedNodes: Sql[] = []

    // mapping nodes to sql format
    for (const node of Nodes) {
    
        const isRealUuid = uuidRegex.test(String(node.id));
        
        const startDate = node.data.start_at ? convertDateToISOString(node.data.start_at) : null;
        const endDate = node.data.end_at ? convertDateToISOString(node.data.end_at) : null;

        let uid: Sql

        if(isRealUuid){
            uid = Prisma.sql`${node.id}::uuid`
        } else{
            return {
                status: 500,
                message: "node id is not valid"
            };
        }

        
        if(node.data.image_url.trim() == "" || node.data.image_url == undefined) {
            const asset_id: string = await prisma.$queryRaw`SELECT asset_id FROM "Nodes" WHERE uid = ${uid}`

            if(asset_id.length > 0) {
                const response = await axios.delete(`${APP_URL}/api/image`, {
                    data: asset_id[0]
                })
                
                if(response.status == 200) {
                    console.log("response ",response.data)
                } 
    
                if(response.status != 200) 
                    return {
                        status: 500,
                        message: "Something went wrong while updating the image"
                    };
            }

        }

        mappedNodes.push(Prisma.sql`(
            ${uid},
            (SELECT id FROM "Projects" WHERE uid = ${projectUid}),
            ${node.data.image_url},
            COALESCE(${node.data.asset_id}, (SELECT asset_id FROM "Nodes" WHERE uid = ${uid})),
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
        const result = await syncAndDeleteDBWithLocal("Nodes", Nodes, projectUid, ["id", "asset_id"]);

        console.log(result)

        if(result.status == 200 && result.data){

            await result.data.forEach( async (node: {id: number, asset_id: string}) => {
                if(node.asset_id != null || node.asset_id != "") {
                    const response = await axios.delete(`${APP_URL}/api/image`, {
                        data: {
                            asset_id: node.asset_id
                        }
                    })

                    if(response.status == 200) {
                        console.log("response ",response.data)
                    } 
                    if(response.status != 200) 
                        throw new Error(response.statusText);
                }
            });
        }
        if(result.status == 500){
            throw new Error(result.message);   
        }
    } catch (error) {
        return await serverSideErrorHandle(error);
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
                            start_at: node.start_date || "",
                            end_at: node.end_date || "",
                            image_url: node.image_url,
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
            } else{
                throw new Error(result.message)
            }
        }


        return {
            status: 200,
            message: "no syncing happend",
            data: {
                nodes: []
            }
        }
        
    } catch (error) {
        return await serverSideErrorHandle(error);
    }
}

export const updateNode = async (projectUid: string, nodeToStore: timelineNodeType): Promise<returnDataType<timelineNodeType>>  => {

    let projectId = 0
    let uuid = "";
    const isRealUuid = uuidRegex.test(String(nodeToStore.id));

    try {
        if(isRealUuid){
            uuid = nodeToStore.id
        } else{
            throw new Error("Id is not valid");
        }

        const resultId = await getProjectIDbyUID(projectUid);

        if(resultId.status == 200 && resultId.data){
            projectId = resultId.data?.id
        }


        if(projectId == 0 || resultId.status != 200){
            throw new Error("Cannot find project");
        }

        const node = await prisma.nodes.upsert({
            where: {
                uid: uuid
            },
            update: {
                position_x: nodeToStore.position.x,
                position_y: nodeToStore.position.y,
                handle_type: nodeToStore.data.handleType,
                title: nodeToStore.data.title,
                type: nodeToStore.data.type,
                start_at: nodeToStore.data.start_at,
                end_at: nodeToStore.data.end_at,
                image_url: nodeToStore.data.image_url,
                asset_id: nodeToStore.data.asset_id as string,
                content: nodeToStore.data.content
            },
            create: {
                uid: uuid,
                project_id: projectId,
                position_x: nodeToStore.position.x,
                position_y: nodeToStore.position.y,
                handle_type: nodeToStore.data.handleType,
                title: nodeToStore.data.title,
                type: nodeToStore.data.type,
                start_at: nodeToStore.data.start_at,
                end_at: nodeToStore.data.end_at,
                image_url: nodeToStore.data.image_url,
                asset_id: nodeToStore.data.asset_id as string,
                content: nodeToStore.data.content,
            }
        })

        if(node){
            return {
                status: 200,
                message: "Sucessful update node",
                data: {
                    id: node.uid,
                    position: {x: Number(node.position_x), y: Number(node.position_y)},
                    data: { 
                        handleType: node.handle_type,
                        title: node.title,
                        type: node.type,
                        start_at: node.start_at?.toDateString(),
                        end_at: node.end_at?.toDateString(),
                        image_url: node.image_url,
                        content: node.content
                    },
                    origin: [0.5, 0.5],
                    type: 'cardNode',
                } as timelineNodeType
            }
        } else{
            throw new Error("Failed to update node");
            
        }
    } catch (error) {
        return await serverSideErrorHandle(error);
    }
}