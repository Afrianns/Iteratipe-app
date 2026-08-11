import { tempErrorHandle } from "@/lib/tempErrorHandle";
import axios from "axios";

const credentialUpload = {
  cloud_name: 'wgl8igqx', 
  api_key: '337924252329486', 
  api_secret: 'U2QpqppAKg0F5nFQU6AfVttnjZ0'
}


export async function POST(request: Request) {
    const url = `https://${credentialUpload.api_key}:${credentialUpload.api_secret}@api.cloudinary.com/v1_1/${credentialUpload.cloud_name}/image/upload?upload_preset=main-preset`;

    const formData = await request.formData();
      

    const file = formData.get("file")

    if(!file) return Response.json({ data: "no data" })

    console.log(file, formData)
    try {
      const response = await axios.post(url, formData)

      console.log('result ', response.status)
      let returnResult = {}
      if(response.status == 200) {
        returnResult = response.data
      } else{
        returnResult = {
          status: response.status,
          message: response.statusText
        }
      }
      return Response.json(returnResult)
    } catch (error) {
      return tempErrorHandle(error)
    }
}