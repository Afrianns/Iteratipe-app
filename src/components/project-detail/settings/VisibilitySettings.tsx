import VisibilityForm from "@/components/VisibilityForm";
import { SettingContext } from "@/contexts/settingContext";
import { updateVisibilitySchema } from "@/lib/validations";
import axios from "axios";
import { toast } from 'sonner'

import { useContext, useState } from "react";
import z from "zod";
import SubmitButton from "@/components/SubmitButton";

export default function VisibilitySetting() {
    const { generalSettings, setGeneralSettingErrors } = useContext(SettingContext)

    const [loading, setLoading] = useState(false)
    
    const updateVisibilitySetting = () => {
        setLoading(true)
        validateAndUpdateSetting()
    }

    const validateAndUpdateSetting = async () => {
        const updateValidation = updateVisibilitySchema.safeParse(generalSettings)

        if(!updateValidation.success){
            return setGeneralSettingErrors(z.flattenError(updateValidation.error).fieldErrors)
        }

        console.log(updateValidation, generalSettings)
        try {
            if(generalSettings.id){
                const result = await axios.patch("http://localhost:3000/api/project",
                    {
                        id: updateValidation.data.id,
                        visibility: updateValidation.data.visibility,
                        disable_comments: updateValidation.data.disable_comments,
                        client_name: updateValidation.data.client_name
                    }
                )

                if(result.status == 200){
                    toast.success(result.statusText)
                }
                console.log("update status: ", result)
            } else{
                throw new Error("There is an error occur while updating your project, please try again later!");
            }

        } catch (error: unknown) {
            if(axios.isAxiosError<{ errors_message: Record<string, string[]> }>(error)) {
                console.log(error.response)

                if(error.response)
                    setGeneralSettingErrors(error.response.data.errors_message)
                
                toast.error(error.message)
                // do sentry thing!? 
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="card-style-secondary col-span-3 w-full">
            <form action={updateVisibilitySetting} className="space-y-3">
                <h4 className="h-four-style">Project Visibility</h4>
                <VisibilityForm />
                <div className="text-right">
                    <SubmitButton loading={loading} name="Save" />
                </div>
            </form>
        </div>
    )
}