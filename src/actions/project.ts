"use server"

import { settingsSchema } from "@/lib/validations";
import { generalDataType, generalSettingErrorsType, ProjectStoreType, returnDataType } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { saveProject } from "@/services/projects.service";
import { redirect } from "next/navigation";
import z from "zod";

export async function createInitialProject(data: generalDataType): Promise<{
  status: number
  message: string
  errorMessage?: generalSettingErrorsType,
  data?: {
    uid: string,
    title: string
  }
}> {

  let user = await currentUser()
  const secondValidated = settingsSchema.safeParse(data)
  
  if(!secondValidated.success){
      const errors = z.flattenError(secondValidated.error).fieldErrors;

      return {
        status: 300,
        message: "An error occur, data is not valid",
        errorMessage: errors
      }
  }

    let initialProjectsSetup: ProjectStoreType = {
      title: secondValidated.data.title,
      summary: secondValidated.data.summary,
      type: { id: secondValidated.data.type.id },
      status: { id: secondValidated.data.status.id },
      tags: secondValidated.data.tags.map((tag) => ({tag_id: tag.id})),
      tools: secondValidated.data.tools.map((tool) => ({tool_id: tool.id})),
      visibility: secondValidated.data.visibility,
      disable_comments: secondValidated.data.disable_comments,
      client_name: secondValidated.data.client_name,
  }

  if(user && user.id && user?.firstName && user?.lastName && user?.fullName && user?.primaryEmailAddressId && user?.imageUrl){
    let result = await saveProject(initialProjectsSetup)
    
    if(result.status == 200 && result.data?.uid){
      return {
        status: 200,
        message: "Successfuly created",
        data: {
          uid: result.data.uid,
          title: initialProjectsSetup.title
        }
      }
    }
  }

  return {
    status: 500,
    message: "Failed to save"
  }
}