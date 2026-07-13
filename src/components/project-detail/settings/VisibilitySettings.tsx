import VisibilitySettingsForm from "@/components/VisibilitySettings"

export default function VisibilitySetting() {
    return (
        <div className="card-style-secondary col-span-3 w-full">
            <form action="" className="space-y-3">
                <h4 className="h-four-style">Project Visibility</h4>
                <VisibilitySettingsForm />
                <div className="text-right">
                    <button className="button-style rounded-md">Save</button>
                </div>
            </form>
        </div>
    )
}