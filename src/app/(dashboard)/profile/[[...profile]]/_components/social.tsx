"use client"

import { ErrorMessageList } from "@/components/ErrorMessageList";
import { AtSign } from "lucide-react";
import { useState } from "react";

interface UserSocialErrorType{
  facebook?: string[] | undefined
  twitter?: string[] | undefined
  website?: string[] | undefined
}

interface SocialType {
  facebook: string
  twitter: string
  website: string
}

export default function Social() {
  
  const [userSocialError, setUserSocialError] = useState<UserSocialErrorType>({})
  const [isPending, setIsPending] = useState<boolean>(false)
  const [social, setSocial] = useState<SocialType>({
      facebook: "",
      twitter: "",
      website: ""
    })

  return (
    <div className="card-style-secondary">
      <h1 className="h-two-style mb-5">Setup your social links</h1>

      <form action="#" className="space-y-5">
        <div className="space-y-3 w-full">
            <label htmlFor="facebook" className="label-style">Facebook <span className="important-style">*</span></label>
            <div className="flex items-center">
              <div className="icon-style-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <g fill="none">
                    <g clipPath="url(#SVGXv8lpc2Y)">
                      <path fill="currentColor" fillRule="evenodd" d="M0 12.067C0 18.034 4.333 22.994 10 24v-8.667H7V12h3V9.333c0-3 1.933-4.666 4.667-4.666c.866 0 1.8.133 2.666.266V8H15.8c-1.467 0-1.8.733-1.8 1.667V12h3.2l-.533 3.333H14V24c5.667-1.006 10-5.966 10-11.933C24 5.43 18.6 0 12 0S0 5.43 0 12.067" clipRule="evenodd" />
                    </g>
                    <defs>
                      <clipPath id="SVGXv8lpc2Y">
                        <path fill="#fff" d="M0 0h24v24H0z" />
                      </clipPath>
                    </defs>
                  </g>
                </svg>
              </div>
              <input type="text" name="facebook" placeholder="e.g. https://web.facebook.com/example" className="input-style p-3! text-xs" value={social.facebook} onChange={(e) => setSocial(prevSocial => ({...prevSocial, facebook: e.target.value}))} />
            </div>
            <ErrorMessageList inputName="title" messages={userSocialError?.facebook} />
        </div>
        <div className="space-y-3 w-full">
            <label htmlFor="twitter" className="label-style">Twitter <span className="important-style">*</span></label>
            <div className="flex items-center">
              <div className="icon-style-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor" d="M13.68 10.62L20.24 3h-1.55L13 9.62L8.45 3H3.19l6.88 10.01L3.19 21h1.55l6.01-6.99l4.8 6.99h5.24l-7.13-10.38Zm-2.13 2.47l-.7-1l-5.54-7.93H7.7l4.47 6.4l.7 1l5.82 8.32H16.3z" />
                </svg>
              </div>
              <input type="text" name="twitter" placeholder="e.g. https://x.com/example" className="input-style p-3! text-xs" value={social.twitter} onChange={(e) => setSocial(prevSocial => ({...prevSocial, twitter: e.target.value}))}/>
            </div>
            <ErrorMessageList inputName="title" messages={userSocialError?.twitter} />
        </div>
        <div className="space-y-3">
            <label htmlFor="website" className="label-style">Website <span className="important-style">*</span></label>
            <div className="flex items-center">
              <div className="icon-style-secondary" >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor" d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2" />
                </svg>
              </div>
              <input type="text" name="website" placeholder="e.g. https://example.com" className="input-style p-3! text-xs" value={social.website} onChange={(e) => setSocial(prevSocial => ({...prevSocial, website: e.target.value}))}/>
            </div>
            <ErrorMessageList inputName="title" messages={userSocialError?.website} />
        </div>
        <div className="text-right">
          {isPending ? 
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