 "use server"

import z from "zod";
import { SetupSchema, VisibilitySchema } from "../validations";
import next from "next";
import { FormActionStateType, Step, VISIBLE } from "@/types/types";

 export const handleProjectSetupFn = async (_: any, formData: FormData): Promise<FormActionStateType | undefined> => {
        
        let stepOneErrors = {};
        let stepTwoErrors = {};
        let nextStep: Step = "SETUP"
        
        const STEP = formData.get("step") as Step;
        const stepOneInput = {
            name : formData.get("name"),
            summary : formData.get("summary"),
            status : formData.get("status"),
            tags : formData.getAll("tags[]"),
            tools : formData.getAll("tools[]")
        }
        
        console.log(stepOneInput)
        const stepOneValidation = SetupSchema.safeParse(stepOneInput)

        let successSetupStep = false
        if(stepOneValidation.error) {
            stepOneErrors = z.flattenError(stepOneValidation.error).fieldErrors;
        } else{
            successSetupStep = true
            nextStep = "VISIBILITY"
        }

        if(STEP == "SETUP"){
            return {
                success: successSetupStep,
                next_step: nextStep,
                step_one_fields: {
                    name : stepOneInput.name as string,
                    summary : stepOneInput.summary as string,
                    status : stepOneInput.status as string,
                    tags : stepOneInput.tags as string[],
                    tools : stepOneInput.tools as string[]
                },
                step_one_errors: stepOneErrors
            }
        }

        const stepTwoInput = {
            visibility: formData.get("visibility"),
            disable_comments: formData.get("disable_comments")  === "on",
            client_name: formData.get("client"),
        }

        const stepTwoValidation = VisibilitySchema.safeParse(stepTwoInput)

        nextStep = "VISIBILITY"
        let successVisibilityStep = false

        if(stepTwoValidation.error) {
            stepTwoErrors = z.flattenError(stepTwoValidation.error).fieldErrors;
        } else{
            successVisibilityStep = true
            nextStep = "SUMMARY"
        }
        
        if(STEP == "VISIBILITY"){

            return {
                success: successVisibilityStep,
                next_step: nextStep,
                step_two_fields: {
                    visibility : stepTwoInput.visibility as VISIBLE,
                    disable_comments : stepTwoInput.disable_comments as boolean,
                    client_name : stepTwoInput.client_name as string
                },
                step_two_errors: stepTwoErrors
            }
        }

        console.log(stepTwoInput, STEP)

        // return { success: true, message: {} }
    }