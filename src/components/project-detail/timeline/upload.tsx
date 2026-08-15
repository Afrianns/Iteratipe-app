"use client"

import { nodeDataType } from "@/types/types";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import {useDropzone} from "react-dropzone";


export default function Upload({nodeData, updateNodeData}: {nodeData: nodeDataType, updateNodeData: (params: Record<string, string>) => void}) {

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: {"image/*": [".jpg", ".jpeg"]},
    maxFiles: 1,
    onDrop: async acceptedFiles => {

      // set the image so it update to all related data( that use nodeData) even before saved to store. 
      updateNodeData({ "image_url": URL.createObjectURL(acceptedFiles[0])})
    }

  });

  const removeImage = () => {
    updateNodeData({ "image_url": ""})
  }
  return (
    <>
    <div className="flex gap-x-3 justify-end">
      <button type="button" onClick={removeImage} className="button-style-secondary hover:bg-light-red/80! text-xs bg-light-red! text-whitish! rounded-md z-2 py-1! px-5!">remove image</button>
    </div>
    <div className="card-style h-25 w-full bg-grayish/20! relative overflow-hidden rounded-md flex items-center justify-center" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {nodeData.image_url ? 
          <div className="group">
            <div className="absolute cursor-pointer top-0 bottom-0 left-0 right-0 flex items-center justify-center z-1 group-hover:bg-main-text/50" title="click or drag image here">
              <SquarePen className="group-hover:block hidden text-secondary w-5 h-5" />
            </div>
            <Image alt="preview image" src={nodeData.image_url} fill className="absolute object-cover" />
          </div>
        :
          <h3 className="h-four-style">Upload your image here.</h3>
        }
    </div>
      <ul>
      {acceptedFiles.map(file => (
        <li className="span-style" key={file.path}>
            {file.name} - {(file.size/1000/1000).toFixed()} MB
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