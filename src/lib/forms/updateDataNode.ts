"use server"

import z from "zod";
import { NodeSchema } from "../validations";
import { initialStateType } from "@/types/types";

export const formUpdateFn = async (_: any, formData: FormData): Promise<initialStateType> => {
    
    const userInput = {
        title : formData.get("title"),
        start_at : formData.get("start_at"),
        end_at : formData.get("end_at"),
        type : formData.get("type"),
        content : formData.get("content")
    }

    console.log(userInput);
    const { error } = NodeSchema.safeParse(userInput)

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if(error){
        const er = z.flattenError(error);
        console.log(er.fieldErrors)
        return {
            success: false, message: er.fieldErrors }
    }
    
    return { success: true, message: {} }

}