import GeneralSettings from "./settings/GeneralSettings";
import Menu from "./settings/Menu";
import VisibilitySetting from "./settings/VisibilitySettings";

interface paramType {
    menu?: string | undefined,
    tab?: string | undefined,
}

export default function Settings({params}: { params: paramType}) {

    let subSetting = <GeneralSettings />

    if(params.tab)
        subSetting = (params.tab == "general") ? <GeneralSettings /> : <VisibilitySetting />
    
    return (
        <div className="px-10 py-5">
            <div className="max-w-360 mx-auto w-full grid grid-cols-4 gap-5 items-start">
                <div className="col-span-1 sticky top-5">
                    <Menu />
                </div>
                {subSetting}
            </div>
        </div>
    )
}