"use client";

import { useContext, useState } from "react"
import { SettingContext } from "@/contexts/settingContext"
import GeneralForm from "@/components/GeneralForm"
import axios from "axios";
import { updateGeneralSchema } from "@/lib/validations";
import z from "zod";
import SubmitButton from "@/components/SubmitButton";
import { toast } from "sonner";
import { redirect, usePathname, useSearchParams, useRouter } from "next/navigation";

export default function GeneralSettings() {

    const { generalSettings, setGeneralSettingErrors } = useContext(SettingContext)

    const [loading, setLoading] = useState(false);

    const router = useRouter()

    let pth = usePathname()

    const arrayOfUrl = pth.split('/')

    const updateSetting = () => {
        setLoading(true)
        validateAndUpdateGeneralSetting()
    }

    const validateAndUpdateGeneralSetting = async () => {
        const updateValidation = updateGeneralSchema.safeParse(generalSettings)

        if(!updateValidation.success){
            return setGeneralSettingErrors({...z.flattenError(updateValidation.error).fieldErrors})
        }
        
        
        
        try {
            if(generalSettings.id){
                const result = await axios.patch("http://localhost:3000/api/project",
                    updateValidation.data
                )
                
                if(result.status == 200){
                    toast.success(result.statusText)

                    if(updateValidation.data.title){
                        const projectName = arrayOfUrl[2].split("%E2%80%94")
                        const updatedUrl = `/${arrayOfUrl[1]}/${updateValidation.data.title.toLowerCase().split(" ").join("-")}%E2%80%94${projectName[1]}?menu=settings`
                        router.push(updatedUrl)
                    }
                } else{
                    throw new Error("An error occur while updating your project, please try again later!");
                    
                }
            }
        } catch (error: unknown) {
            if(axios.isAxiosError<{ errors_message: Record<string, string[]> }>(error)) {
                if(error.response)
                    setGeneralSettingErrors(error.response.data.errors_message)
                
                toast.error(error.message)
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="card-style-secondary col-span-3 w-full space-y-5" action={updateSetting}>
            <input type="hidden" name="project_id" value={generalSettings.id} />
            <GeneralForm />
            <div className="text-right">
                <SubmitButton loading={loading} name="Save" />
            </div>
        </form> 
    )
}
