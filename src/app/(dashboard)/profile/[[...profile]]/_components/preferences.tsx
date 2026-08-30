"use client"

import Toggle from "@/components/toggle";
import { useState } from "react";

export default function Preferences() {
  

  const [isReceivedEmail, SetIsReceivedEmail] = useState<boolean>(false)

  const handleReceivedEmail = () => {
    SetIsReceivedEmail((prevVal) => prevVal = !prevVal)
  }

  return (
    <div className="card-style-secondary">
      <h1>This is Preference</h1>
      <div className="space-y-5 my-5">
        <Toggle setValue={handleReceivedEmail} value={isReceivedEmail} label="Stop Receiving Email Notification" />
      </div>
    </div>
  )
}