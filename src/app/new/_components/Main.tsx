"use client"

import Summary from "./Summary";
import { useState } from "react";
import { generalDataType, generalSettingErrorsType, Step, VisibilityType } from "@/types/types";
import { SettingContext } from "@/lib/settingContext";
import { generalSettingSchema, VisibilitySchema } from "@/lib/validations";
import z from "zod";
import GeneralForm from "@/components/GeneralForm";
import VisibilityForm from "@/components/VisibilityForm";
import axios from "axios";


const stepOneFields = {
    title: "",
    summary: "",
    type: {},
    status: {},
    tags: [],
    tools: [],
}

const generalData: generalDataType = {
    title: "",
    summary: "",
    type: {
      id: 0,
      name: ''
    },
    status: {
      id: 0,
      name: ''
    },
    tags: [],
    tools: [],
    visibility: "PUBLIC",
    disable_comments: false,
    client_name: ""
}



let initialNewData = {
  title: "",
  summary: "",
  type: {},
  status: {},
  tags: [],
  tools: [],
  visibility: "PULBIC",
  disable_comments: false,
  client_name: ""
}

const stepTwoFields: VisibilityType = {
    visibility: "PUBLIC",
    disable_comments: false,
    client_name: ""
}

interface StoreErrorPayload {
  data?: { error_message: generalSettingErrorsType }
  [key: string]: any
}

// const FormAction: FormActionStateType = {
//     success: false,
//     next_step: "SETUP",
//     step_one_fields: stepOneFields,
//     step_one_errors: {
//         name: [],
//         summary: [],
//         type: [],
//         status: [],
//         tags: [],
//         tools: [],
//     }
// };

export default function Main() {
    
    const [steps, setSteps] = useState<[boolean, boolean, boolean]>([true, false, false])

    const [generalSettings, setGeneralSettings] = useState<generalDataType>(generalData)
    let [generalSettingErrors, setGeneralSettingErrors] = useState<generalSettingErrorsType>({}

    )

    const createdNewProject = async (data: FormData) => {
        
        const step = data.get("STEP");
        const currentStep = steps.filter(Boolean).length;


        switch (step) {
            case "SETUP":
                stepOneFn(currentStep)
                break;
            case "VISIBILITY":
                stepTwoFn(currentStep)
                break;
            case "SUMMARY":
                stepThreeFn(currentStep)
                break;
            default:
                stepOneFn(currentStep)
                break;
        }
    }


    const stepOneFn = (currentStep: number) => {
        // STEP ONE
        const resultGeneral = generalSettingSchema.safeParse(generalSettings)

        if(!resultGeneral.success){
            setGeneralSettingErrors({...z.flattenError(resultGeneral.error).fieldErrors})
        }

        if(resultGeneral.success && currentStep == 1){
            changeStepFn(currentStep + 1);
        }
    }

    const stepTwoFn = (currentStep: number) => {
        // STEP TWO
        const resultVisibility = VisibilitySchema.safeParse(generalSettings)
        
        if(!resultVisibility.success){
            setGeneralSettingErrors({...z.flattenError(resultVisibility.error).fieldErrors})
        }

        if(resultVisibility.success && currentStep == 2){
            changeStepFn(currentStep + 1);
        }
    }


    const stepThreeFn =  async (currentStep: number) => {
        if(currentStep != 3) return
        // STEP THREE
        try {
            const result = await axios.post("http://localhost:3000/api/project", 
                generalSettings
            )

            if(result.status == 200){
                console.log(result)
                // return result;
            }

        } catch (error: unknown) {
            if(axios.isAxiosError<{ errors_message: Record<string, string[]> }>(error) && error.response){
                setGeneralSettingErrors(error.response.data.errors_message)
                console.log("sss -", error.response)
            }
        }
    }


    const changeStepFn = (stepPosition: number) => {
        switch (stepPosition) {
            case 1:
                setSteps([true, false, false])
                break;
            case 2:
                setSteps([true, true, false])
                break;
            case 3:
                setSteps([true, true, true])
                break;
            default:
                setSteps([true, false, false])
                break;
        }
    }

    return (
        <>
            <SettingContext.Provider value={{generalSettings, generalSettingErrors, setGeneralSettings, setGeneralSettingErrors}}>
                <form action={createdNewProject} className="container-style mx-auto flex flex-col items-center justify-center transition-style">
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
                    <div className={`w-full ${steps.filter(Boolean).length == 1 ? "block" : "hidden"}`}>
                        <div className="card-style-secondary space-y-5 col-span-3 w-full max-w-200 mx-auto">
                            <GeneralForm />
                            <div className="flex items-center justify-end mt-10">
                                <button type="submit" name="STEP" value={"SETUP" as Step} className="button-style rounded-md">Next</button>
                            </div>
                        </div> 
                    </div>
                    <div className={`w-full ${steps.filter(Boolean).length == 2 ? "block" : "hidden"}`}>
                        <div className="card-style w-full px-4 py-5 max-w-200 mx-auto">
                            <VisibilityForm />
                            <div className="flex justify-between items-center mt-10">
                                <button  type="button" onClick={() => changeStepFn(1)} className="button-style-secondary rounded-md">Back</button>
                                <button type="submit" name="STEP" value={"VISIBILITY" as Step} className="button-style rounded-md">Next</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`w-full ${steps.filter(Boolean).length == 3 ? "block" : "hidden"}`}>
                        <Summary changeStepFn={changeStepFn} />
                    </div>
                </form>
            </SettingContext.Provider>
        </>
    )
}
