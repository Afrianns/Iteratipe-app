import { ErrorMessageList } from "@/components/ErrorMessageList";
import LabelsList from "@/components/LabelsList";
import { SettingContext } from "@/lib/settingContext";
import { Step } from "@/types/types";
import { useContext } from "react";
import { useFormStatus } from "react-dom";

export default function Summary({ changeStepFn }: { changeStepFn: (step: number) => void }) {
    
    const { pending } = useFormStatus()
    
    const { generalSettings, generalSettingErrors } = useContext(SettingContext)
    
    type GeneralSettingKeyType = keyof typeof generalSettingErrors

    const inputNames: GeneralSettingKeyType[] = ["title", "summary", "type", "status", "tags", "tools", "visibility", "disable_comments", "client_name"]
    return (
        <div className="card-style w-full px-4 py-5 max-w-200 mx-auto">
            {inputNames.map((inputName: GeneralSettingKeyType, idx: number) => {
                   return <ErrorMessageList key={idx} inputName={inputName} messages={generalSettingErrors[inputName]} />
                })
            }

            <h1 className="text-xl font-bold">Review Your Project Setup</h1>
            <div className="border border-grayish rounded-xl p-3 bg-light-gray">
                <h3 className="h-four-style my-3!">Initial Project</h3>
                <div className="grid grid-cols-2 gap-x-5">
                    <div className="my-2">
                        <span className="label-style">Title</span>
                        <p className="text-sm text-grayish-dark">{generalSettings.title}</p>
                    </div>
                    <div className="my-2">
                        <span className="label-style">Status</span>
                        <p className="text-sm text-grayish-dark">{generalSettings.status.name}</p>
                    </div>
                </div>
                <div className="my-2">
                    <span className="label-style">Description</span>
                    <p className="text-sm text-grayish-dark">{generalSettings.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-5">
                    {generalSettings.tags &&
                        <div className="my-2 relative">
                            <span className="text-sm text-grayish-dark relative z-5">Tags</span>
                            <LabelsList colorFrom="from-light-gray" labelType="tags" />
                        </div>
                    }
                    {generalSettings.tools &&
                        <div className="my-2 relative">
                            <span className="text-sm text-grayish-dark relative z-5">Tools</span>
                            <LabelsList colorFrom="from-light-gray" labelType="tools" />
                        </div>
                    }
                </div>
                <hr className="hr-style my-5" />
                <div className="my-2 space-y-2">
                    <h3 className="h-four-style my-3!">Project Visibility</h3>
                    {generalSettings.visibility =="PUBLIC" &&
                        <div>
                            <h3 className="label-style">Public</h3>
                            <p className="p-style">Will be visible to everyone even when the project is in progress.</p>
                        </div>
                    }
                    {generalSettings.visibility == "SEMI" &&
                        <div>
                            <h3 className="label-style">Partial Private</h3>
                            <p className="p-style">Will only be visible by everyone when the project is completed.</p>
                        </div>
                    }
                    {generalSettings.visibility == "PRIVATE" &&
                        <div>
                            <h3 className="label-style">Private</h3>
                            <p className="p-style">Project will completely private and only visible to you.</p>
                        </div>
                    }
                    {generalSettings.disable_comments && <div className="label-style">Disabled Comments</div>}
                    {generalSettings.client_name.length > 0 &&
                        <>
                            <hr className="hr-style my-5" />
                            <h3 className="h-four-style my-3!">Other</h3>
                            <div className="my-2">
                                <span className="text-sm text-grayish-dark">Client Name</span>
                                <p className="label-style">{generalSettings.client_name}</p>
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="flex justify-between items-center mt-10">
                <button type="button" onClick={() => changeStepFn(2)} className="button-style-secondary rounded-md">Back</button>
                {pending ? 
                    <button type="button" className="button-style-loading rounded-md">Loading...</button>
                :
                    <button type="submit" name="STEP" value={"SUMMARY" as Step} className="button-style rounded-md">Confirm & Continue</button>
                }
            </div>
        </div>
    )
}