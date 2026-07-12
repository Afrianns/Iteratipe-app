import { useFormStatus } from "react-dom";

export default function EditedSavedButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={`py-2 px-5 ${pending ? 'bg-light-purple/20 cursor-not-allowed' : 'bg-light-purple/50 hover:bg-light-purple cursor-pointer'} rounded-lg text-purplish`}>
            {pending ? "Saving...": "Save"}
        </button>
    )
}