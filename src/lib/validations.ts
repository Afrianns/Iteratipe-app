import * as z from "zod"; 

export const NodeSchema = z.object({ 
  title: z.string("not a text").max(20, "title is too long."),
  start_at: z.coerce.date("should be date").max(20, "Start date is too long."),
  end_at: z.coerce.date("should be date").max(20, "End date is too long."),
  type: z.string("not a text").max(10, "type is too long."),
  content: z.string("not a text").max(10, "content is too long."),
});

const LabelSchema = z.object({
  id: z.number(),
  name: z.string("no a string").min(2, "status is too sort").max(30, "status is too long")
})

// CREATE VALIDATION SECTION
export const generalSettingSchema = z.object({ 
  title: z.string("not a text").min(5, "name cannot be less then 5 characters").max(60, "title is too long."),
  summary: z.string("not a text").min(5, "summary cannot be less then 10 characters").max(1000, "summary is too long."),
  type: LabelSchema,
  status: LabelSchema,
  tags: z.array(LabelSchema).min(2, "please add atleast 2 tags").max(10, "Cannot be more than 10 tags"),
  tools: z.array(LabelSchema).min(2, "please add atleast 2 tools").max(10, "Cannot be more than 10 tools")
});



export const VisibilitySchema = z.object({
  visibility: z.enum(["PUBLIC", "SEMI", "PRIVATE"], {
     error: () => ({ message: "Please select a valid visibility." }),
  }),
  disable_comments: z.boolean("input is not valid."),
  client_name: z.string("client has to be text").min(5, "client name need atleast 5 characters").max(50, "Client name is too long."),
})


export const settingsSchema = z.object({
  ...generalSettingSchema.shape,
  ...VisibilitySchema.shape
})

// UPDATE VALIDATION SECTION
export const updateVisibilitySchema = z.object({
  id: z.number("not valid id"),
  ...VisibilitySchema.partial().shape
})

export const updateGeneralSchema = z.object({
  id: z.number("not valid id"),
  ...generalSettingSchema.partial().shape
})


export const updateSettingSchema = z.object({
  id: z.number("not valid id"),
  ...generalSettingSchema.partial().shape,
  ...VisibilitySchema.partial().shape
})