import Toggle from "@/components/toggle";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

export default function Settings() {

    const [subSetting, setSubSetting] = useState<React.ReactNode>(<GeneralSetting />)
    const [currentSubSetting, setCurrentSubSetting] = useState<string>("general")

    const settingMenuFn = (menu: string) => {
        switch (menu) {
            case "general":
                setSubSetting(<GeneralSetting />)
                setCurrentSubSetting("general")
                break;
            case "visiblity":
                setSubSetting(<VisibilitySetting />)
                setCurrentSubSetting("visibility")
                break;
        
            default:
                break;
        }
    }

    const activeSubSettingFn = (menu: string) => currentSubSetting == menu && "bg-grayish/50"
    return (
        <div className="px-10 py-5">
            <div className="max-w-360 mx-auto w-full grid grid-cols-4 gap-5 items-start">
                <div className="col-span-1 sticky top-5">
                    <ul className="space-y-3">
                        <li onClick={() => settingMenuFn('general')} className={`menu-setting-style ${activeSubSettingFn('general')}`}>General</li>
                        <li onClick={() => settingMenuFn('visiblity')} className={`menu-setting-style ${activeSubSettingFn('visibility')}`}>Visibility</li>
                    </ul>
                </div>
                {subSetting}
            </div>
        </div>
    )
}



const GeneralSetting = () => {
    return (
        <form action="/" className="card-style-secondary col-span-3 w-full">
            <div className="space-y-3">
                <label htmlFor="name" className="label-style">Name</label>
                <input type="text" name="name" placeholder="Type your project name." className="input-style" required/>
            </div>
            <div className="space-y-3">
                <label htmlFor="tags" className="label-style">Tags</label>
                <input type="text" name="tags" placeholder="Type your relevant tags." className="input-style" required/>

                <div className="flex items-center gap-x-2">
                    <span className="tag-style">UI Design</span>
                    <span className="tag-style">Design</span>
                    <span className="tag-style">Logo</span>
                </div>
            </div>
            <div className="space-y-3">
                <label htmlFor="summary" className="label-style">Summary</label>
                <textarea name="summary" id="summary" placeholder="Type your project summary." className="input-style min-h-20"></textarea>
            </div>

            <div className="space-y-3">
                <label htmlFor="type" className="label-style">Type</label>
                <div className="relative">
                    <input type="text" name="type" placeholder="Select relevant project type." className="input-style" required/>
                    <ChevronDown className="absolute right-5 top-2 icon-style" />
                </div>
            </div>

            <div className="space-y-3">
                <label htmlFor="tools" className="label-style">Tools</label>
                <input type="text" name="tools" placeholder="Type your relevant Tools." className="input-style" required/>

                <div className="flex items-center gap-x-2">
                    <span className="tag-style">Illustration</span>
                    <span className="tag-style">Photoshop</span>
                    <span className="tag-style">Figma</span>
                </div>
            </div>

            <div className="text-right">
                <button className="button-style rounded-md">Save</button>
            </div>
        </form> 
    )
}

const VisibilitySetting = () => {
    return (
        <div className="card-style-secondary col-span-3 w-full">
            <form action="" className="space-y-3">
                <h4 className="h-four-style">Project Visibility</h4>
                <div className="flex items-center gap-2">
                    <input type="radio" id="public" name="visibility" className="input-radio-style" required/>
                    <label htmlFor="public">
                        <h3 className="label-style">Public</h3>
                        <p className="p-style">Will be visible to everyone even when the project is in progress.</p>
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="radio" id="partial-public" name="visibility" className="input-radio-style" required/>
                    <label htmlFor="partial-public">
                        <h3 className="label-style">Partial Private</h3>
                        <p className="p-style">Will only be visible by everyone when the project is completed.</p>
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="radio" id="private" name="visibility" className="input-radio-style" required/>
                    <label htmlFor="private">
                        <h3 className="label-style">Private</h3>
                        <p className="p-style">Project will completely private and only visible to you.</p>
                    </label>
                </div>
                <h4 className="h-four-style">Comments Setting</h4>
                <Toggle label="Disable Comments" />

                <hr className="hr-style my-6" />

                <div className="space-y-3">
                    <label htmlFor="client" className="label-style">Client*</label>
                    <input type="text" name="client" placeholder="Type your client project name" className="input-style" required/>
                    <span className="span-style">*) If the project is base on client, you can include client name. otherwise you can leave it blank</span>
                </div>

                <div className="text-right">
                    <button className="button-style rounded-md">Save</button>
                </div>
            </form>
        </div>
    )
}