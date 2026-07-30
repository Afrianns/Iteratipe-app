import { Prisma } from "@/generated/prisma/client";

export const prismaErrorHandling = (error: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error('Unique constraint failed on fields:', error.meta?.target);
          // Handle 409 Conflict
        }
        if (error.code === 'P2025') {
          console.error('Record to update/delete not found.');
          // Handle 404 Not Found
        }
      }
      
      // 2. Handle validation errors (wrong types, missing fields)
      else if (error instanceof Prisma.PrismaClientValidationError) {
        console.error('Validation error:', error.message);
        // Handle 400 Bad Request
      }
      
      // 3. Handle unknown database errors or generic code errors
      else {
        console.error('An unexpected error occurred:', error);
        // Handle 500 Internal Server Error
      }
  }