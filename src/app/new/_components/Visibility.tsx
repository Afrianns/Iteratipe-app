import { ErrorMessageList } from "@/components/ErrorMessageList";
import Toggle from "@/components/toggle";
import VisibilityForm from "@/components/VisibilityForm";
import { Step, VisibilityErrorsType, VisibilityType } from "@/types/types";

export default function Visibility({ errors, changeStepFn, visibilityData, setVisibilityData }: { errors: VisibilityErrorsType, changeStepFn: (step: string) => void, visibilityData: VisibilityType, setVisibilityData: (visibilityData: VisibilityType) => void}) {
    return (
        <div className="card-style w-full px-4 py-5 max-w-200 mx-auto">
            <VisibilityForm visibilityData={visibilityData} setVisibilityData={setVisibilityData} errors={errors} />
            <div className="flex justify-between items-center mt-10">
                <button onClick={() => changeStepFn("SETUP")} className="button-style-secondary rounded-md">Back</button>
                <button type="submit" name="step" value={"VISIBILITY" as Step} className="button-style rounded-md">Next</button>
            </div>
        </div>
    )
}