import GeneralSettingForm from "@/components/GeneralSettings"

export default function GeneralSettings() {
    const AllTags: string[] = ["Identity", "Vintage"]
    const AllTools: string[] = ["Indesign", "Sketch", "Blender", "Inkscape", "Adobe XD", "Adobe Illustrator"]
    return (
        <form action="/" className="card-style-secondary col-span-3 w-full">
            <GeneralSettingForm AllTools={AllTools} AllTags={AllTags} />
            <div className="text-right">
                <button className="button-style rounded-md">Save</button>
            </div>
        </form> 
    )
}
