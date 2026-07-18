"use server"

import { generalSettingSchema } from "@/lib/validations"

export default async function updateGeneralSetting(formData: FormData) {
    const generalSettingValidate = {
        name : formData.get("name"),
        summary : formData.get("summary"),
        type : formData.get("type"),
        status : formData.get("status"),
        tags : formData.getAll("tags[]"),
        tools : formData.getAll("tools[]")
    }

    const generalSettingValidated = generalSettingSchema.safeParse(generalSettingValidate)

    console.log(generalSettingValidated)
}