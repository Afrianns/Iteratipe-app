"use client"

import { generalDataType, generalSettingErrorsType, labelType, VISIBLE } from "@/types/types";
import GeneralSettings from "./settings/GeneralSettings";
import Menu from "./settings/Menu";
import VisibilitySetting from "./settings/VisibilitySettings";
import { createContext, useState } from "react";
import { SettingContext } from "@/lib/settingContext";
import { generalSettingSchema } from "@/lib/validations";

interface settingPropsType {
    data: {
        id: number
        title: string
        summary: string
        type: labelType
        status: labelType
        tags: labelType[]
        tools: labelType[]
        visibility: VISIBLE
        disable_comments: boolean
        client_name: string | null
    }
    tab?: string | undefined
}

export default function Settings({setting}: { setting: settingPropsType}) {

    const [generalSettings, setGeneralSettings] = useState<generalDataType>({
        id: setting.data.id,
        title: setting.data.title,
        summary: setting.data.summary,
        type: setting.data.type,
        status: setting.data.status,
        tags: setting.data.tags,
        tools: setting.data.tools,
        visibility: setting.data.visibility,
        disable_comments: setting.data.disable_comments,
        client_name: setting.data.client_name || "",
    })

    const [generalSettingErrors, setGeneralSettingErrors] = useState<generalSettingErrorsType>({})

    let subSetting = <GeneralSettings />

    if(setting.tab)
        subSetting = (setting.tab == "general") ? <GeneralSettings /> : <VisibilitySetting />
    
    return (
        <SettingContext.Provider value={{ generalSettings: generalSettings, setGeneralSettings: setGeneralSettings, generalSettingErrors: generalSettingErrors, setGeneralSettingErrors: setGeneralSettingErrors }}>
            <div className="container-style">
                <div className="limit-breaker w-full grid md:grid-cols-4 gap-5 items-start">
                    <div className="col-span-1 sticky top-5">
                        <Menu />
                    </div>
                    {subSetting}
                </div>
            </div>
        </SettingContext.Provider>
    )
}