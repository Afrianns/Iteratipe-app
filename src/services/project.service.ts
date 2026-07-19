import { prisma } from "@/lib/db";
import { InitialProjectType, ProjectType, returnDataType } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

interface actionDataType {
    id: number
}

export async function saveProject(initialProject: InitialProjectType): Promise<returnDataType<actionDataType>> {
    
    let result: returnDataType<actionDataType> = {
        status: 200,
        message: "successful"
    }
    
    try {
        const { userId } = await auth()

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
                title: initialProject.title,
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

interface resultType {
    full_name: string
    Projects: ProjectType[]
}

interface dataType {
    status: number
    message: string
    data?: resultType
}

export async function getCurrentUserProjects(userId: string): Promise<dataType> {


    try {
        const result = await prisma.users.findUnique({
            where: { clerk_user_id: userId },
            select: { full_name: true, Projects: {
                include: {
                    Status: true,
                    Type: true
                }
            }, }
        })

        console.log(result)

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