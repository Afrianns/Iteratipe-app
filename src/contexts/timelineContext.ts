import { createContext } from "react";

interface TimelineContextType {
  ownerClerkId: string
}

export const TimelineContext = createContext<TimelineContextType>({
  ownerClerkId: "" 
})