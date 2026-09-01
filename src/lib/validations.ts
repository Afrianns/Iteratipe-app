import * as z from "zod"; 
import { convertDateToISOString } from "./convertDate";

// SECURITY: Stricter validation schema for labels
const LabelSchema = z.object({
  id: z.number().positive("Invalid label ID"),
  name: z.string("Label must be text")
    .min(2, "Label is too short")
    .max(30, "Label is too long")
    .trim()
})

// SECURITY: URL validation for Cloudinary images
const CloudinaryUrlSchema = z.string("Image URL must be text")
  .url("Invalid URL format")
  .refine(
    (url) => url.startsWith("https://res.cloudinary.com/"),
    "Only Cloudinary images are allowed"
  )
  .refine(
    (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    "Invalid image URL"
  );

// CREATE VALIDATION SECTION
export const generalSettingSchema = z.object({ 
  title: z.string("Title must be text")
    .min(5, "Title must be at least 5 characters")
    .max(60, "Title cannot exceed 60 characters")
    .trim()
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, "Title contains invalid characters"),
  summary: z.string("Summary must be text")
    .min(10, "Summary must be at least 10 characters")
    .max(1000, "Summary cannot exceed 1000 characters")
    .trim(),
  type: LabelSchema,
  status: LabelSchema,
  tags: z.array(LabelSchema)
    .min(2, "Please add at least 2 tags")
    .max(10, "Cannot have more than 10 tags"),
  tools: z.array(LabelSchema)
    .min(2, "Please add at least 2 tools")
    .max(10, "Cannot have more than 10 tools")
});

export const VisibilitySchema = z.object({
  visibility: z.enum(["PUBLIC", "SEMI", "PRIVATE"], {
     error: () => ({ message: "Please select a valid visibility." }),
  }),
  disable_comments: z.boolean("Comments setting must be a boolean"),
  client_name: z.string("Client name must be text")
    .min(5, "Client name must be at least 5 characters")
    .max(50, "Client name cannot exceed 50 characters")
    .trim()
    .regex(/^[a-zA-Z0-9\s\-_.&,]+$/, "Client name contains invalid characters"),
})

export const settingsSchema = z.object({
  ...generalSettingSchema.shape,
  ...VisibilitySchema.shape
})

// UPDATE VALIDATION SECTION
export const updateVisibilitySchema = z.object({
  id: z.number("ID must be a number").positive("ID must be positive"),
  ...VisibilitySchema.partial().shape
})

export const updateGeneralSchema = z.object({
  id: z.number("ID must be a number").positive("ID must be positive"),
  ...generalSettingSchema.partial().shape
})

export const updateSettingSchema = z.object({
  id: z.number("ID must be a number").positive("ID must be positive"),
  ...generalSettingSchema.partial().shape,
  ...VisibilitySchema.partial().shape
})

// SECURITY: Timeline data validations with strict formats
export const NodeDataSchema = z.object({ 
  title: z.string("Title must be text")
    .max(25, "Title is too long")
    .trim()
    .optional(),
  type: z.string("Type must be text")
    .max(16, "Type is too long")
    .trim()
    .optional(),
  start_at: z.string("Start date must be text")
    .transform((val) => {
      const date = convertDateToISOString(val)
      return date
    })
    .optional(),
  end_at: z.string("End date must be text")
    .transform((val) => {
      const date = convertDateToISOString(val)
      return date
    })
    .optional(),
  content: z.string("Content must be text")
    .max(200, "Content is too long")
    .trim()
    .optional(),
}).partial();

export const NodeDataSchemaBE = z.object({
  ...NodeDataSchema.partial().shape,
  // SECURITY: Strict Cloudinary URL validation
  image_url: CloudinaryUrlSchema
    .or(z.literal(""))
    .nullish(),
  // SECURITY: Validate asset ID format
  asset_id: z.string("Asset ID must be text")
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid asset ID format")
    .or(z.literal(""))
    .nullish()
}).partial()

export const NodeSchema = z.object({ 
  id: z.guid(),
  position: z.object({
    x: z.number("not a number"),
    y: z.number("not a number")
  }),
  data: z.object({
    handleType: z.enum(["start", "end", "main"], {
      error: () => ({ message: "Please select a valid handle." }),
    }),
    ...NodeDataSchema.partial().shape,
    image_url: z.string("image url is not valid").refine((val) => val.startsWith("https://res.cloudinary.com/cloud-store-images/image") || val.startsWith(`blob:${URL}`)).or(z.literal("")).nullish(),
  })
});

export const NodeSchemaBE = z.object({ 
  id: z.guid(),
  position: z.object({
    x: z.number("not a number"),
    y: z.number("not a number")
  }),
  data: z.object({
    handleType: z.enum(["start", "end", "main"], {
      error: () => ({ message: "handle is not a valid." }),
    }),
    ...NodeDataSchemaBE.partial().shape
  })
});


// onboarding form


export const onboardingUserIdentity = z.object({
  username: z.string("username has to be text").min(5, "username cannot be less then 5 characters length").max(20, "username cannot be longer then 20 characters length"),
  description: z.string("description has to be text").max(255, "description is too long").optional()
})

export const onboardingUserSocial = z.object({
  facebook: z.string("has to be text").min(10, "facebook link is too sort").max(20, "facebook link is too long").optional().or(z.literal("")),
  twitter: z.string("has to be text").min(10, "twitter link is too sort").max(20, "twitter link is too long").optional().or(z.literal("")),
  website: z.string("has to be text").min(10, "webstie link is too sort").max(20, "webstie link is too long").optional().or(z.literal("")),
})


export const onboardingUser = z.object({
  ...onboardingUserIdentity.shape,
  ...onboardingUserSocial.shape
})


export const NodeListSchema = z.array(NodeSchema)
export const NodeListSchemaBE = z.array(NodeSchemaBE)