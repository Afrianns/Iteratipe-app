"use server"

import { prisma } from "@/lib/db";
import { returnDataType, UserWebhookType } from "@/types/types";

interface actionDataType {
    clerk_user_id: string
}

export default async function syncUser(params: UserWebhookType): Promise<returnDataType<actionDataType>> {
    let resultAction: returnDataType<actionDataType>

    try {
        const dbActionResult = await prisma.users.upsert({
            where: { clerk_user_id: params.id },
            update: { 
                first_name: params.first_name,
                last_name: params.last_name,
                full_name: params.full_name,
                image_url: params.image_url
            },
            create: { 
                clerk_user_id: params.id,
                first_name: params.first_name,
                last_name: params.last_name,
                full_name: params.full_name,
                email: params.email,
                image_url: params.image_url
            },
            select: {
                id: true,
                clerk_user_id: true
            }
        })

        resultAction = {
            status: 200,
            message: "Successfully",
            data: {
                clerk_user_id: dbActionResult.clerk_user_id
            }
        }

    } catch (er) {
        resultAction = {
            status: 500,
            message: "Failed"
        }
        
    }

    return resultAction
}