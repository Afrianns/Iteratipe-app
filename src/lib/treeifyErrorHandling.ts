import z, { ZodError } from "zod";
import { NodeSchema } from "./validations";
import { ValidationMessagesType } from "@/actions/upload";
import { Content } from "next/font/google";

type ZodTreeError = ReturnType<typeof z.treeifyError>;

export default function treeifyErrorHandling(error: ReturnType<typeof z.treeifyError<z.infer<typeof NodeSchema>>>) {
  let remapErrorData: ValidationMessagesType = {}
  
  if(error.properties?.data?.properties){
    let dataError = error.properties?.data?.properties
    type datErrorKey = keyof typeof dataError

    for (const name of ["content","title", "type", "end_at","start_at", "image_url"]) {
      remapErrorData = { ...remapErrorData, [name]: dataError[name as datErrorKey]?.errors}
      
    }
    // remapErrorData = {
    //   : dataError.title?.errors,
    //   type: dataError.content?.errors,
    //   end_at: dataError.content?.errors
    // }

    console.log("check validation: ", error.properties?.data?.properties, remapErrorData)
    return remapErrorData
  }
}