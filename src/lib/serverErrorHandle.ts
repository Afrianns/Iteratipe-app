"use server"

import { Prisma } from "@/generated/prisma/client";
import { returnDataType } from "@/types/types"
import { logger } from "./logger";

const isDevelopment = process.env.NODE_ENV !== 'production';

export const serverSideErrorHandle = async (error: unknown): Promise<returnDataType<any>> => {
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Log full error internally
    logger.error(`Prisma database error: ${error.code}`, undefined, error);
    
    // Return generic message to client in production
    if (isDevelopment) {
      return { status: 500, message: `Database error (CODE: ${error.code}). Please try again.` };
    } else {
      return { status: 500, message: "Database operation failed. Please try again later." };
    }
  }

  if(error instanceof Error){
    // Log full error message internally
    logger.error(`Error occurred: ${error.message}`, undefined, error);
    
    // Return generic message to client in production
    if (isDevelopment) {
      return {
        status: 500,
        message: error.message
      };
    } else {
      return {
        status: 500,
        message: "An error occurred. Please try again later."
      };
    }
  } 
  
  // Log unknown error
  logger.error('Unknown error occurred', undefined, error);
  
  return {
    status: 500,
    message: "An unexpected error occurred. Please try again later."
  };
};