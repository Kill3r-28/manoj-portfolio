import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    originalUrl: z.string().url().optional(),
    /** career = PM / AI ops notes; writing = personal posts / republished pieces */
    category: z.enum(["career", "writing"]).default("writing"),
  }),
});

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    repoURL: z.string().optional()
  }),
});

const home = defineCollection({
  type: "content",
  schema: z.object({
    greeting: z.string(),
    /** One line under your name — recruiters should grok role in ~5 seconds */
    tagline: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const collections = { blog, work, projects, home };
