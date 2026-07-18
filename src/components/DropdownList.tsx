"use client";
import { labelType, generalSettingType } from "@/types/types";
import { useState } from "react";

interface DropdownListType {
  setupData?: generalSettingType
  valueFn?: (data: generalSettingType) => void
  type: string
  name: string
  placeholder: string 
  children: React.ReactNode
}

export default function DropdownList({setupData, valueFn, type, name, children, placeholder }: DropdownListType) {
  const [isOpen, setIsOpen] = useState(false);

  const bindInput = (stateValue?: generalSettingType, setStateFn?: (data: generalSettingType) => void) => {
    if(stateValue && setStateFn){
      let selectedValue = stateValue[type as keyof typeof setupData]

      return {
        value: (selectedValue) ? JSON.parse(selectedValue).name : "",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStateFn((
          {...stateValue, [type]: selectedValue}
        ))
      };
    }
  };

  return (
    <div className="relative">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          className="input-style" 
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          autoComplete="off"
          {...bindInput(setupData, valueFn)}
        />
        {isOpen && (
            <div className={`w-full max-h-50 rounded-md card-style space-y-0! overflow-y-auto absolute z-2 ${type == "tags" ? "top-15" : "bottom-15" }`}>
                {children}
            </div>
        )}
    </div>
  );
}