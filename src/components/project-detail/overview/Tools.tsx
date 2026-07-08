import { ToolsType } from "@/types/types";
import ToolsList from "./ToolsList";

interface ToolsInterface { tools: ToolsType[] }

export default async function Tools({tools}: ToolsInterface) {
    
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(3000);
    setTimeout(() => {
        console.log("Waiting...")
    }, 10000)
   
    return (
        <>
            <h3 className="h-three-style z-2 relative">Tools</h3>
            <ToolsList tools={tools} />
        </>
    )
}