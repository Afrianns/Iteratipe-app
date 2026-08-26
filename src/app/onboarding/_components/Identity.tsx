import { useEffect, useState } from "react"
import { onboardingUserIdentity } from "@/lib/validations"
import z from "zod"
import { ErrorMessageList } from "@/components/ErrorMessageList"


interface UserIdentityErrorType {
  first_name?: string[] | undefined
  last_name?: string[] | undefined
  username?: string[] | undefined
  description?: string[] | undefined
}

export interface UserTypeDesc {
  username: string
  description: string
}

export default function Identity({setStep}: {setStep: (param: "identity" |"social") => void}) {

  const [userIdentityError, setUserIdentityError] = useState<UserIdentityErrorType>()

  const [identity, setIdentity] = useState<UserTypeDesc>({
    username: "",
    description: ""
  })

  const validateIndentitySection =  () => {
    const result = onboardingUserIdentity.safeParse(identity)
    if(!result.success) {
      console.log(z.flattenError(result.error).fieldErrors)
      setUserIdentityError(z.flattenError(result.error).fieldErrors)
    } else{
      setStep("social")
    }
  }

  return (
    <div className="card-style p-5! text-left">
      <div className="space-y-3">
          <label htmlFor="username" className="label-style">Username <span className="important-style">*</span></label>
          <input type="text" name="username" placeholder="Type your Username." className="input-style" value={identity.username || ""} onChange={(e) => setIdentity((prevIdentity: UserTypeDesc) => ({...prevIdentity, username: e.target.value}))} />
          <ErrorMessageList inputName="Username" messages={userIdentityError?.username} />
      </div>
      <div className="space-y-3">
          <label htmlFor="description" className="label-style">Description</label>
          <textarea name="description" placeholder="Type your description." className="input-style min-h-20" onChange={(e) => setIdentity((prevIdentity: UserTypeDesc) => ({...prevIdentity, description: e.target.value}))} value={identity.description}/>
          <ErrorMessageList inputName="Description" messages={userIdentityError?.description} />
      </div>
      <div className="flex justify-end mt-5">
        <button onClick={validateIndentitySection} type="button" className="button-style rounded-md uppercase">next</button>
      </div>
    </div>
  )
}