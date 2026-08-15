import { tempErrorHandle } from "@/lib/tempErrorHandle";
import axios from "axios";

const credentialUpload = {
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
}
const URL = `https://api.cloudinary.com/v1_1/${credentialUpload.cloud_name}`;

export async function POST(request: Request) {
  
  if(!credentialUpload.api_key || !credentialUpload.cloud_name || !credentialUpload.api_secret) {
    return {
      status: 500,
      message: "API key is not present"
    }
  }

  console.log(credentialUpload.api_key, credentialUpload.cloud_name, credentialUpload.api_secret)

  const formData = await request.formData();
    
  const file = formData.get("file")

  if(!file) return Response.json({ data: "no data" })

  try {
    const response = await axios.post(`${URL}/image/upload?upload_preset=main-preset`, formData, {
      auth: {
        username: credentialUpload.api_key,
        password: credentialUpload.api_secret
      }
    })

    console.log('result ', response.status)
    let returnResult = {}
    if(response.status == 200) {
      returnResult = {
        status: response.status,
        message: response.statusText,
        image_url: response.data.secure_url,
        asset_id: response.data.asset_id
      }
    } else{
      throw new Error(response.statusText);
    }
    return Response.json(returnResult)
  } catch (error) {
    if(error instanceof Error){
      console.log(error)
    }
    throw error
  }
}

export async function DELETE(request: Request) {

  if(!credentialUpload.api_key || !credentialUpload.cloud_name || !credentialUpload.api_secret) {
    return {
      status: 500,
      message: "API key is not present"
    }
  }

  const { asset_id } = await request.json();

  
  
  if(!asset_id) return Response.json({ data: "no data" })
  const assetData = new FormData();
  
  console.log('ss',asset_id)

  assetData.append("asset_id", asset_id)

  try {
    const response = await axios.post(`${URL}/asset/destroy`, {asset_id: asset_id, invalidate: true}, {
      auth: {
        username: credentialUpload.api_key,
        password: credentialUpload.api_secret
      }
    })

    if(response.status == 200) {
      return Response.json({
        status: response.status,
        message: response.statusText,
      })
    } else{
      throw new Error(response.statusText);
    }
    // return {
    //   status: 200,
    //   message: "hello world"
    // }

  } catch (error) {
    if(error instanceof Error){
      console.log(error)
    }
    throw error
  }

}