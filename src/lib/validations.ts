import * as z from "zod"; 
 
export const NodeSchema = z.object({ 
  title: z.string("not a text").max(20, "title is too long."),
  start_at: z.coerce.date("should be date").max(20, "Start date is too long."),
  end_at: z.coerce.date("should be date").max(20, "End date is too long."),
  type: z.string("not a text").max(10, "type is too long."),
  content: z.string("not a text").max(10, "content is too long."),
});