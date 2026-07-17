import { ChevronDown } from "lucide-react"
import DropdownList from "@/components/DropdownList";
import { labelType, SetupErrorsType, SetupType, Step } from "@/types/types";
import { ErrorMessageList } from "@/components/ErrorMessageList";
import { useEffect, useState } from "react";
import {getAllStatus, getAllTags, getAllTools} from "@/actions/getAllLabels";
import { stringify } from "querystring";

export default function Setup({ setupData, errors, setSetupData }: {setupData: SetupType, errors: SetupErrorsType | undefined, setSetupData: (data: SetupType) => void}) {

    
    let [allTags, setAllTags] = useState<labelType[]>([])
    let [allTools, setAllTools] = useState<labelType[]>([])
    let [allStatus, setAllStatus] = useState<labelType[]>([])
    
    useEffect(() => {
        Promise.all([getAllTags(), getAllTools(), getAllStatus()])
        .then(([tags, tools, status]) => {
            setAllTags(tags);
            setAllTools(tools);
            setAllStatus(status);
        })
        .catch((error) => {
            console.error("Failed to load initial setup data:", error);
        })
    },[])

    const [selectedTags, setSelectedTags] = useState<labelType[]>([])
    const [selectedTools, setSelectedTools] = useState<labelType[]>([])
    const addThisTags = (tag: labelType) => {
        setSelectedTags([...selectedTags, tag])
    }

    const addThisTools = (tool: labelType) => {
        setSelectedTools([...selectedTools, tool])
    }

    const changeToThisStatus = (status: labelType) => {
        setSetupData(({...setupData, status: JSON.stringify(status)}))
    }
    return (
        <div className="card-style-secondary col-span-3 w-full max-w-200 mx-auto">
            <h1 className="text-xl font-bold">Project Setup</h1>
            <div className="space-y-3">
                <label htmlFor="name" className="label-style">Name</label>
                <input type="text" name="name" onChange={(e) => setSetupData(({...setupData, name: e.target.value}))} value={setupData.name} placeholder="Type your project name." className="input-style" />
                <ErrorMessageList inputName="Name" messages={errors?.name} />
            </div>
            <div className="space-y-3">
                <label htmlFor="summary" className="label-style">Summary</label>
                <textarea name="summary" id="summary" onChange={(e) => setSetupData(({...setupData, summary: e.target.value}))} value={setupData.summary} placeholder="Type your project summary." className="input-style min-h-20"></textarea>
                <ErrorMessageList inputName="Summary" messages={errors?.summary} />
            </div>
            <div className="space-y-3 relative">
                <label htmlFor="status" className="label-style">Status</label>
                <DropdownList setupData={setupData} valueFn={setSetupData} name="status-name" placeholder="Type your relevant tags." type="status">
                    {allStatus.map((status: labelType, idx: number) => (
                        <div key={idx}>
                            <p onMouseDown={() => changeToThisStatus(status)} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{status.name}</p>
                        </div>)
                    )}
                </DropdownList>
                <input type="hidden" name="status" value={setupData.status} />
                {/* <div className="relative">
                    <input type="text" name="status" onChange={(e) => setSetupData(({...setupData, status: e.target.value}))} value={setupData.status} placeholder="Select relevant project status." className="input-style" />
                    <ChevronDown className="absolute right-5 top-2 icon-style" />
                </div> */}
                <ErrorMessageList inputName="Status" messages={errors?.status} />
            </div>

            <div className="space-y-3 relative">
                <label htmlFor="tags" className="label-style">Tags</label>
                <DropdownList name="tag_input" placeholder="Type your relevant tags." type="tags">
                    {allTags.map((tag: labelType, idx: number) => <p key={idx} onMouseDown={() => addThisTags(tag)} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{tag.name}</p>)}
                </DropdownList>
                <div className="flex gap-x-2">
                    {selectedTags.map((tag, idx) => <div key={idx}>
                        <span className="badge-style-secondary">{tag.name}</span>
                        <input name="tags[]" defaultValue={JSON.stringify(tag)} hidden />
                    </div> )}
                </div>
                <ErrorMessageList inputName="Tags" messages={errors?.tags} />
            </div>

            <div className="space-y-3 relative">
                <label htmlFor="tools" className="label-style">Tools</label>
                <DropdownList name="tool_input" placeholder="Type your relevant Tools." type="tools">
                    {allTools.map((tool: labelType, idx: number) => <p key={idx} onMouseDown={() => addThisTools(tool)} className="w-full block py-3 px-5 cursor-pointer hover:bg-gray-100">{tool.name}</p>)}
                </DropdownList>
                <div className="flex gap-x-2">
                    {selectedTools.map((tool, idx) => <div key={idx}>
                        <span className="badge-style-secondary">{tool.name}</span>
                        <input type="hidden" name="tools[]" defaultValue={JSON.stringify(tool)} />
                    </div> )}
                </div>
                <ErrorMessageList inputName="Tools" messages={errors?.tools} />
            </div>
            <div className="flex items-center justify-end mt-10">
                <button type="submit" name="step" value={"SETUP" as Step} className="button-style rounded-md">Next</button>
            </div>
        </div> 
    )
}