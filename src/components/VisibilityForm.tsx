import { VisibilityErrorsType, VisibilityType } from "@/types/types";
import { ErrorMessageList } from "./ErrorMessageList";
import Toggle from "./toggle";
import { useContext } from "react";
import { SettingContext } from "@/contexts/settingContext";

export default function VisibilityForm() {

    const { generalSettings, setGeneralSettings, generalSettingErrors, setGeneralSettingErrors } = useContext(SettingContext);
    console.log(generalSettingErrors)

    const handleToggle = () => {
        setGeneralSettings({...generalSettings, disable_comments: !generalSettings.disable_comments})
    };
    return (
        <>
            <div className="flex items-center gap-2">
                <input type="radio" id="public" name="visibility" defaultChecked={generalSettings.visibility === "PUBLIC"} onChange={(e) => setGeneralSettings({ ...generalSettings, visibility: "PUBLIC"})} value="PUBLIC" className="input-radio-style" />
                <label htmlFor="public">
                    <h3 className="label-style">Public</h3>
                    <p className="p-style">Will be visible to everyone even when the project is in progress.</p>
                </label>
            </div>
            <div className="flex items-center gap-2">
                <input type="radio" id="partial-public" name="visibility" defaultChecked={generalSettings.visibility === "SEMI"} onChange={(e) => setGeneralSettings({ ...generalSettings, visibility: "SEMI"})} value="SEMI" className="input-radio-style" />
                <label htmlFor="partial-public">
                    <h3 className="label-style">Partial Private</h3>
                    <p className="p-style">Will only be visible by everyone when the project is completed.</p>
                </label>
            </div>
            <div className="flex items-center gap-2">
                <input type="radio" id="private" name="visibility" defaultChecked={generalSettings.visibility === "PRIVATE"} onChange={(e) => setGeneralSettings({ ...generalSettings, visibility: "PRIVATE"})} value="PRIVATE" className="input-radio-style" />
                <label htmlFor="private">
                    <h3 className="label-style">Private</h3>
                    <p className="p-style">Project will completely private and only visible to you.</p>
                </label>
            </div>
            <ErrorMessageList inputName="Visibility" messages={generalSettingErrors.visibility} />
            
            <h4 className="h-four-style">Comments Setting</h4>
            <Toggle setValue={handleToggle} value={generalSettings.disable_comments} label="Disable Comments" />
            <ErrorMessageList inputName="Comments" messages={generalSettingErrors.disable_comments} />
            <hr className="hr-style my-6" />

            <div className="space-y-3">
                <label htmlFor="client" className="label-style">Client*</label>
                <input type="text" name="client" placeholder="Type your client project name" className="input-style" value={generalSettings.client_name} onChange={(e) => setGeneralSettings({...generalSettings, client_name: e.target.value})} />
                <span className="span-style">*) If the project is base on client, you can include client name. otherwise you can leave it blank</span>
            </div>
            <ErrorMessageList inputName="Client" messages={generalSettingErrors.client_name} />
        </>

    )
}