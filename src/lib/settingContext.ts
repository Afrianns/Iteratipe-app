import { generalDataType, generalSettingErrorsType, generalSettingType, labelType, VISIBLE } from "@/types/types";
import { createContext } from "react";


// const generalData: generalDataType = 


interface SettingContextType {
  generalSettings: generalDataType
  generalSettingErrors: generalSettingErrorsType
  setGeneralSettings: (params: generalDataType) => void
  setGeneralSettingErrors: (params: generalSettingErrorsType) => void
}

export const SettingContext = createContext<SettingContextType>({
    generalSettings: {
      title: "",
      summary: "",
      type: {
        id: 0,
        name: ''
      },
      status: {
        id: 0,
        name: ''
      },
      tags: [],
      tools: [],
      visibility: "PUBLIC",
      disable_comments: false,
      client_name: ""
  },
  generalSettingErrors: {},
  setGeneralSettings: (params: generalDataType) => {},
  setGeneralSettingErrors: (params: generalSettingErrorsType) => {}
})