import { generalSettingSchema, settingsSchema, updateSettingSchema } from "@/lib/validations";
import { saveProject, updateProjectById } from "@/services/projects.service";
import { generalDataType, ProjectStoreType } from "@/types/types";
import { auth } from '@clerk/nextjs/server'

import { redirect } from "next/navigation";

import z from "zod";

export async function POST(request: Request) {
  let data = await request.json()
  const secondValidated = settingsSchema.safeParse(data)

  if(!secondValidated.success){
      const errors = z.flattenError(secondValidated.error).fieldErrors;

      return Response.json({
        errors_message: errors
      }, {
        status: 500,
        statusText: "An error occur, data is not valid"
      })
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

  let result = await saveProject(initialProjectsSetup)
  
  if(result.status == 200){
      redirect("/explore/andreas-ideas-logo")
  }

  return Response.json({ 
    data: initialProjectsSetup
  }, {
    status: 200, 
    statusText: "Succefuly saved"
  })
}


export async function PATCH(request: Request){
  let data = await request.json()

  const { userId } = await auth()

  const secondValidated = updateSettingSchema.safeParse(data)

  if(!secondValidated.success){
      const errors = z.flattenError(secondValidated.error).fieldErrors;

      return Response.json({
        errors_message: errors
      }, {
        status: 500,
        statusText: "An error occur, data is not valid"
      })
  }


  if(secondValidated.success && userId){
    console.log(secondValidated)
    const result = await updateProjectById(userId, {
      id: secondValidated.data.id,
      title: secondValidated.data.title,
      summary: secondValidated.data.summary,
      type: secondValidated.data.type ? { id: secondValidated.data.type.id } : undefined,
      status: secondValidated.data.status ? { id: secondValidated.data.status.id } : undefined,
      tags: secondValidated.data.tags ? secondValidated.data.tags.map((tag) => ({tag_id: tag.id})) : undefined,
      tools: secondValidated.data.tools ? secondValidated.data.tools.map((tool) => ({tool_id: tool.id})) : undefined,
      visibility: secondValidated.data.visibility,
      disable_comments: secondValidated.data.disable_comments,
      client_name: secondValidated.data.client_name,
    })

    if(result.status == 200){ 
      return Response.json(result.data, {
        status: result.status,
        statusText: result.message
      })
    } else{
      return Response.json(result.data, {
        status: 500,
        statusText: "An error occur while updating your project, please try again"
      })
    }
  }
}