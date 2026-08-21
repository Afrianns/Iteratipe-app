import { returnDataType } from "@/types/types"

export const clientSideErrorHandle = (error: unknown): returnDataType<any> => {
  if(error instanceof Error){
    console.log("error message: ", error.message)
    return {
        status: 500,
        message: `${error.message}, please try again later`
    }
  } 
  return {
      status: 500,
      message: "An Error Occur"
  }
}