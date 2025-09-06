import { z } from "zod";
export const WebHistorySchema = z.object({
  email: z.email(),
  profile: z.enum(["work", "personal_tom", "personal_tamil"]),
  search_Type: z.enum(["google_search", "direct_visit"]),
  query: z.string().optional().nullable(),
  url: z.url().optional().nullable(),
  domain: z.string().optional().nullable(),
});

export const CreateWebHistorySchema = z.object({
    body:WebHistorySchema,
})