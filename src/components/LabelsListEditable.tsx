"use client"

import { useGradientScrollEdge } from "@/hooks/useGradientScrollEdge";
import { handleScroll } from "@/lib/handleScroll";
import { SettingContext } from "@/lib/settingContext";
import { labelType } from "@/types/types";
import { CircleX } from "lucide-react";
import { useContext } from "react";

export default function LabelsListEditable({labelType, colorFrom}: {labelType: "tags"|"tools", colorFrom: string}) {
    const [scrollLabelsRef, showGradientLabelsLeft, showGradientLabelsRight] = useGradientScrollEdge(handleScroll);

    const { generalSettings, setGeneralSettings } = useContext(SettingContext)
    
    console.log(labelType, generalSettings[labelType], generalSettings)

    const removeThisLabel = (thisLabel: labelType) => {
        setGeneralSettings((prevGeneralSettings) => ({...generalSettings, [labelType]: prevGeneralSettings[labelType].filter((label) => label.id != thisLabel.id)}))
    }

    return (
        <>
            <span className={`scroll-edge-style right-0 bg-linear-to-l ${colorFrom} from-45% to-transparent to-90% ${
                showGradientLabelsRight ? 'opacity-100' : 'opacity-0'
            }`}></span>
            
            <span className={`scroll-edge-style left-0 bg-linear-to-r ${colorFrom} from-45% to-transparent to-90% ${
                showGradientLabelsLeft ? 'opacity-100' : 'opacity-0'
            }`}></span>


            <div className="scroll-container-style" ref={scrollLabelsRef}>

                    {generalSettings[labelType].map((label: labelType, index: number) =>
                        <div key={index} className="badge-style-secondary flex items-center gap-x-3">
                            {label.name}
                            <CircleX onClick={() => removeThisLabel(label)} className="icon-style-secondary p-0! w-4! h-4!" />
                        </div>
                    )}
            </div>
        </>
    )
}