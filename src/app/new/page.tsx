"use client"

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Visibility from "./_components/Visibility";
import Setup from "./_components/Setup";
import { handleProjectSetupFn } from "@/lib/forms/handleProjectSetup";
import Summary from "./_components/Summary";
import { useActionState, useEffect, useState } from "react";
import { FormActionStateType, SetupErrorsType, SetupType, Step, VisibilityErrorsType, VisibilityType } from "@/types/types";

const stepOneFields = {
    name: "",
    summary: "",
    status: "",
    tags: [],
    tools: [],
}

const stepTwoFields: VisibilityType = {
    visibility: "PUBLIC",
    disable_comments: false,
    client_name: ""
}

const FormAction: FormActionStateType = {
    success: false,
    next_step: "SETUP",
    step_one_fields: stepOneFields,
    step_one_errors: {
        name: [],
        summary: [],
        status: [],
        tags: [],
        tools: [],
    }
};

export default function New() {
    
    const [steps, setSteps] = useState<[boolean, boolean, boolean]>([true, false, false])

    const [setupData, setSetupData] = useState<SetupType>(stepOneFields)
    const [visibilityData, setVisibilityData] = useState<VisibilityType>(stepTwoFields)
    
    const [state, formAction] = useActionState(handleProjectSetupFn, FormAction)
    const [tab, setTab] = useState<Step>("SETUP");

    useEffect(() => {
        if(state?.next_step) changeStepFn(state.next_step)

        if(tab == "SETUP"){
            console.log("check setup")
            const data = state?.step_one_fields;
            if(data){
                setSetupData({
                    name: data?.name || "",
                    summary: data?.summary || "",
                    status: data?.status || "",
                    tags: data?.tags,
                    tools: data?.tools,
                });
            }
        }

        if(tab == "VISIBILITY"){
            console.log("check visible")
            const data = state?.step_two_fields;
            if(data){
                setVisibilityData({
                    visibility: data?.visibility,
                    disable_comments: data?.disable_comments,
                    client_name: data?.client_name
                });
            }
        }

    }, [state])

    const changeStepFn = (next_step: string) => {
        switch (next_step) {
            case "SETUP":
                setTab("SETUP")
                setSteps([true, false, false])
                break;
            case "VISIBILITY":
                setTab("VISIBILITY")
                setSteps([true, true, false])
                break;
            case "SUMMARY":
                setTab("SUMMARY")
                setSteps([true, true, true])
                break;
            default:
                setTab("SETUP")
                setSteps([true, false, false])
                break;
        }
    }

    return (
        <div className="container-wrapper-style max-md:mb-20">
            <Sidebar />
            <div className="col-span-5 w-full">
                <div className="container-style container-accent-style">
                    <div className="limit-breaker">
                        <Header showSearch={false}/>
                    </div>
                </div>
                <form action={formAction} className="container-style mx-auto flex flex-col items-center justify-center transition-style">
                    <div className="flex items-center justify-center my-10 gap-x-10 w-fit relative z-2">
                        <div className={`w-10 h-10 rounded-full z-2 flex items-center justify-center ${steps[0] ? "bg-purplish" : "bg-light-purple"}`}>
                            <h3 className={`font-extrabold text-2xl h-9 ${steps[0] ? "text-whitish" : "text-purplish"}`}>1</h3>
                        </div>
                        <hr className={`hr-style border-5 w-1/2 left-0 absolute z-1 ${steps[1] ? "border-purplish!" :"border-light-purple!"}`} />
                        <div className={`w-10 h-10 rounded-full z-2 flex items-center justify-center ${steps[1] ? "bg-purplish" : "bg-light-purple"}`}>
                            <h3 className={`font-extrabold text-2xl h-9 ${steps[1] ? "text-whitish" : "text-purplish"}`}>2</h3>
                        </div>
                        <hr className={`hr-style border-5 w-1/2 right-0 absolute z-1 ${steps[2] ? "border-purplish!" :"border-light-purple!"}`} />
                        <div className={`w-10 h-10 rounded-full z-2 flex items-center justify-center ${steps[2] ? "bg-purplish" : "bg-light-purple"}`}>
                            <h3 className={`font-extrabold text-2xl h-9 ${steps[2] ? "text-whitish" : "text-purplish"}`}>3</h3>
                        </div>
                    </div>
                    <div className={`w-full ${tab == "SETUP" ? "block" : "hidden"}`}>
                        <Setup errors={state?.step_one_errors as SetupErrorsType} setupData={setupData} setSetupData={setSetupData} />
                    </div>
                    <div className={`w-full ${tab == "VISIBILITY" ? "block" : "hidden"}`}>
                        <Visibility errors={state?.step_two_errors as VisibilityErrorsType} visibilityData={visibilityData} setVisibility={setVisibilityData} changeStepFn={changeStepFn} />
                    </div>
                    <div className={`w-full ${tab == "SUMMARY" ? "block" : "hidden"}`}>
                        <Summary visibilityData={visibilityData} setupData={setupData} changeStepFn={changeStepFn} />
                    </div>
                </form>
            </div>
        </div>
    )
}
