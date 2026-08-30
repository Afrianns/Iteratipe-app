import { ErrorMessageList } from "@/components/ErrorMessageList";
import DropdownListSearchable from "./DropdownListSearchable";
import { useContext } from "react";
import { SettingContext } from "@/lib/settingContext";
import LabelsListEditable from "./LabelsListEditable";

export default function GeneralForm() {

    const { generalSettings, generalSettingErrors, setGeneralSettings } = useContext(SettingContext)
    return (
        <>
            <h1 className="text-xl font-bold">Project Setup</h1>
            <div className="space-y-3">
                <label htmlFor="title" className="label-style">Title</label>
                <input type="text" name="title" onChange={(e) => setGeneralSettings(({...generalSettings, title: e.target.value}))} value={generalSettings.title} placeholder="Type your project title." className="input-style" />
                <ErrorMessageList inputName="title" messages={generalSettingErrors?.title} />
            </div>
            <div className="space-y-3">
                <label htmlFor="summary" className="label-style">Summary</label>
                <textarea name="summary" id="summary" onChange={(e) => setGeneralSettings(({...generalSettings, summary: e.target.value}))} value={generalSettings.summary} placeholder="Type your project summary." className="input-style min-h-20"></textarea>
                <ErrorMessageList inputName="Summary" messages={generalSettingErrors?.summary} />
            </div>
            <div className="space-y-3 relative">
                <label htmlFor="type" className="label-style">Type</label>
                <DropdownListSearchable setSelectedLabels={setGeneralSettings} selectedLabels={generalSettings} name="type" placeholder="Type your relevant status." type="single" />
                <ErrorMessageList inputName="type" messages={generalSettingErrors?.type} />
            </div>

            <div className="space-y-3 relative">
                <label htmlFor="status" className="label-style">Status</label>
                <DropdownListSearchable setSelectedLabels={setGeneralSettings} selectedLabels={generalSettings} name="status" placeholder="Type your relevant status." type="single" />
                <ErrorMessageList inputName="Status" messages={generalSettingErrors?.status} />
            </div>

            <div className="space-y-3">
                <label htmlFor="tags" className="label-style">Tags</label>
                <DropdownListSearchable setSelectedLabels={setGeneralSettings} selectedLabels={generalSettings} name="tags" placeholder="Type your relevant tags." type="multi" />
                <div className="relative">
                    <LabelsListEditable colorFrom="from-white" labelType="tags" />
                </div>
                <ErrorMessageList inputName="Tags" messages={generalSettingErrors?.tags} />
            </div>

            <div className="space-y-3">
                <label htmlFor="tools" className="label-style">Tools</label>
                <DropdownListSearchable setSelectedLabels={setGeneralSettings} selectedLabels={generalSettings} name="tools" placeholder="Type your relevant tools." type="multi" />
                <div className="relative">
                    <LabelsListEditable colorFrom="from-white" labelType="tools" />
                </div>
                <ErrorMessageList inputName="Tools" messages={generalSettingErrors?.tools} />
            </div>
        </>
    )
}