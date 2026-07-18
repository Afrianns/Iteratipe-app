"use client"

import { useState } from "react"
import { generalSettingErrorsType, generalSettingType, labelType } from "@/types/types"
import GeneralForm from "@/components/GeneralForm"

const initialGeneralData = {
    name: "",
    summary: "",
    type: "",
    status: "",
    tags: [],
    tools: [],
}


export default function GeneralSettingForm({ allTags, allTools, allStatus, allTypes, errors }: { allTags: labelType[], allTools: labelType[], allStatus: labelType[], allTypes: labelType[], errors: generalSettingErrorsType}) {
    
    const [generalData, setGeneralData] = useState<generalSettingType>(initialGeneralData);

    const [selectedTags, setSelectedTags] = useState<labelType[]>([])
    const [selectedTools, setSelectedTools] = useState<labelType[]>([])

    return (
        <GeneralForm allTags={allTags} allTools={allTools} allStatus={allStatus} allTypes={allTypes} generalData={generalData} 
            setGeneralData={setGeneralData} 
            selectedTags={selectedTags}
            
            setSelectedTags={setSelectedTags}
            selectedTools={selectedTools}
            setSelectedTools={setSelectedTools}
            errors={errors} />
    )
}
