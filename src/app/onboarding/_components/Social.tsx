import { ErrorMessageList } from "@/components/ErrorMessageList"
import { onboardingUserSocial } from "@/lib/validations"
import { useRef, useState } from "react"
import z from "zod"

interface UserSocialErrorType{
  facebook?: string[] | undefined
  twitter?: string[] | undefined
  website?: string[] | undefined
}

interface SocialType{
  facebook: string
  twitter: string
  website: string
}

export default function Social({setStep, isPending}: {setStep: (param: "identity"|"social") => void, isPending: boolean}) {
  const submitRef = useRef<HTMLButtonElement>(null)
  const [social, setSocial] = useState<SocialType>({
      facebook: "",
      twitter: "",
      website: ""
    })

  const [userSocialError, setUserSocialError] = useState<UserSocialErrorType>()

  const validateSocialSection = () => {
    const result = onboardingUserSocial.safeParse(social)

    console.log(result)
    if(!result.success) {
      setUserSocialError(z.flattenError(result.error).fieldErrors)
    } else{
      setSocial(social)
      setUserSocialError({})

      if(submitRef.current) {  
        submitRef.current.click()
      }
    }
  }
  return (
    <div className="card-style p-5! my-10 text-left">
      <div className="space-y-3 w-full">
          <label htmlFor="facebook" className="label-style">Facebook <span className="important-style">*</span></label>
          <input type="text" name="facebook" placeholder="Type your facebook account link." className="input-style" value={social.facebook} onChange={(e) => setSocial(prevSocial => ({...prevSocial, facebook: e.target.value}))} />
          <ErrorMessageList inputName="title" messages={userSocialError?.facebook} />
      </div>
      <div className="space-y-3 w-full">
          <label htmlFor="twitter" className="label-style">Twitter <span className="important-style">*</span></label>
          <input type="text" name="twitter" placeholder="Type your first twitter account link." className="input-style" value={social.twitter} onChange={(e) => setSocial(prevSocial => ({...prevSocial, twitter: e.target.value}))}/>
          <ErrorMessageList inputName="title" messages={userSocialError?.twitter} />
      </div>
      <div className="space-y-3">
          <label htmlFor="website" className="label-style">Website <span className="important-style">*</span></label>
          <input type="text" name="website" placeholder="Type your website link." className="input-style" value={social.website} onChange={(e) => setSocial(prevSocial => ({...prevSocial, website: e.target.value}))}/>
          <ErrorMessageList inputName="title" messages={userSocialError?.website} />
      </div>
      <div className="flex justify-between items-center mt-5">
        <button type="button" className="button-style-secondary rounded-md uppercase" onClick={() => setStep("identity")}>prev</button>
        {isPending ? 
          <button type="button" disabled className="button-style opacity-40 rounded-md uppercase cursor-wait!">Saving...</button>
        :
          <>
            <button type="submit" ref={submitRef} hidden></button>
            <button type="button" onClick={validateSocialSection} className="button-style rounded-md uppercase">Save</button>
          </>
        }
      </div>
    </div>
  )
}