"use client"

import { DBSettingInfo, generalDataType, generalSettingErrorsType, labelType, Tab, VISIBLE } from "@/types/types";
import GeneralSettings from "./settings/GeneralSettings";
import Menu from "./settings/Menu";
import VisibilitySetting from "./settings/VisibilitySettings";
import { createContext, useState } from "react";
import { SettingContext } from "@/contexts/settingContext";
import { generalSettingSchema } from "@/lib/validations";
import { useSearchParams } from "next/navigation";

export default function Settings() {

    const tab = useSearchParams().get('tab')

    let subSetting = <GeneralSettings />

    if(tab)
        subSetting = (tab == "general") ? <GeneralSettings /> : <VisibilitySetting />
    
    return (
        <div className="container-style">
            <div className="limit-breaker w-full grid md:grid-cols-4 gap-5 items-start">
                <div className="col-span-1 sticky top-5">
                    <Menu />
                </div>
                {subSetting}
            </div>
        </div>
    )
}