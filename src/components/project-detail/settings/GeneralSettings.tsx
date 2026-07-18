"use server"

import updateGeneralSetting from "@/actions/updateGeneralSetting"
import GeneralSettingForm from "./GeneralSettingsForm"
import { getAllStatus, getAllTags, getAllTools, getAllTypes } from "@/actions/getAllLabels"
import { generalSettingErrorsType, labelType } from "@/types/types"

let generalSettingErrors: generalSettingErrorsType = {
    name: [],
    summary: [],
    type: [],
    status: [],
    tags: [],
    tools: [],
}

export default async function GeneralSettings() {

    let allTags: labelType[] = []
    let allTools: labelType[] = []
    let allTypes: labelType[] = []
    let allStatus: labelType[] = []


    const [tags, tools, status, types] = await Promise.all([
        getAllTags(),
        getAllTools(),
        getAllStatus(),
        getAllTypes()
    ]);

    allTypes = types;
    allStatus = status;
    allTools = tools;
    allTags = tags;
    

    return (
        <form className="card-style-secondary col-span-3 w-full" action={updateGeneralSetting}>
            <GeneralSettingForm allTypes={allTypes} allStatus={allStatus} allTools={allTools} allTags={allTags} errors={generalSettingErrors} />
            <div className="text-right">
                <button type="submit" className="button-style rounded-md">Save</button>
            </div>
        </form> 
    )
}
