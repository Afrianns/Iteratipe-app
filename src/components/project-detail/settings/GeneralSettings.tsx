import { ChevronDown } from "lucide-react"
import { Suspense } from "react"

import ListTagsSetting from "./ListTagsSetting";
import ListToolsSetting from "./ListToolsSetting";
import DropdownList from "./DropdownList";

export default function GeneralSettings() {
    const AllTags = ["Identity", "Vintage"]
    const AllTools = ["Indesign", "Sketch", "Blender", "Inkscape", "Adobe XD", "Adobe Illustrator"]
    return (
        <form action="/" className="card-style-secondary col-span-3 w-full">
            <div className="space-y-3">
                <label htmlFor="name" className="label-style">Name</label>
                <input type="text" name="name" placeholder="Type your project name." className="input-style" required/>
            </div>
            <div className="space-y-3 relative">
                <label htmlFor="tags" className="label-style">Tags</label>
                <DropdownList placeholder="Type your relevant tags." type="tags">
                    <div>
                        {AllTags.map((tag: string, idx: number) => <p key={idx} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{tag}</p>)}
                    </div>
                </DropdownList>
                {/* <input type="text" name="tags" placeholder="Type your relevant tags." className="input-style" required/> */}
                <Suspense fallback={<ListSettingLoading />}>
                    <ListTagsSetting />
                </Suspense>
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

            <div className="space-y-3 relative">
                <label htmlFor="tools" className="label-style">Tools</label>
                <DropdownList placeholder="Type your relevant Tools." type="tools">
                    {AllTools.map((tool: string, idx: number) => <p key={idx} className="w-full block py-2 px-5 cursor-pointer hover:bg-gray-100">{tool}</p>)}
                </DropdownList>
                {/* <input type="text" name="tools" placeholder="Type your relevant Tools." className="input-style" required/> */}

                <div className="flex items-center gap-x-2">
                    <Suspense fallback={<ListSettingLoading />}>
                        <ListToolsSetting />
                    </Suspense>
                </div>
            </div>

            <div className="text-right">
                <button className="button-style rounded-md">Save</button>
            </div>
        </form> 
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