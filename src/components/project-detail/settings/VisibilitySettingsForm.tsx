"use client"

import VisibilityForm from "@/components/VisibilityForm"
import { VisibilityErrorsType, VisibilityType } from "@/types/types"
import { useState } from "react"

const initialVisibilityData: VisibilityType = {
    visibility: "PUBLIC",
    disable_comments: false,
    client_name: ""
}

const visibilityErrors: VisibilityErrorsType = {
    visibility: [],
    disable_comments: [],
    client_name: []
}

export default function VisibilitySettingsForm() {

    const [visibilityData, setVisibilityData] = useState<VisibilityType>(initialVisibilityData)
    return (
        <>
            <VisibilityForm visibilityData={visibilityData} setVisibilityData={setVisibilityData} errors={visibilityErrors} />
        </>
    )
}