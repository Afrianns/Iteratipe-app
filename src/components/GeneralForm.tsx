import DropdownList from "@/components/DropdownList";
import { ErrorMessageList } from "@/components/ErrorMessageList";
import { generalSettingErrorsType, generalSettingType, labelType, Step } from "@/types/types";

interface generalFormTypes {
    generalData: generalSettingType
    allTags: labelType[]
    allTools: labelType[]
    allStatus: labelType[]
    allTypes: labelType[]
    
    setSelectedTags: (params: labelType[]) => void
    selectedTags: labelType[]

    setSelectedTools: (params: labelType[]) => void
    selectedTools: labelType[]
    
    setGeneralData: (params: generalSettingType) => void
    errors: generalSettingErrorsType | undefined
}

export default function GeneralForm({
    allTags, allTools, allStatus, allTypes, generalData, 
    setGeneralData, 
    selectedTags,
    setSelectedTags,
    selectedTools,
    setSelectedTools,
    errors }: generalFormTypes) {

    const changeToThis = (key: string, value: labelType) =>
        setGeneralData(({...generalData, [key]: JSON.stringify(value)}))

    return (
        <>
            <h1 className="text-xl font-bold">Project Setup</h1>
            <div className="space-y-3">
                <label htmlFor="name" className="label-style">Name</label>
                <input type="text" name="name" onChange={(e) => setGeneralData(({...generalData, name: e.target.value}))} value={generalData.name} placeholder="Type your project name." className="input-style" />
                <ErrorMessageList inputName="Name" messages={errors?.name} />
            </div>
            <div className="space-y-3">
                <label htmlFor="summary" className="label-style">Summary</label>
                <textarea name="summary" id="summary" onChange={(e) => setGeneralData(({...generalData, summary: e.target.value}))} value={generalData.summary} placeholder="Type your project summary." className="input-style min-h-20"></textarea>
                <ErrorMessageList inputName="Summary" messages={errors?.summary} />
            </div>
            <div className="space-y-3 relative">
                <label htmlFor="type" className="label-style">Type</label>
                <DropdownList setupData={generalData} valueFn={setGeneralData} name="type-name" placeholder="Type your relevant type." type="type">
                    {allTypes.map((type: labelType, idx: number) => (
                        <div key={idx}>
                            <p onMouseDown={() => changeToThis("type", type)} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{type.name}</p>
                        </div>)
                    )}
                </DropdownList>
                <input type="hidden" name="type" value={generalData.type} />
                <ErrorMessageList inputName="type" messages={errors?.type} />
            </div>

            <div className="space-y-3 relative">
                <label htmlFor="status" className="label-style">Status</label>
                <DropdownList setupData={generalData} valueFn={setGeneralData} name="status-name" placeholder="Type your relevant tags." type="status">
                    {allStatus.map((status: labelType, idx: number) => (
                        <div key={idx}>
                            <p onMouseDown={() => changeToThis("status", status)} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{status.name}</p>
                        </div>)
                    )}
                </DropdownList>
                <input type="hidden" name="status" value={generalData.status} />
                <ErrorMessageList inputName="Status" messages={errors?.status} />
            </div>

            <div className="space-y-3 relative">
                <label htmlFor="tags" className="label-style">Tags</label>
                <DropdownList name="tag_input" placeholder="Type your relevant tags." type="tags">
                    {allTags.map((tag: labelType, idx: number) => <p key={idx} onMouseDown={() => setSelectedTags([...selectedTags, tag])} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{tag.name}</p>)}
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
                    {allTools.map((tool: labelType, idx: number) => <p key={idx} onMouseDown={() => setSelectedTools([...selectedTools, tool])} className="w-full block py-3 px-5 cursor-pointer hover:bg-gray-100">{tool.name}</p>)}
                </DropdownList>
                <div className="flex gap-x-2">
                    {selectedTools.map((tool, idx) => <div key={idx}>
                        <span className="badge-style-secondary">{tool.name}</span>
                        <input type="hidden" name="tools[]" defaultValue={JSON.stringify(tool)} />
                    </div> )}
                </div>
                <ErrorMessageList inputName="Tools" messages={errors?.tools} />
            </div>
        </>
    )
}