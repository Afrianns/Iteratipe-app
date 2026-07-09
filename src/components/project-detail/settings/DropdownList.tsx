"use client";
import { useState } from "react";

export default function DropdownList({ type, children, placeholder }: {type: string, placeholder: string, children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <input
          type="text"
          placeholder={placeholder}
          className="input-style" 
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
        />
        {isOpen && (
            <div className={`w-full max-h-50 rounded-md card-style overflow-y-auto absolute z-2 ${type == "tags" ? "top-25" : "bottom-25" }`}>
                {children}
            </div>
        )}
    </>
  );
}