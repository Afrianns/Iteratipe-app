import { returnDataType } from "@/types/types"
import { toast } from "sonner"


export const tempErrorHandle = (error: unknown): returnDataType<any> => {
  console.log("an error: ", error)
        
  if(error instanceof Error){
    console.log("error message: ", error.message)
    // toast.error(error.message)  
    return {
        status: 500,
        message: `${error.message}, please try again later`
    }
  } else {
      return {
          status: 500,
          message: "An Error Occur"
      }
  }
}