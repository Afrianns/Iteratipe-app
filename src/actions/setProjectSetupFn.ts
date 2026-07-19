 "use server"

import z from "zod";
import { generalSettingSchema, VisibilitySchema } from "../lib/validations";
import { FormActionStateType, InitialProjectType, Step, VISIBLE } from "@/types/types";
import { saveProject } from "@/services/project.service";
import { redirect } from "next/navigation";
import syncUser from "./syncUser";

export const handleProjectSetupFn = async (_: any, formData: FormData): Promise<FormActionStateType | undefined> => {

    let stepOneErrors = {};
    let stepTwoErrors = {};
    
    let nextStep: Step = "SETUP"
    let successVisibilityStep = false
    let successSetupStep = false

    
    const STEP = formData.get("step") as Step;
    const stepOneInput = {
        name : formData.get("name"),
        summary : formData.get("summary"),
        type : formData.get("type"),
        status : formData.get("status"),
        tags : formData.getAll("tags[]"),
        tools : formData.getAll("tools[]")
    }

    const stepOneValidation = generalSettingSchema.safeParse(stepOneInput)

    if(!stepOneValidation.success) {
        stepOneErrors = z.flattenError(stepOneValidation.error).fieldErrors;
    } else{
        successSetupStep = true
        nextStep = "VISIBILITY"
    }

    if(STEP == "SETUP" || !stepOneValidation.success){
        return {
            success: successSetupStep,
            next_step: nextStep,
            step_one_fields: {
                name : stepOneInput.name as string,
                summary : stepOneInput.summary as string,
                type : stepOneInput.type as string,
                status : stepOneInput.status as string,
                tags : stepOneInput.tags as string[],
                tools : stepOneInput.tools as string[]
            },
            step_one_errors: stepOneErrors
        }
    }

    const stepTwoInput = {
        visibility: formData.get("visibility"),
        disable_comments: formData.get("disable_comments"),
        client_name: formData.get("client"),
    }

    const stepTwoValidation = VisibilitySchema.safeParse(stepTwoInput)
    
    if(!stepTwoValidation.success) {
        stepTwoErrors = z.flattenError(stepTwoValidation.error).fieldErrors;
    } else{
        successVisibilityStep = true
        nextStep = "SUMMARY"
    }

    if(STEP == "VISIBILITY" || !stepTwoValidation.success){

        return {
            success: successVisibilityStep,
            next_step: nextStep,
            step_two_fields: {
                visibility : stepTwoInput.visibility as VISIBLE,
                disable_comments : stepTwoInput.disable_comments == "true",
                client_name : stepTwoInput.client_name as string
            },
            step_two_errors: stepTwoErrors
        }
    }

    if(STEP == "SUMMARY") {
        let initialProjectsSetup: InitialProjectType = {
            title: stepOneValidation.data.name,
            summary: stepOneValidation.data.summary,
            type: { id: stepOneValidation.data.type.id },
            status: { id: stepOneValidation.data.status.id },
            tags: stepOneValidation.data.tags.map((tag) => ({tag_id: tag.id})),
            tools: stepOneValidation.data.tools.map((tool) => ({tool_id: tool.id})),
            visibility: stepTwoValidation.data.visibility,
            disable_comments: stepTwoValidation.data.disable_comments,
            client_name: stepTwoValidation.data.client_name,
        }

        // await syncUser();
        let result = await saveProject(initialProjectsSetup)
        
        if(result.status == 200){
            return redirect("/explore/andreas-ideas-logo")
        }
    }
}