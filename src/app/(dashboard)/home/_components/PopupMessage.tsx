"use client"

import { useEffect } from "react";
import { toast } from "sonner";

export default function PopupMessage() {
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("success") === "true") {
        toast.success("Successfully Saved");
      }
    }, []);

    return (
      <>
      </>
    )
}