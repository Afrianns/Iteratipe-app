import { useEffect, useState } from "react";

import { labelType, generalSettingErrorsType, Step, generalSettingType } from "@/types/types";
import { getAllStatus, getAllTags, getAllTools, getAllTypes } from "@/actions/getLabels";
import GeneralForm from "@/components/GeneralForm";

export default function Setup() {
    
    // useEffect(() => {
    //     Promise.all([getAllTags(), getAllTools(), getAllStatus(), getAllTypes()])
    //     .then(([tags, tools, status, types]) => {
    //         setAllTags(tags);
    //         setAllTools(tools);
    //         setAllStatus(status);
    //         setAllTypes(types);
    //     })
    //     .catch((error) => {
    //         console.error("Failed to load initial setup data: ", error);
    //     })
    // },[])
    
    return <p>s</p>
}