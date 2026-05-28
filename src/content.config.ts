import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const archiveCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/archive' }),
  schema: z.object({
    title: z.string(),
    dateline_location: z.string(),
    in_universe_date: z.string(),
    timeline_flair: z.enum([
      'On Earth',
      'Not On Earth',
      'Alternate Timeline',
      'Time Travel',
      'Satire',
      'Canon Reference',
    ]),
    source_work: z.string(),
    source_medium: z.string(),
    source_creator: z.string(),
    release_year: z.number().int(),
    context_note: z.string(),
    image_url: z.string().optional(),
    multiverse_id: z.string().optional(),

    timelineVariants: z
      .array(
        z.object({
          source_work: z.string(),
          excerpt: z.string(),
          url: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  archive: archiveCollection,
};
