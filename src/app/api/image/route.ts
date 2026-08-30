import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";

const credentialUpload = {
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
}
const URL = `https://api.cloudinary.com/v1_1/${credentialUpload.cloud_name}`;

// Validate credentials on startup
if (!credentialUpload.api_key || !credentialUpload.cloud_name || !credentialUpload.api_secret) {
  logger.error('Missing Cloudinary credentials in environment variables', undefined);
}

export async function POST(request: Request) {
  try {
    // 1. SECURITY: Verify authentication
    const { userId, isAuthenticated } = await auth();
    
    if (!isAuthenticated || !userId) {
      logger.security('Unauthorized image upload attempt', {
        userId: 'unknown',
        action: 'IMAGE_UPLOAD',
      });
      
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. SECURITY: Check rate limiting
    const ip = getClientIp(request);
    const rateLimitKey = `image_upload:${userId}`;
    const { success: rateLimitSuccess } = await checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.IMAGE_UPLOAD.limit,
      RATE_LIMITS.IMAGE_UPLOAD.windowSeconds
    );

    if (!rateLimitSuccess) {
      logger.security('Rate limit exceeded for image upload', {
        userId,
        action: 'IMAGE_UPLOAD',
      });
      
      return Response.json(
        { error: "Too many upload requests. Please try again later." },
        { status: 429 }
      );
    }

    // 3. SECURITY: Check credentials
    if(!credentialUpload.api_key || !credentialUpload.cloud_name || !credentialUpload.api_secret) {
      logger.error('Cloudinary credentials missing', { userId, action: 'IMAGE_UPLOAD' });
      return Response.json(
        { error: "Upload service temporarily unavailable" },
        { status: 503 }
      );
    }

    // 4. SECURITY: Validate file exists and check size
    const formData = await request.formData();
    const file = formData.get("file");

    if(!file || !(file instanceof File)) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File size exceeds maximum limit of 10MB" },
        { status: 413 }
      );
    }

    // Check file type (images only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    try {
      const response = await axios.post(`${URL}/image/upload?upload_preset=main-preset`, formData, {
        auth: {
          username: credentialUpload.api_key,
          password: credentialUpload.api_secret
        },
        timeout: 30000 // 30 second timeout
      });

      if(response.status == 200) {
        const returnResult = {
          status: response.status,
          message: response.statusText,
          image_url: response.data.secure_url,
          asset_id: response.data.asset_id
        };

        logger.info('Image uploaded successfully', {
          userId,
          action: 'IMAGE_UPLOAD',
          resource: `image:${response.data.asset_id}`,
        });

        return Response.json(returnResult);
      } else{
        throw new Error(response.statusText);
      }
    } catch (error) {
      logger.error('Cloudinary upload failed', { userId, action: 'IMAGE_UPLOAD' }, error);
      
      return Response.json(
        { error: "Failed to upload image. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Image upload endpoint error', undefined, error);
    
    return Response.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // 1. SECURITY: Verify authentication
    const { userId, isAuthenticated } = await auth();
    
    if (!isAuthenticated || !userId) {
      logger.security('Unauthorized image deletion attempt', {
        userId: 'unknown',
        action: 'IMAGE_DELETE',
      });
      
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. SECURITY: Check rate limiting
    const ip = getClientIp(request);
    const rateLimitKey = `image_delete:${userId}`;
    const { success: rateLimitSuccess } = await checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.IMAGE_DELETE.limit,
      RATE_LIMITS.IMAGE_DELETE.windowSeconds
    );

    if (!rateLimitSuccess) {
      logger.security('Rate limit exceeded for image deletion', {
        userId,
        action: 'IMAGE_DELETE',
      });
      
      return Response.json(
        { error: "Too many deletion requests. Please try again later." },
        { status: 429 }
      );
    }

    // 3. SECURITY: Check credentials
    if(!credentialUpload.api_key || !credentialUpload.cloud_name || !credentialUpload.api_secret) {
      logger.error('Cloudinary credentials missing', { userId, action: 'IMAGE_DELETE' });
      return Response.json(
        { error: "Delete service temporarily unavailable" },
        { status: 503 }
      );
    }

    const { asset_id } = await request.json();

    if(!asset_id || typeof asset_id !== 'string') {
      return Response.json(
        { error: "Invalid asset ID" },
        { status: 400 }
      );
    }

    try {
      const response = await axios.post(`${URL}/asset/destroy`, {asset_id: asset_id, invalidate: true}, {
        auth: {
          username: credentialUpload.api_key,
          password: credentialUpload.api_secret
        },
        timeout: 30000 // 30 second timeout
      });

      if(response.status == 200) {
        logger.info('Image deleted successfully', {
          userId,
          action: 'IMAGE_DELETE',
          resource: `image:${asset_id}`,
        });

        return Response.json({
          status: response.status,
          message: response.statusText,
        });
      } else{
        throw new Error(response.statusText);
      }
    } catch (error) {
      logger.error('Cloudinary deletion failed', { userId, action: 'IMAGE_DELETE' }, error);
      
      return Response.json(
        { error: "Failed to delete image. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Image deletion endpoint error', undefined, error);
    
    return Response.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}