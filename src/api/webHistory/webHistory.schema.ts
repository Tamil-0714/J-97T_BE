import { z } from "zod";
export const WebHistorySchema = z.object({
  email: z.email(),
  profile: z.enum(["work", "personal_tom", "personal_tamil"]),
  searchType: z.enum(["google_search", "direct_visit"]),
  query: z.string().optional().nullable(),
  url: z.url().optional().nullable(),
  domain: z.string().optional().nullable(),
});

export const WebHistoryFilterSchema = z.object({
  operator: z.enum(["AND", "OR"]).default("AND").optional(),
  
  conditions: z.array(z.object({
    field: z.enum(["email", "profile", "searchType", "query", "url", "domain"]),
    operator: z.enum(["equals", "contains", "starts_with", "ends_with", "in", "not_in"]),
    value: z.union([z.string(), z.array(z.string())])
  })).optional(),
  
  
  // Metadata
  limit: z.number().int().positive().max(1000).default(100).optional(),
  offset: z.number().int().min(0).default(0).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).default("desc").optional()
});

// export type WebHistoryFilters = z.infer<typeof WebHistoryFilterSchema>;
export type WebHistoryFilters = z.infer<typeof WebHistoryFilterSchema>

export const CreateWebHistorySchema = z.object({
    body:WebHistorySchema,
})

export const GetWebHistoryByFiltersSchema = z.object({
  body: WebHistoryFilterSchema.optional()
})