"use server"

import { onboardingUser } from "@/lib/validations"
import z from "zod"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { UserDataType } from "@/types/types"
import syncUser from "@/services/user.service"
import { isCompletedOnboarding } from "@/services/validation.service"

interface additionalUserData {
  username: string
  facebook?: string | undefined
  twitter?: string | undefined
  website?: string | undefined
  description?: string | undefined
}

export async function formOnboarding(_: any, additionalUserData: additionalUserData) {
  const user = await currentUser()

  console.log(user)
  if(!user) return;
  const validated = onboardingUser.safeParse(additionalUserData)
      
  if(!validated.success) {
    console.log(z.flattenError(validated.error).fieldErrors)
    return {
      status: 500,
      message: "validation error",
      messageError: z.flattenError(validated.error).fieldErrors
    }
  } else{
    const completedOnboarding = await isCompletedOnboarding()

    if(completedOnboarding.status == 200 && !completedOnboarding.data?.already_onboarding) {
      const mappedUser: UserDataType = {
        id: user.id,
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        username: validated.data.username,
        full_name: `${user.firstName} ${user.lastName}`,
        description: validated.data.description || "",
        facebook_link: validated.data.facebook_link || "",
        twitter_link: validated.data.twitter_link || "",
        website_link: validated.data.website_link || "",
        email: user.primaryEmailAddressId || "-",
        image_url: user.imageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
      }
      const result = await syncUser(mappedUser)
  
      if(result.status == 200){
        redirect("/home?success=true")
      }
    } else{
      return {
        status: 500,
        message: "Oops... something went wrong"
      }
    }
  }
}
