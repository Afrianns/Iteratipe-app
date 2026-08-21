"use server"

import { Prisma } from "@/generated/prisma/client";
import { returnDataType } from "@/types/types"

export const serverSideErrorHandle = async (error: unknown): Promise<returnDataType<any>> => {
  console.log("an error: ", error)
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`Unique constraint failed on field: ${error}`);
    return { status: 500, message: `CODE: ${error.code}, Something went wrong.` };
  }

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