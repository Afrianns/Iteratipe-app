"use server"

import { onboardingUserIdentity, onboardingUserSocial } from "@/lib/validations"
import { updatePersonalInfo, updatePersonalSocial } from "@/services/user.service"
import { returnDataType } from "@/types/types"
import z from "zod"

export interface UserSocialErrorType {
  instagram_link?: string[] | undefined
  facebook_link?: string[] | undefined
  twitter_link?: string[] | undefined
  website_link?: string[] | undefined
}

export interface SocialType {
  instagram_link: string,
  facebook_link: string,
  twitter_link: string,
  website_link: string
}

export async function formInformationData(_: any, personalInformationData: SocialType): Promise<returnDataType<{ personalInfoData: SocialType, messageError?: UserSocialErrorType }>> {
  console.log("Personal Information Data: ", personalInformationData)
  
  const validated = onboardingUserSocial.safeParse({
    instagram_link: personalInformationData.instagram_link,
    facebook_link: personalInformationData.facebook_link,
    twitter_link: personalInformationData.twitter_link,
    website_link: personalInformationData.website_link
  })

  if(validated.success == false){
    return {
      status: 200, 
      message: "Personal information updated successfully",
      data: {
        personalInfoData: personalInformationData,
        messageError: z.flattenError(validated.error).fieldErrors as UserSocialErrorType
      }
    }
  } else{
    const result = await updatePersonalSocial(validated.data)

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