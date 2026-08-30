import { settingsSchema, updateSettingSchema } from "@/lib/validations";
import { saveProject, updateProjectById } from "@/services/projects.service";
import { ProjectStoreType } from "@/types/types";
import { currentUser, auth } from '@clerk/nextjs/server'
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";

import { redirect } from "next/navigation";

import z from "zod";

export async function POST(request: Request) {
  try {
    // 1. SECURITY: Verify authentication
    const { userId, isAuthenticated } = await auth();
    
    if (!isAuthenticated || !userId) {
      logger.security('Unauthorized project creation attempt', {
        userId: 'unknown',
        action: 'PROJECT_CREATE',
      });
      
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. SECURITY: Check rate limiting
    const rateLimitKey = `project_create:${userId}`;
    const { success: rateLimitSuccess } = await checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.PROJECT_CREATE.limit,
      RATE_LIMITS.PROJECT_CREATE.windowSeconds
    );

    if (!rateLimitSuccess) {
      logger.security('Rate limit exceeded for project creation', {
        userId,
        action: 'PROJECT_CREATE',
      });
      
      return Response.json(
        { error: "Too many project creations. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Get current user and verify ownership
    const user = await currentUser();
    
    if (!user || user.id !== userId) {
      logger.security('User identity mismatch during project creation', {
        userId,
        action: 'PROJECT_CREATE',
      });
      
      return Response.json(
        { error: "User identity verification failed" },
        { status: 401 }
      );
    }

    if (!user.firstName || !user.lastName || !user.fullName || !user.primaryEmailAddressId || !user.imageUrl) {
      logger.error('Incomplete user profile during project creation', {
        userId,
        action: 'PROJECT_CREATE',
      });
      
      return Response.json(
        { error: "User profile incomplete. Please complete your profile first." },
        { status: 400 }
      );
    }

    // 4. SECURITY: Parse and validate request data
    let data = await request.json();
    const secondValidated = settingsSchema.safeParse(data);

    if(!secondValidated.success){
        const errors = z.flattenError(secondValidated.error).fieldErrors;

        // Don't expose validation details
        logger.info('Project creation validation failed', {
          userId,
          action: 'PROJECT_CREATE',
        });

        return Response.json({
          status: 400,
          message: "Invalid project data",
          errors_message: Object.keys(errors) // Only expose field names
        }, {
          status: 400
        });
    }

    // 5. Create project with validated data
    let initialProjectsSetup: ProjectStoreType = {
      title: secondValidated.data.title.trim(),
      summary: secondValidated.data.summary.trim(),
      type: { id: secondValidated.data.type.id },
      status: { id: secondValidated.data.status.id },
      tags: secondValidated.data.tags.map((tag) => ({tag_id: tag.id})),
      tools: secondValidated.data.tools.map((tool) => ({tool_id: tool.id})),
      visibility: secondValidated.data.visibility,
      disable_comments: secondValidated.data.disable_comments,
      client_name: secondValidated.data.client_name.trim(),
    };

    let result = await saveProject(initialProjectsSetup);
    
    if(result.status == 200){
      logger.info('Project created successfully', {
        userId,
        action: 'PROJECT_CREATE',
        resource: `project:${result.data?.uid}`,
      });

      return redirect(`/explore/${initialProjectsSetup.title.toLowerCase().split(" ").join("-")}—${result.data?.uid}`);
    } else{
      logger.error('Project creation failed', {
        userId,
        action: 'PROJECT_CREATE',
      });

      return Response.json({
        status: 500,
        message: "Failed to create project. Please try again."
      }, {
        status: 500
      });
    }
  } catch (error) {
    logger.error('Project creation endpoint error', undefined, error);
    
    return Response.json({
      status: 500,
      message: "An error occurred while creating your project"
    }, {
      status: 500
    });
  }
}


export async function PATCH(request: Request){
  try {
    // 1. SECURITY: Verify authentication
    const { userId, isAuthenticated } = await auth();
    
    if (!isAuthenticated || !userId) {
      logger.security('Unauthorized project update attempt', {
        userId: 'unknown',
        action: 'PROJECT_UPDATE',
      });
      
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. SECURITY: Parse and validate request data
    let data = await request.json();
    const secondValidated = updateSettingSchema.safeParse(data);

    if(!secondValidated.success){
        const errors = z.flattenError(secondValidated.error).fieldErrors;

        logger.info('Project update validation failed', {
          userId,
          action: 'PROJECT_UPDATE',
        });

        return Response.json({
          status: 400,
          message: "Invalid project data",
          errors_message: Object.keys(errors)
        }, {
          status: 400
        });
    }

    // 3. Update project (service layer handles authorization check)
    const result = await updateProjectById(userId, {
      id: secondValidated.data.id,
      title: secondValidated.data.title,
      summary: secondValidated.data.summary,
      type: secondValidated.data.type ? { id: secondValidated.data.type.id } : undefined,
      status: secondValidated.data.status ? { id: secondValidated.data.status.id } : undefined,
      tags: secondValidated.data.tags ? secondValidated.data.tags.map((tag) => ({tag_id: tag.id})) : undefined,
      tools: secondValidated.data.tools ? secondValidated.data.tools.map((tool) => ({tool_id: tool.id})) : undefined,
      visibility: secondValidated.data.visibility,
      disable_comments: secondValidated.data.disable_comments,
      client_name: secondValidated.data.client_name,
    });

    if(result.status == 200){ 
      logger.info('Project updated successfully', {
        userId,
        action: 'PROJECT_UPDATE',
        resource: `project:${secondValidated.data.id}`,
      });

      return Response.json(result.data, {
        status: result.status,
        statusText: result.message
      });
    } else{
      logger.error('Project update failed', {
        userId,
        action: 'PROJECT_UPDATE',
      });

      return Response.json({
        status: 500,
        message: "Failed to update project. Please try again."
      }, {
        status: 500
      });
    }
  } catch (error) {
    logger.error('Project update endpoint error', undefined, error);
    
    return Response.json({
      status: 500,
      message: "An error occurred while updating your project"
    }, {
      status: 500
    });
  }
}