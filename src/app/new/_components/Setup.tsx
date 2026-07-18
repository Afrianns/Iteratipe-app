import { useEffect, useState } from "react";

import DropdownList from "@/components/DropdownList";
import { ErrorMessageList } from "@/components/ErrorMessageList";
import { labelType, generalSettingErrorsType, generalSettingType, Step } from "@/types/types";
import { getAllStatus, getAllTags, getAllTools, getAllTypes } from "@/actions/getAllLabels";
import GeneralForm from "@/components/GeneralForm";

export default function Setup({ setupData, errors, setSetupData }: {setupData: generalSettingType, errors: generalSettingErrorsType | undefined, setSetupData: (data: generalSettingType) => void}) {
    
    const [allTags, setAllTags] = useState<labelType[]>([])
    const [allTools, setAllTools] = useState<labelType[]>([])
    const [allStatus, setAllStatus] = useState<labelType[]>([])
    const [allTypes, setAllTypes] = useState<labelType[]>([])

    const [selectedTags, setSelectedTags] = useState<labelType[]>([])
    const [selectedTools, setSelectedTools] = useState<labelType[]>([])
    
    useEffect(() => {
        Promise.all([getAllTags(), getAllTools(), getAllStatus(), getAllTypes()])
        .then(([tags, tools, status, types]) => {
            setAllTags(tags);
            setAllTools(tools);
            setAllStatus(status);
            setAllTypes(types);
        })
        .catch((error) => {
            console.error("Failed to load initial setup data: ", error);
        })
    },[])
    
    return (
        <div className="card-style-secondary col-span-3 w-full max-w-200 mx-auto">
            <GeneralForm allTags={allTags} allTools={allTools} allStatus={allStatus} allTypes={allTypes} generalData={setupData} 
                setGeneralData={setSetupData} 
                selectedTags={selectedTags}

                setSelectedTags={setSelectedTags}
                selectedTools={selectedTools}
                setSelectedTools={setSelectedTools}
                errors={errors} />
            <div className="flex items-center justify-end mt-10">
                <button type="submit" name="step" value={"SETUP" as Step} className="button-style rounded-md">Next</button>
            </div>
        </div> 
    )
}