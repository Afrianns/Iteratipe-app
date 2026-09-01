"use client"

import { ErrorMessageList } from "@/components/ErrorMessageList";
import { getUserInformation } from "@/services/user.service";
import { useEffect, useState } from "react";

export interface UserTypeDesc {
  username: string
  description: string
}

export default function PersonalInformation() {

  const [identity, setIdentity] = useState<UserTypeDesc>({
    username: "",
    description: ""
  })

  const [loading, setLoading] = useState<boolean>(false)

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

  return (
    <div className="card-style-secondary space-y-5">
      <div className="space-y-3">
          <label htmlFor="username" className="label-style">Username <span className="important-style">*</span></label>
          <input type="text" name="username" placeholder="Type your Username." className="input-style" value={identity.username || ""} onChange={(e) => setIdentity((prevIdentity: UserTypeDesc) => ({...prevIdentity, username: e.target.value}))} />
          <ErrorMessageList inputName="Username" messages={[]} />
      </div>
      <div className="space-y-3">
          <label htmlFor="description" className="label-style">Description</label>
          <textarea name="description" placeholder="Type your description." className="input-style min-h-20" onChange={(e) => setIdentity((prevIdentity: UserTypeDesc) => ({...prevIdentity, description: e.target.value}))} value={identity.description}/>
          <ErrorMessageList inputName="Description" messages={[]} />
      </div>
      <div className="flex justify-end mt-5">
        {loading ?
          <button type="button" disabled className="button-style opacity-40 rounded-md uppercase cursor-wait!">loading...</button>
        :
          <button type="submit" className="button-style rounded-md uppercase">Save</button>
        }
      </div>
    </div>
  )
}