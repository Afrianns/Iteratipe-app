import Toggle from "@/components/toggle"

export default function VisibilitySettingsForm() {

    return (
        <>
            <div className="flex items-center gap-2">
                <input type="radio" id="public" name="visibility" value="public" className="input-radio-style" />
                <label htmlFor="public">
                    <h3 className="label-style">Public</h3>
                    <p className="p-style">Will be visible to everyone even when the project is in progress.</p>
                </label>
            </div>
            <div className="flex items-center gap-2">
                <input type="radio" id="partial-public" name="visibility" value="semi" className="input-radio-style" />
                <label htmlFor="partial-public">
                    <h3 className="label-style">Partial Private</h3>
                    <p className="p-style">Will only be visible by everyone when the project is completed.</p>
                </label>
            </div>
            <div className="flex items-center gap-2">
                <input type="radio" id="private" name="visibility" value="private" className="input-radio-style" />
                <label htmlFor="private">
                    <h3 className="label-style">Private</h3>
                    <p className="p-style">Project will completely private and only visible to you.</p>
                </label>
            </div>
            {/* <ErrorMessageList messages="Visibility" inputName={visibilityData.visibility} /> */}
            <h4 className="h-four-style">Comments Setting</h4>
            <Toggle label="Disable Comments" />

            <hr className="hr-style my-6" />

            <div className="space-y-3">
                <label htmlFor="client" className="label-style">Client*</label>
                <input type="text" name="client" placeholder="Type your client project name" className="input-style" />
                <span className="span-style">*) If the project is base on client, you can include client name. otherwise you can leave it blank</span>
            </div>
        </>
    )
}