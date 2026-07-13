"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface ToggleProps {
  label?: string;
  onToggle?: (checked: boolean) => void;
}

export default function Toggle({ label = "Enable", onToggle }: ToggleProps) {
  const [isChecked, setIsChecked] = useState(false);
  
  // Refs to target the elements for GSAP animation
  const handleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const nextState = !isChecked;
    setIsChecked(nextState);
    if (onToggle) onToggle(nextState);
  };

  // Trigger GSAP animation whenever the state changes
  useEffect(() => {
    if (isChecked) {
      // Animate handle right and turn track background indigo
      gsap.to(handleRef.current, { x: 20, duration: 0.25, ease: "power2.out" });
      gsap.to(trackRef.current, { backgroundColor: "#793EEE", duration: 0.25 });
    } else {
      // Reset handle to left and restore track background gray
      gsap.to(handleRef.current, { x: 0, duration: 0.25, ease: "power2.out" });
      gsap.to(trackRef.current, { backgroundColor: "#EFEFEE", duration: 0.25 });
    }
  }, [isChecked]);

  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      {/* Hidden checkbox for browser accessibility */}
      <input
        type="checkbox"
        name="disable_comments"
        checked={isChecked}
        onChange={handleToggle}
        className="sr-only"
      />

      {/* Switch Track */}
      <div
        ref={trackRef}
        className="w-11 h-6 rounded-full p-0.5 bg-gray-300"
      >
        {/* Switch Handle */}
        <div
          ref={handleRef}
          className="w-5 h-5 bg-white rounded-full shadow-md"
        />
      </div>

      {/* Label Text */}
      {label && (
        <h3 className={`label-style`}>
          {label}
        </h3>
      )}
    </label>
  );
}
