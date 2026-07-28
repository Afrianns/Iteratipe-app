"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { generalDataType, VisibilityType } from "@/types/types";

interface ToggleProps {
  label: string
  generalSettings: generalDataType
  setGeneralSettings: (params: generalDataType) => void
}

export default function Toggle({ label = "Enable", generalSettings, setGeneralSettings }: ToggleProps) {
  
  // Refs to target the elements for GSAP animation
  const handleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setGeneralSettings({...generalSettings, disable_comments: !generalSettings.disable_comments})
  };

  // Trigger GSAP animation whenever the state changes
  useEffect(() => {
    if (generalSettings.disable_comments) {
      gsap.to(handleRef.current, { x: 20, duration: 0.25, ease: "power2.out" });
      gsap.to(trackRef.current, { backgroundColor: "#793EEE", duration: 0.25 });
    } else {
      gsap.to(handleRef.current, { x: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(trackRef.current, { backgroundColor: "#EFEFEE", duration: 0.25 });
    }
  }, [generalSettings]);

  return (
    <div className="flex items-center gap-3 cursor-pointer select-none">
      <input type="hidden" name="disable_comments" value={String(generalSettings.disable_comments)} />
      <div onClick={handleToggle}
        ref={trackRef}
        className="w-11 h-6 rounded-full p-0.5 bg-gray-300"
      >
        <div
          ref={handleRef}
          className="w-5 h-5 bg-white rounded-full shadow-md"
        />
      </div>

      {label && (
        <h3 className={`label-style`}>
          {label}
        </h3>
      )}
    </div>
  );
}
