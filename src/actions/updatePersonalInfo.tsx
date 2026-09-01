"use server"

import { onboardingUserIdentity } from "@/lib/validations"
import { updatePersonalInfo } from "@/services/user.service"
import { returnDataType } from "@/types/types"
import z from "zod"

export interface PersonalInformationDataType {
  username: string
  description: string | undefined
}

export interface PersonalInformationDataTypeError {
  username?: string[] | undefined
  description?: string[] | undefined
}


export async function formInformationData(_: any, personalInformationData: PersonalInformationDataType): Promise<returnDataType<{ personalInfoData: PersonalInformationDataType, messageError?: PersonalInformationDataTypeError }>> {
  console.log("Personal Information Data: ", personalInformationData)
  const validated = onboardingUserIdentity.safeParse({
    username: personalInformationData.username,
    description: personalInformationData.description
  })

  if(validated.success == false){
    return {
      status: 200, 
      message: "Personal information updated successfully",
      data: {
        personalInfoData: personalInformationData,
        messageError: z.flattenError(validated.error).fieldErrors as PersonalInformationDataTypeError
      }
    }
  } else{
    const personalInformationData = {
      username: validated.data.username,
      description: validated.data.description || "",
    }

    const result = await updatePersonalInfo(personalInformationData)

    if(result.status === 200){
      return { 
        status: 200, 
        message: "Personal information updated successfully",
        data: { personalInfoData: personalInformationData }
      }
    }
  }

  return {
    status: 500,
    message: "Failed to update personal information",
  }
}