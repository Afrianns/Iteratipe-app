import TagsList from "@/components/TagsList";
import ToolsList from "@/components/ToolsList";
import { labelType, SetupType, Step, VisibilityType } from "@/types/types";
import { useFormStatus } from "react-dom";

export default function Summary({ changeStepFn, setupData, visibilityData }: {setupData: SetupType, visibilityData: VisibilityType, changeStepFn: (step: Step) => void }) {
    
    const { pending } = useFormStatus()
    
    const parseArrayOfObjectStrFn = (labelStrs: string[]) => {
        let labels: labelType[] = []
        labelStrs.map((labelStr) => labels.push(JSON.parse(labelStr)))

        return labels
    }

    return (
        <div className="card-style w-full px-4 py-5 max-w-200 mx-auto">
            <h1 className="text-xl font-bold">Review Your Project Setup</h1>
            <div className="border border-grayish rounded-xl p-3 bg-light-gray">
                <h3 className="h-four-style my-3!">Initial Project</h3>
                <div className="grid grid-cols-2 gap-x-5">
                    <div className="my-2">
                        <span className="label-style">Name</span>
                        <p className="text-sm text-grayish-dark">{setupData.name}</p>
                    </div>
                    <div className="my-2">
                        <span className="label-style">Status</span>
                        <p className="text-sm text-grayish-dark">{(setupData.status) ? JSON.parse(setupData.status).name : ""}</p>
                    </div>
                </div>
                <div className="my-2">
                    <span className="label-style">Description</span>
                    <p className="text-sm text-grayish-dark">{setupData.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-5">
                    {setupData.tags &&
                        <div className="my-2 relative">
                            <span className="text-sm text-grayish-dark relative z-5">Tags</span>
                            <TagsList colorFrom="from-light-gray" tags={parseArrayOfObjectStrFn(setupData.tags)} />
                        </div>
                    }
                    {setupData.tools &&
                        <div className="my-2 relative">
                            <span className="text-sm text-grayish-dark relative z-5">Tools</span>
                            <ToolsList colorFrom="from-light-gray" tools={parseArrayOfObjectStrFn(setupData.tools)} />
                        </div>
                    }
                </div>
                <hr className="hr-style my-5" />
                <div className="my-2 space-y-2">
                    <h3 className="h-four-style my-3!">Project Visibility</h3>
                    {visibilityData.visibility =="PUBLIC" &&
                        <div>
                            <h3 className="label-style">Public</h3>
                            <p className="p-style">Will be visible to everyone even when the project is in progress.</p>
                        </div>
                    }
                    {visibilityData.visibility == "SEMI" &&
                        <div>
                            <h3 className="label-style">Partial Private</h3>
                            <p className="p-style">Will only be visible by everyone when the project is completed.</p>
                        </div>
                    }
                    {visibilityData.visibility == "PRIVATE" &&
                        <div>
                            <h3 className="label-style">Private</h3>
                            <p className="p-style">Project will completely private and only visible to you.</p>
                        </div>
                    }
                    {visibilityData.disable_comments && <div className="label-style">Disabled Comments</div>}
                    {visibilityData.client_name.length > 0 &&
                        <>
                            <hr className="hr-style my-5" />
                            <h3 className="h-four-style my-3!">Other</h3>
                            <div className="my-2">
                                <span className="text-sm text-grayish-dark">Client Name</span>
                                <p className="label-style">{visibilityData.client_name}</p>
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="flex justify-between items-center mt-10">
                <button onClick={() => changeStepFn("VISIBILITY")} className="button-style-secondary rounded-md">Back</button>
                {pending ? 
                    <button type="button" className="button-style-loading rounded-md">Loading...</button>
                :
                    <button type="submit" name="step" value={"SUMMARY" as Step} className="button-style rounded-md">Confirm & Continue</button>
                }
            </div>
        </div>
    )
}