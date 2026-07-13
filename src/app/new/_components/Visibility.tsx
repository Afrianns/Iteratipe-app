"use client"

import { ErrorMessageList } from "@/components/ErrorMessageList";
import Toggle from "@/components/toggle";
import { Step, VisibilityErrorsType, VisibilityType, VISIBLE } from "@/types/types";
import { useState } from "react";

export default function Visibility({ errors, changeStepFn, visibilityData, setVisibility }: { errors: VisibilityErrorsType, changeStepFn: (step: string) => void, visibilityData: VisibilityType, setVisibility: (visibilityData: VisibilityType) => void}) {
    return (
        <div className="card-style w-full px-4 py-5 max-w-200 mx-auto">
            <div className="flex items-center gap-2">
                <input type="radio" id="public" name="visibility" defaultChecked={visibilityData.visibility === "PUBLIC"} onChange={(e) => setVisibility({ ...visibilityData, visibility: "PUBLIC"})} value="PUBLIC" className="input-radio-style" />
                <label htmlFor="public">
                    <h3 className="label-style">Public</h3>
                    <p className="p-style">Will be visible to everyone even when the project is in progress.</p>
                </label>
            </div>
            <div className="flex items-center gap-2">
                <input type="radio" id="partial-public" name="visibility"  defaultChecked={visibilityData.visibility === "SEMI"} onChange={(e) => setVisibility({ ...visibilityData, visibility: "SEMI"})} value="SEMI" className="input-radio-style" />
                <label htmlFor="partial-public">
                    <h3 className="label-style">Partial Private</h3>
                    <p className="p-style">Will only be visible by everyone when the project is completed.</p>
                </label>
            </div>
            <div className="flex items-center gap-2">
                <input type="radio" id="private" name="visibility"  defaultChecked={visibilityData.visibility === "PRIVATE"} onChange={(e) => setVisibility({ ...visibilityData, visibility: "PRIVATE"})} value="PRIVATE" className="input-radio-style" />
                <label htmlFor="private">
                    <h3 className="label-style">Private</h3>
                    <p className="p-style">Project will completely private and only visible to you.</p>
                </label>
            </div>
            <ErrorMessageList inputName="Visibility" messages={errors?.visibility} />
            
            <h4 className="h-four-style">Comments Setting</h4>
            <Toggle label="Disable Comments" />
            <ErrorMessageList inputName="Comments" messages={errors?.disable_comments} />
            <hr className="hr-style my-6" />

            <div className="space-y-3">
                <label htmlFor="client" className="label-style">Client*</label>
                <input type="text" name="client" placeholder="Type your client project name" className="input-style" value={visibilityData.client_name} onChange={(e) => setVisibility({...visibilityData, client_name: e.target.value})} />
                <span className="span-style">*) If the project is base on client, you can include client name. otherwise you can leave it blank</span>
            </div>
            <ErrorMessageList inputName="Client" messages={errors?.client_name} />

            <div className="flex justify-between items-center mt-10">
                <button onClick={() => changeStepFn("SETUP")} className="button-style-secondary rounded-md">Back</button>
                <button type="submit" name="step" value={"VISIBILITY" as Step} className="button-style rounded-md">Next</button>
            </div>
        </div>
    )
}