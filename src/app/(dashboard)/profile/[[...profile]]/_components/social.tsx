"use client"

import { formInformationData, SocialType, UserSocialErrorType } from "@/actions/updatePersonalSocial";
import Links from "@/components/links";
import { onboardingUserSocial } from "@/lib/validations";
import { getUserSocial } from "@/services/user.service";
import { useAuth } from "@clerk/nextjs";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";


export default function Social() {
  
  const { userId } = useAuth()

  const [social, setSocial] = useState<SocialType>({
      instagram_link: "",
      facebook_link: "",
      twitter_link: "",
      website_link: ""
    })
  const [formState, formAction, isPending] = useActionState(formInformationData, null)

  useEffect(() => {
    if(formState && formState.status != 200 && formState.data?.messageError){
      setErrorMessages(formState.data?.messageError)
    }

    if(formState && formState.status == 200 && formState.data?.personalInfoData){
      toast.success(formState.message)
      setSocial(formState.data?.personalInfoData)
    }

  }, [formState])


  useEffect(() => {
    const getPersonalInformation = async () => {
      const user = await getUserSocial()

      if(user.status == 200 && user.data){
        setSocial({
          instagram_link: user.data.instagram_link || "",
          facebook_link: user.data.facebook_link || "",
          twitter_link: user.data.twitter_link || "",
          website_link: user.data.website_link || ""
        })
        setLoading(false)
      }
    }
    setLoading(true)
    getPersonalInformation()

    return () => {
        setSocial({
          instagram_link: "",
          facebook_link: "",
          twitter_link: "",
          website_link: ""
        })

        setLoading(false)
    }
  }, [userId])

  const [errorMessages, setErrorMessages] = useState<UserSocialErrorType>({})

  const [loading, setLoading] = useState<boolean>(false)

  const beforeSave = async (formData: FormData) => {
    setLoading(true)
    console.log("Form Data: ", Object.fromEntries(formData.entries()))

    const result = onboardingUserSocial.safeParse({
      instagram_link: formData.get("instagram_link") as string,
      facebook_link: formData.get("facebook_link") as string,
      twitter_link: formData.get("twitter_link") as string,
      website_link: formData.get("website_link") as string
    })

    if (!result.success) {
      setErrorMessages(z.flattenError(result.error).fieldErrors as UserSocialErrorType)
      setLoading(false)
      return
    } else{
      console.log("Validated data:", result.data)
      formAction(result.data)
      setErrorMessages({})
      setLoading(false)
    }
  }

  return (
    <div className="card-style-secondary">
      <h1 className="h-two-style mb-5">Setup your social links</h1>

      <form action={beforeSave} className="space-y-5">
        <Links social={social} setSocial={setSocial} errorMessages={errorMessages} />
        <div className="text-right">
          {(loading || isPending) ? 
            <button type="button" disabled className="button-style text-xs! opacity-40 rounded-md uppercase cursor-wait!">Updating...</button>
          :
            <>
              <button type="submit" className="button-style text-xs! rounded-md uppercase">Update</button>
            </>
          }
        </div>
      </form>
    </div>
  )
}