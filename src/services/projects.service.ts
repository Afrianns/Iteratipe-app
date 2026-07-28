"use server"

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { generalDataType, ProjectStoreType, labelType, ProjectType, returnDataType, WithPivotDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
interface actionDataType {
    id: number
}

interface ownerDataType {
    Projects: ProjectType[]
}

interface quickStatusType {
    total: number
    pending: number
    in_progress: number
    completed: number 
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
    
    try {

        const user = await prisma.users.findUnique({
            where: {
                clerk_user_id: userId as string
            },
            select: { id: true },
        });

        if(!user?.id) throw new Error("user not found");

        result = {
            status: 200,
            message: "successful",
            data: {
                id: user.id
            }
        }
        
    } catch (error) {
        return {
            status: 500,
            message: "An Error Occurs",
        }
    }


    try {
        await prisma.projects.create({
            data: {
                title: initialProject.title ?? Prisma.skip,
                clerk_user_id: userId,
                summary: initialProject.summary,
                Type: {
                    connect: initialProject.type
                },
                Status: {
                    connect: initialProject.status
                },
                Users: {
                    connect: result.data
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
                id: true
            }
        });

        result = {
            status: 200,
            message: "successful"
        }

    } catch (error) {
        return {
            status: 500,
            message: "An Error Occurs",
        }
    }

    return result;
}

export async function getCurrentUserProjects(userId: string): Promise<returnDataType<ownerDataType>> {

    try {
        const result = await prisma.users.findUnique({
            where: { clerk_user_id: userId },
            select: { 
                Projects: {
                    include: {
                        Status: true,
                        Type: true,
                        Users: {
                            select: {
                                id: true,
                                full_name: true,
                                clerk_user_id: true
                            }
                        }
                    }
                }, 
            }
        })


        if(result){
            return {
                status: 200,
                message: "Successfully",
                data: result
            }
        } else{
            throw new Error("not found!")
        }

    } catch (error) {
        return {
            status: 500,
            message: "An error has occur"
        }
    }
}


export async function getCurrentUserProjectsInfo(userId: string): Promise<returnDataType<quickStatusType>> {
    try {
        const result = await prisma.users.findUnique({
            where: { clerk_user_id: userId },
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

export async function getProjectDetailById(projectUid: string): Promise<returnDataType<WithPivotDataType>> {
    
    try {
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
                        clerk_user_id: true,

                    }
                }
            }
        })

        if(result){
            return {
                status: 200,
                message: "Successfuly get project",
                data: {...result, Project_tags: remapPivotData(result.Project_tags, "Tags"), Project_tools: remapPivotData(result.Project_tools, "Tools")}
            }

        } else{
            throw new Error("No project found")
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "An error occur"
        }
    }
}


type GeneralTypes = Omit<ProjectStoreType,  "visibility" | "disable_comments" | "client_name"> & {
    id: number
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
        console.log(error)

        return {
            status: 500,
            message: "there is an error occur"
        }
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