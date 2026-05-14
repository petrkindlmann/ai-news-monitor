import { z } from 'zod';

export const StoryLabelSchema = z.enum(['Signal','Tool','Research','Model','Policy','Drama','Ignore']);

export const StorySchema = z.object({
  title: z.string().min(5),
  source: z.string().min(2),
  url: z.string().url(),
  publishedAt: z.string(),
  label: StoryLabelSchema,
  blurb: z.string().min(10),
  whyItMatters: z.string().min(10),
  takeaway: z.string().min(5),
  heat: z.number().int().min(1).max(5),
});

export const IssueSchema = z.object({
  issueTitle: z.string().min(5),
  slug: z.string().regex(/^\d{4}-W\d{2}$/),
  publishedAt: z.string(),
  weekRange: z.object({ start: z.string(), end: z.string() }),
  editorLetter: z.string().min(50),
  sections: z.array(z.object({
    title: z.string(),
    description: z.string(),
    stories: z.array(StorySchema),
  })).min(1),
  ignoredThisWeek: z.array(z.object({
    theme: z.string(),
    reason: z.string(),
  })),
  oneThingToTry: z.string().min(10),
  watchNext: z.array(z.string()).min(3).max(5),
});
