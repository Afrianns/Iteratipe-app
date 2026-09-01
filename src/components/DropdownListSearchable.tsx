"use client";


import { getLabels } from "@/actions/getLabels";
import { SettingContext } from "@/contexts/settingContext";
import { labelType, generalDataType } from "@/types/types";
import { useContext, useEffect, useState } from "react";

type NameType = "tags"|"tools"|"status"|"type"

interface DropdownListType {
  type: "multi" | "single"
  name: NameType
  placeholder: string 
  setSelectedLabels: (params: generalDataType) => void
  selectedLabels: generalDataType

}

export default function DropdownListSearchable({ type, name, setSelectedLabels, selectedLabels, placeholder }: DropdownListType) {
  
  // const [currentSelected, setCurrentSelected] = useState<string>("")
  const [allLabels, setAllLabels] = useState<labelType[]>([])
  const { generalSettings } = useContext(SettingContext)

  const [isOpen, setIsOpen] = useState(false);

  const [query, setQuery] = useState("");

  const message = "No Data";

  useEffect(() => {

    const getMatchData = async () => {

      try {
        let result = await getLabels(query, name);

        if(result.status == 200 && result.data) {
          setAllLabels(result.data);
        } else{
          throw new Error("there is an erorr while retrieved data")
        }
      } catch (error) {
        console.log(error)
      }
    }

    getMatchData();

  }, [query])

  const changeValue = (e: any) => {
    if(type == "multi"){
      setQuery(e.target.value)
    }
  }

  const selectedThisLabel = (label: labelType) => {

    if(type == "multi"){
      setSelectedLabels({...selectedLabels, [name]: [...(selectedLabels[name as keyof typeof selectedLabels] as labelType[]), label]})
    } else{
      setSelectedLabels({...selectedLabels, [name]: label})
    }
  }

  console.log('check', generalSettings[name])

  const selectedLength = Array.isArray(generalSettings[name]) ? (generalSettings[name] as labelType[]).length : 0

  return (
    <div className="relative">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          className="input-style"
          onChange={(e) => changeValue(e)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          autoComplete="off"
          value={(type == "multi") ? query : (selectedLabels[name as keyof typeof selectedLabels] as labelType).name || ''}
        />
        {isOpen && (
            <div className={`w-full max-h-50 rounded-md card-style space-y-0! overflow-y-auto absolute z-2 ${name == "tags" ? "top-15" : "bottom-15" }`}>
              {(allLabels.length - selectedLength) > 0 ? 
                <>
                  {filterAlreadyUsed(generalSettings[name] as labelType[], allLabels, name).map((label: labelType, idx: number) => <p key={idx} onMouseDown={() => selectedThisLabel(label)} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{label.name}</p>)}
                </>
              : 
                <p className="py-3 text-center">{message}</p>
              }
            </div>
        )}
    </div>
  );
}

const filterAlreadyUsed = (selectedLabels: labelType[], allLabels: labelType[], name: NameType) => {
  if(name == "tools" || name == "tags") {
    const filtered = allLabels.filter((label) => selectedLabels.findIndex((selectedLabel => selectedLabel.id == label.id)) == -1)
    console.log(filtered, allLabels, selectedLabels.findIndex((selectedLabel => selectedLabel.id == 77)))
    return filtered
  } else{
    return allLabels
  }
}