"use client"

import { nodeDataType } from "@/types/types";
import Image from "next/image";
import {useDropzone} from "react-dropzone";


export default function Upload({nodeData, setFile, updateNodeData}: {nodeData: nodeDataType, setFile: (params: File) => void, updateNodeData: (params: Record<string, string>) => void}) {
  // const [image, setImage] = useState<string>("")

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: {"image/*": [".jpg", ".jpeg"]},
    maxFiles: 1,
    onDrop: async acceptedFiles => {

      // save file obj to edit parent so it can transform into formdata then store it in cloudinary
      setFile(acceptedFiles[0])

      // set the image so it update to all related data( that use nodeData) even before saved to store. 
      updateNodeData({ "image_url": URL.createObjectURL(acceptedFiles[0])})
    }

  });
  return (
    <>
        <div className="card-style h-20 w-full bg-grayish/20! relative overflow-hidden rounded-md flex items-center justify-center" {...getRootProps()}>
            <input {...getInputProps()} />
            {nodeData.image_url ? <Image alt="preview image" src={nodeData.image_url} fill className="absolute object-cover" />
            :
              <h3 className="h-four-style">Upload your image here.</h3>
            }
        </div>
         <ul>
          {acceptedFiles.map(file => (
            <li key={file.path}>
                {file.path} - {(file.size/1000/1000).toFixed()} MB
              </li>
            ))}
          </ul>
    </>
  )
}


// cloudinary return result
// {
//     "asset_id": "d8ec49c9a682e18f2de3184ba4daade9",
//     "public_id": "u7txsz8zkewm1n8ud5bo",
//     "version": 1786429742,
//     "version_id": "9739a14a5a757d0088efe3b703752715",
//     "signature": "7bca3b8e12a3d4d0c9ed34dbd636a59484471155",
//     "width": 7952,
//     "height": 5304,
//     "format": "jpg",
//     "resource_type": "image",
//     "created_at": "2026-08-11T06:29:02Z",
//     "tags": [],
//     "bytes": 8974381,
//     "type": "upload",
//     "etag": "88c1df5c9e66fb2d47de3e0294163adf",
//     "placeholder": false,
//     "url": "http://res.cloudinary.com/wgl8igqx/image/upload/v1786429742/u7txsz8zkewm1n8ud5bo.jpg",
//     "secure_url": "https://res.cloudinary.com/wgl8igqx/image/upload/v1786429742/u7txsz8zkewm1n8ud5bo.jpg",
//     "asset_folder": "nodes_image",
//     "display_name": "aniket-deole-M6XC789HLe8-unsplash",
//     "original_filename": "aniket-deole-M6XC789HLe8-unsplash"
// }