import axios from "axios"
import { serverSideErrorHandle } from "./serverErrorHandle"
import { returnDataType } from "@/types/types"


export default async function uploadImage(blobUrl: string): Promise<returnDataType<{
  asset_id: string,
  image_url: string
}>> {

  try {
    let result = await getBlob(blobUrl)
    if(result) {
      const fileData  = new FormData()
      fileData.append("file", result)

      const response = await axios.post("/api/image", fileData)
      if(response.status == 200){
          return {
            status: 200,
            message: response.statusText,
            data: {
              image_url: response.data.image_url, 
              asset_id: response.data.asset_id
            }
          }
      } else{
          throw new Error(response.statusText);
      }
    }

    throw new Error("Image not found")
    
  } catch (error) {
    return await serverSideErrorHandle(error)
  }
}


const getBlob = async (blobUrl: string) => {
  const response = await axios.get(blobUrl, { responseType: 'blob' });
  return response.data;
}