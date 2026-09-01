"use client"

import { formInformationData, PersonalInformationDataType, PersonalInformationDataTypeError } from "@/actions/updatePersonalInfo";
import { ErrorMessageList } from "@/components/ErrorMessageList";
import { onboardingUserIdentity } from "@/lib/validations";
import { getUserInformation } from "@/services/user.service";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";


export default function PersonalInformation() {

  const [identity, setIdentity] = useState<PersonalInformationDataType>({
    username: "",
    description: ""
  })

  const [formState, formAction, isPending] = useActionState(formInformationData, null)

  const [errorMessages, setErrorMessages] = useState<PersonalInformationDataTypeError>({})

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if(formState && formState.status != 200 && formState.data?.messageError){
      setErrorMessages(formState.data?.messageError)
    }

    if(formState && formState.status == 200 && formState.data?.personalInfoData){
      toast.success(formState.message)
      setIdentity(formState.data?.personalInfoData)
    }
    
  }, [formState])

  useEffect(() => {
    const getPersonalInformation = async () => {
      const user = await getUserInformation()

      if(user.status == 200 && user.data){
        setIdentity({
          username: user.data.username,
          description: user.data.description || ""
        })

        setLoading(false)
      }
    }
    setLoading(true)
    getPersonalInformation()

    return () => {
        setIdentity({
          username: "",
          description: ""
        })

        setLoading(false)
    }
  }, [])

  const beforeSave = async (formData: FormData) => {
    setLoading(true)
    console.log("Form Data: ", Object.fromEntries(formData.entries()))

    const result = onboardingUserIdentity.safeParse({
      username: formData.get("username") as string,
      description: formData.get("description") as string
    })

    if (!result.success) {
      setErrorMessages(z.flattenError(result.error).fieldErrors)
      setLoading(false)
      return
    } else{
      console.log("Validated data:", result.data)
      formAction(result.data as PersonalInformationDataType)
      setErrorMessages({})
      setLoading(false)
    }
  }

  return (
    <form action={beforeSave} className="card-style-secondary space-y-5">
      <div className="space-y-3">
          <label htmlFor="username" className="label-style">Username <span className="important-style">*</span></label>
          <input type="text" name="username" placeholder="Type your Username." className="input-style" value={identity.username || ""} onChange={(e) => setIdentity((prevIdentity: PersonalInformationDataType) => ({...prevIdentity, username: e.target.value}))} />
          <ErrorMessageList inputName="Username" messages={errorMessages.username} />
      </div>
      <div className="space-y-3">
          <label htmlFor="description" className="label-style">Description</label>
          <textarea name="description" placeholder="Type your description." className="input-style min-h-20" onChange={(e) => setIdentity((prevIdentity: PersonalInformationDataType) => ({...prevIdentity, description: e.target.value}))} value={identity.description}/>
          <ErrorMessageList inputName="Description" messages={errorMessages.description} />
      </div>
      <div className="flex justify-end mt-5">
        {(loading || isPending) ?
          <button type="button" disabled className="button-style opacity-40 rounded-md uppercase cursor-wait!">Updating...</button>
        :
          <button type="submit" className="button-style rounded-md uppercase">Update</button>
        }
      </div>
    </form>
  )
}