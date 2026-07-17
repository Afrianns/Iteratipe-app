"use client";
import { labelType, SetupType } from "@/types/types";
import { useState } from "react";

interface DropdownListType {
  setupData?: SetupType
  valueFn?: (data: SetupType) => void
  type: string
  name: string
  placeholder: string 
  children: React.ReactNode
}

export default function DropdownList({setupData, valueFn, type, name, children, placeholder }: DropdownListType) {
  const [isOpen, setIsOpen] = useState(false);

  const bindInput = (stateValue?: SetupType, setStateFn?: (data: SetupType) => void) => {
    if(stateValue && setStateFn){
      let status = (stateValue.status) ? JSON.parse(stateValue.status).name : ""

      return {
        value:  status,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStateFn((
          {...stateValue, status: stateValue.status}
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