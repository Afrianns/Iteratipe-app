"use client"

import { useActionState, useEffect, useState } from "react"


import { useUser } from "@clerk/nextjs"
import { onboardingUser } from "@/lib/validations"
import z from "zod"
import Identity from "./_components/Identity"
import Social from "./_components/Social"
import {formOnboarding } from "@/actions/setInitialUserOnboarding"
import { ErrorMessageList } from "@/components/ErrorMessageList"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { isCompletedOnboarding } from "@/services/validation.service"

export interface UserType {
  first_name: string | null
  last_name: string | null
  username: string | null
}

interface SubmitErrorMessages {
  username?: string[] | undefined
  facebook?: string[] | undefined
  twitter?: string[] | undefined
  website?: string[] | undefined
  description?: string[] | undefined
}


export default function onboarding() {
  const { isLoaded, isSignedIn, user } = useUser()

  const [errorMessages, setErrorMessages] = useState<SubmitErrorMessages>({})

  const [step, setStep] = useState<"identity"|"social">("identity")
  
  const [form, formAction, isPending] = useActionState(formOnboarding, null)

  useEffect( () => {
    const checkIsAlreadyOnboarding = async () =>  {
      const result = await isCompletedOnboarding()
      
      if(result.status == 200 && result.data?.already_onboarding)
        redirect("/home")
    }

    checkIsAlreadyOnboarding()
  }, [])

  useEffect(() => {
    if(form?.messageError && form?.status != 200){
      setErrorMessages(form.messageError as SubmitErrorMessages)
    }

    if(form?.status == 500) {
      toast.error(form.message)
    }
    
  }, [form]) 

  const checkForm = async (data: FormData) => {
    
    if(!user) return

    const additionalUserData = {
      "username": data.get("username") || "",
      "description": data.get("description") || "",
      "facebook": data.get("facebook_link") || "",
      "twitter": data.get("twitter_link") || "",
      "website": data.get("website_link") || ""
    }
    const validated = onboardingUser.safeParse(additionalUserData)
    
    if(!validated.success) {
      setErrorMessages(z.flattenError(validated.error).fieldErrors)
    } else{
      formAction(validated.data)
    }
  }

  if(!isLoaded && !isSignedIn) {
    return <p className="m-auto! h-four-style">Loading...</p>
  }

  return (
     <div className="text-center py-10 bg-grayish/50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-200 mx-auto">

        <ErrorMessageList inputName="Username" messages={errorMessages.username} />
        <ErrorMessageList inputName="Description" messages={errorMessages.description} />
        <ErrorMessageList inputName="Facebook" messages={errorMessages.facebook} />
        <ErrorMessageList inputName="Twitter" messages={errorMessages.twitter} />
        <ErrorMessageList inputName="Website" messages={errorMessages.website} />
        
        <form action={checkForm}>
            <div className="my-10">
              <div className="text-left my-3">
                <h3 className="text-xl uppercase font-light">Welcome, <span className="font-bold!">{user?.firstName} {user?.lastName}</span></h3>
                <p>Let's complete your profile data.</p>
              </div>
              <div className={`${step == "identity" ? "block" : "hidden"}`}>
                <Identity setStep={setStep} />
              </div>
            </div>
            <div className={`${step == "social" ? "block" : "hidden"}`}>
              <Social setStep={setStep} isPending={isPending} />
            </div>
        </form>
      </div>
    </div>
  )
}