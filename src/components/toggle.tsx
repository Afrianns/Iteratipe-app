"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
interface ToggleProps {
  label: string
  value: boolean
  setValue: () => void
}

export default function Toggle({ label = "Enable", value, setValue }: ToggleProps) {
  
  // Refs to target the elements for GSAP animation
  const handleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Trigger GSAP animation whenever the state changes
  useEffect(() => {
    if (value) {
      gsap.to(handleRef.current, { x: 20, duration: 0.25, ease: "power2.out" });
      gsap.to(trackRef.current, { backgroundColor: "#793EEE", duration: 0.25 });
    } else {
      gsap.to(handleRef.current, { x: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(trackRef.current, { backgroundColor: "#EFEFEE", duration: 0.25 });
    }
  }, [value]);

  return (
    <div className="flex items-center gap-3 cursor-pointer select-none">
      <input type="hidden" name="disable_comments" value={String(value)} />
      <div onClick={setValue}
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
