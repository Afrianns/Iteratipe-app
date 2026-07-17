import { VISIBLE } from "@/types/types";
import * as z from "zod"; 

export const NodeSchema = z.object({ 
  title: z.string("not a text").max(20, "title is too long."),
  start_at: z.coerce.date("should be date").max(20, "Start date is too long."),
  end_at: z.coerce.date("should be date").max(20, "End date is too long."),
  type: z.string("not a text").max(10, "type is too long."),
  content: z.string("not a text").max(10, "content is too long."),
});

export const SetupSchema = z.object({ 
  name: z.string("not a text").min(5, "name cannot be less then 5 characters").max(60, "title is too long."),
  summary: z.string("not a text").min(5, "summary cannot be less then 10 characters").max(150, "summary is too long."),
  status: z.string("not a string").transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({
        code: 'custom',
        message: "Invalid JSON format. Check your brackets and double quotes.",
      });
      return z.NEVER;
    }
  }),
  tags: z.array(z.string("not a string")).min(2, "tags cannot be less then 2 characters").max(50, "tags too long"),
  tools: z.array(z.string("not a string")).min(2, "tools cannot be less then 2 characters").max(50, "tools too long")
});


export const VisibilitySchema = z.object({
  visibility: z.union([
      z.literal("PUBLIC"),
      z.literal("SEMI"),
      z.literal("PRIVATE"),
    ], {
     error: () => ({ message: "Please select a valid visibility." }),
  }),
  disable_comments: z.boolean("input is not valid."),
  client_name: z.string("client has to be text").max(10, "Client name is too long."),
})