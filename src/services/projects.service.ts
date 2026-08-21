"use server"

import { handleTypeEnum, Prisma } from "@/generated/prisma/client";
import { convertDate } from "@/lib/convertDate";
import { prisma } from "@/lib/db";
import { serverSideErrorHandle } from "@/lib/serverErrorHandle";
import { handleEnum } from "@/types/enum";
import { ProjectStoreType, labelType, returnDataType, timelineNodeType, DBSingleProjectByID, ProjectPreviewType, VISIBLE } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { Decimal } from "@prisma/client/runtime/client";
import { Edge } from "@xyflow/react";
import { getUserID } from "./user.service";
import { previewCardDataQuery } from "@/lib/prismaQuery";


interface actionDataType {
    uid: string
}

interface quickStatusType {
    total: number
    pending: number
    in_progress: number
    completed: number 
}


export async function getAllProjects(): Promise<returnDataType<ProjectPreviewType[]>> {
    const { userId } = await auth()
    let userDbId: number = 0;

    try {
        if(userId){
            const resultUserId = await getUserID(userId)
        
            if(resultUserId.status == 200 && resultUserId.data?.id){
                userDbId = resultUserId.data.id
            } else{
                throw new Error("User id not found. Please try again later!")
            }

        }

        const result = await prisma.projects.findMany(previewCardDataQuery(userDbId))

        return {
            status: 200,
            message: "Sucessfully retrieved",
            data: result as ProjectPreviewType[]
        }

        

    } catch (error) {
        return await serverSideErrorHandle(error)
    }
}

export async function getProjectIDbyUID(projectUid: string): Promise<returnDataType<{
    id: number
} | null>> {
    try {
        return await prisma.projects.findFirst({
            where: {
                uid: projectUid
            },
            select: {
                id: true
            }
        }).then((result) => {
            return {
             status: 200,
             message: "Sucessfully retrieved",
             data: result
            }
        }).catch((err) => {
            throw new Error(err)
        })
    } catch (error) {
        return await serverSideErrorHandle(error)
    }
}

export async function saveProject(initialProject: ProjectStoreType): Promise<returnDataType<actionDataType>> {
    
    const { userId } = await auth()

    if(!userId) {
        return {
            status: 500,
            message: "User not found",
        }
    }
    
    let result: returnDataType<actionDataType> = {
        status: 200,
        message: "successful"
    }
    
    let userDbId = {} as { id: number }
    try {

        const user = await prisma.users.findUnique({
            where: {
                clerk_user_id: userId as string
            },
            select: { id: true },
        });

        if(!user?.id) throw new Error("user not found");

        userDbId = {
            id: user.id
        }
        
    } catch (error) {
        return await serverSideErrorHandle(error)
    }

    try {
        const projectResult = await prisma.projects.create({
            data: {
                title: initialProject.title,
                clerk_user_id: userId,
                summary: initialProject.summary.replace(/[\u2014\u2013]/g, '-'),
                Type: {
                    connect: initialProject.type
                },
                Status: {
                    connect: initialProject.status
                },
                Users: {
                    connect: userDbId
                },
                Project_tags: {
                    create: initialProject.tags
                },
                Project_tools: {
                    create: initialProject.tools
                },
                visibility: initialProject.visibility,
                disable_comments: initialProject.disable_comments,
                client_name: initialProject.client_name
            },
            select: {
                uid: true
            }
        });

        result = {
            status: 200,
            message: "successful",
            data: {
                uid: projectResult.uid
            }
        }

    } catch (error) {
        return await serverSideErrorHandle(error)
    }

    return result;
}

export async function getCurrentUserProjects(clerkUserId: string): Promise<returnDataType<ProjectPreviewType[]>> {

    let userId = 0;

    try {
        const resultUserId = await getUserID(clerkUserId);

        if(resultUserId.status == 200 && resultUserId.data){
            userId = resultUserId.data.id
        } else{
            throw new Error("user ID not found");
            
        }

        const result = await prisma.users.findUnique({
            where: { 
                id: userId 
            },
            select: { 
                Projects: {
                    ...previewCardDataQuery(userId),
                }
                
            }
        })


        if(result){
            return {
                status: 200,
                message: "Successfully",
                data: result.Projects
            }
        } else{
            throw new Error("not found!")
        }

    } catch (error) {
        return await serverSideErrorHandle(error)
    }
}


export async function getAuthProjectCounts(clerkUserId: string): Promise<returnDataType<quickStatusType>> {
    try {
        const result = await prisma.users.findUnique({
            where: { clerk_user_id: clerkUserId },
            select: { 
                Projects: {
                    select: {
                        id: true,
                        Status: true
                    }
                }
            }
        })

        if(result?.Projects){
            return {
                status: 200,
                message: "Successful Fetch",
                data: {
                    total: result.Projects.length,
                    pending: filterProject(result.Projects, "Pending"),
                    in_progress: filterProject(result.Projects, "In-progress"),
                    completed: filterProject(result.Projects, "Completed") 
                }
            }
        } else {
            throw new Error("No project found");
        }
    } catch (error) {
        return {
            status: 500,
            message: "An Error Occur",
            data: {
                total: 0,
                pending: 0,
                in_progress: 0,
                completed: 0
            }
        }
    }
}

// count total for each status in projects
const filterProject = (projects: { id: number;
    Status: {
        id: number;
        name: string;
    } | null }[], params: string) => {
    return projects.filter((project) => project.Status?.name == params).length
}

export async function getProjectDetailById(projectUid: string): Promise<returnDataType<DBSingleProjectByID>> {
    
    const { isAuthenticated, userId } = await auth()

    let userDbId = 0

    try {

        if(userId){            
            const result = await getUserID(userId)

            if(result.status == 200 && result.data){
                userDbId = result.data?.id
            }
        }

        console.log("checking ",userId, userDbId)

        // if(userDbId == 0) if only there is no user id - 0, or it will get those user with id 0

        let result = await prisma.projects.findFirst({
            where: {
                uid: projectUid
            },
            include: {
                Status: true,
                Type: true,
                Project_tags: {
                    include: {
                        Tags: true
                    }
                },
                Project_tools: {
                    include: {
                        Tools: true
                    }
                },
                Users: {
                    select: {
                        id: true,
                        full_name: true,
                        username: true,
                        Followers: {
                            where: {
                                following_id: userDbId
                            },
                            select: {
                                id: true
                            },
                            take: 1
                        }
                    }
                },
                Nodes: {
                    where: !isAuthenticated ? {
                        AND: [
                            {content: { not: null }},
                            {content: { not: "" }},
                            {title: { not: null }},
                            {title: { not: "" }},
                            {type: {not: null}},
                            {type: {not: ""}},
                            {start_at: { not: null }},
                            {end_at: { not: null }}
                        ]
                    } : Prisma.skip
                },
                Edges: true
            }
        })

        if(result){
            const initialInfo = {
                summary: result.summary,
                type: result.Type,
                client_name: result.client_name,
                tags: remapPivotData(result.Project_tags, "Tags"),
                tools: remapPivotData(result.Project_tools, "Tools"),
            }
            return {
                status: 200,
                message: "Successfuly get project",
                data: { 
                    // id: result.id,
                    projectTitleInfo: {
                        title: result.title,
                        type: result.Type,
                    },
                    overviewInfo: {
                        id: result.id,
                        user: result.Users,
                        ...initialInfo
                    },
                    settingInfo: isAuthenticated ? {
                        data: {
                            id: result.id,
                            title: result.title,
                            status: result.Status,
                            visibility: result.visibility,
                            disable_comments: result.disable_comments,
                            ...initialInfo
                        }
                    } : undefined,
                    Nodes: remapNodes(result.Nodes),
                    Edges: remapEdges(result.Edges),
                    created_at: result.created_at,
                    updated_at: result.updated_at
                }
            }

        } else{
            throw new Error("No project found")
        }
    } catch (error) {
        return await serverSideErrorHandle(error)
    }
}

export async function updateProjectById(clerkUserId: string, newUpdated: any): Promise<returnDataType<{
    projectId: number
}>> {

    
    try {
        const result = await prisma.projects.update({
            where: {
                id: newUpdated.id,
                clerk_user_id: clerkUserId
            },
            data: {
                // GENERAL SETTING
                title: newUpdated.title ?? Prisma.skip,
                summary: newUpdated.summary ?? Prisma.skip,
                Type: {
                    connect: newUpdated.type ?? Prisma.skip
                },
                Status: {
                    connect: newUpdated.status ?? Prisma.skip
                },
                Project_tags: newUpdated.tags && {
                    deleteMany: {},
                    create: newUpdated.tags 
                } || Prisma.skip,
                Project_tools: newUpdated.tools && {
                    deleteMany: {},
                    create: newUpdated.tools
                } || Prisma.skip,

                // VISIBILITY SECTION
                visibility: newUpdated.visibility ?? Prisma.skip,
                disable_comments: newUpdated.disable_comments ?? Prisma.skip,
                client_name: newUpdated.client_name ?? Prisma.skip,
            },
            select: {
                id: true
            }
        })
        
        if(result.id){   
            return {
                status: 200,
                message: "Successfully updated project",
                data: {
                    projectId: result.id
                }
            }
        } else{
            throw new Error("An error occur, please try again!");
            
        }

    } catch (error) {
        return await serverSideErrorHandle(error)
    }
}

interface UnorganizedObjType {
    [key: string]: any
}

const remapPivotData = (unorganizedObj: UnorganizedObjType[], m: string) => {
    let organizedObj: labelType[] = []
    unorganizedObj.map((obj) => {
        organizedObj.push(obj[m] as labelType)
    })
    return organizedObj;
}

const remapNodes = <T extends {
  uid: string
  title: string | null
  updated_at: Date | null
  type: string | null
  project_id: number
  image_url: string | null
  start_at: Date | null
  end_at: Date | null
  content: string | null
  published_at: Date | null
  position_x: Decimal
  position_y: Decimal
  handle_type: handleTypeEnum;
}>(nodes: T[]): timelineNodeType[] => {

    let newNodes = nodes.map((node: T): timelineNodeType => {
        return {
            id: node.uid,
            position: {
                x: Number(node.position_x),
                y: Number(node.position_y),
            },
            data: {
                image_url: node.image_url || "",
                title: node.title || "",
                type: node.type || "",
                content: node.content || "",
                start_at: node.start_at ? convertDate(new Date(node.start_at)) : "",
                end_at: node.end_at ? convertDate(new Date(node.end_at)) : "",
                handleType: node.handle_type as handleEnum,
                // updated_at: node.updated_at,
                // published_at: node.published_at
            },
            origin: [0.5, 0.5], 
            type: "cardNode"
        }
    })

    return newNodes
}


const remapEdges = <T extends 
    { 
        source: string; 
        target: string; 
        id: number; 
        uid: string; 
        project_id: number; 
    }
>(edges: T[]): Edge[] => {

    const newEdges = edges.map((edge: T): Edge => {

        return {
            id: `e-${edge.source}-to-${edge.target}`,
            source: edge.source,
            target: edge.target,
    //      uid: edge.uid,
    //      project_id: edge.project_id
        }
    })

    return newEdges;
 
}