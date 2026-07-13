"use client";
import { useState } from "react";

export default function DropdownList({ type, name, children, placeholder }: {type: string, name: string, placeholder: string, children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          className="input-style" 
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
        />
        {isOpen && (
            <div className={`w-full max-h-50 rounded-md card-style space-y-0! overflow-y-auto absolute z-2 ${type == "tags" ? "top-15" : "bottom-15" }`}>
                {children}
            </div>
        )}
    </div>
  );
}