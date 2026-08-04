import * as z from "zod"; 
import { convertDateToISOString } from "./convertDate";

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


// timeline data validations

// {
//     "id": "019fc01e-d3d7-a2c8-aa9a-c642f983a5d8",
//     "position": {
//         "x": -73.18027331816967,
//         "y": 113.17590577354096
//     },
//     "data": {
//         "handleType": "start",
//         "title": "Booking the king",
//         "type": "brainstorming",
//         "start_at": "03 August 2026",
//         "end_at": "07 August 2026",
//         "content": "Music video by The Weeknd performing Out Of Time (Audio).© 2022 The Weeknd XO, Inc., marketed by Republic Records, a division of UMG Recordings, Inc."
//     },
//     "origin": [
//         0.5,
//         0.5
//     ],
//     "type": "cardNode",
//     "measured": {
//         "width": 320,
//         "height": 226
//     }
// }

export const NodeDataSchema = z.object({ 
  title: z.string("not a string").max(25, "title is too long"),
  type: z.string("not a string").max(16, "Type is too long"),
  start_at: z.string("not a string").transform((val) => {
    const date = convertDateToISOString(val)
    return date
  }),
  end_at: z.string("not a string").transform((val) => {
    const date = convertDateToISOString(val)
    return date
  }),
  content: z.string("not a string").max(200, "content is too long")
}).partial();

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
    ...NodeDataSchema.partial().shape
  })
});




export const NodeListSchema = z.array(NodeSchema)