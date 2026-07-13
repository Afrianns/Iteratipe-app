import { ChevronDown } from "lucide-react"
import { Suspense } from "react"
import ListTagsSetting from "./ListTagsSetting"
import ListToolsSetting from "./ListToolsSetting"
import DropdownList from "./DropdownList"

export default function GeneralSettingForm({ AllTags, AllTools }: { AllTags: string[], AllTools: string[]}) {
    return (
        <>
            <div className="space-y-3">
                <label htmlFor="name" className="label-style">Name</label>
                <input type="text" name="name" placeholder="Type your project name." className="input-style" required/>
            </div>
            <div className="space-y-3">
                <label htmlFor="summary" className="label-style">Summary</label>
                <textarea name="summary" id="summary" placeholder="Type your project summary." className="input-style min-h-20"></textarea>
            </div>
            <div className="space-y-3">
                <label htmlFor="status" className="label-style">Status</label>
                <div className="relative">
                    <input type="text" name="status" placeholder="Select relevant project status." className="input-style" required/>
                    <ChevronDown className="absolute right-5 top-2 icon-style" />
                </div>
            </div>
            <div className="space-y-3 relative">
                <label htmlFor="tags" className="label-style">Tags</label>
                <DropdownList name="tags" placeholder="Type your relevant tags." type="tags">
                    <div>
                        {AllTags.map((tag: string, idx: number) => <p key={idx} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{tag}</p>)}
                    </div>
                </DropdownList>
                <Suspense fallback={<ListSettingLoading />}>
                    <ListTagsSetting />
                </Suspense>
            </div>

            <div className="space-y-3 relative">
                <label htmlFor="tools" className="label-style">Tools</label>
                <DropdownList name="tools" placeholder="Type your relevant Tools." type="tools">
                    {AllTools.map((tool: string, idx: number) => <p key={idx} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{tool}</p>)}
                </DropdownList>
                <Suspense fallback={<ListSettingLoading />}>
                    <ListToolsSetting />
                </Suspense>
            </div>
        </>
    )
}


const ListSettingLoading = () => {
    return (
        <div className="animate-pulse scroll-container-style flex gap-x-2 overflow-hidden"> 
            <div className="h-7 w-16 bg-slate-200 rounded-lg shrink-0" />
            <div className="h-7 w-24 bg-slate-200 rounded-lg shrink-0" />
            <div className="h-7 w-14 bg-slate-200 rounded-lg shrink-0" />
        </div>
    )
} 