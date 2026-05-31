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
    external_links: z
      .array(
        z.object({
          name: z.string(),
          url: z.string().url(),
        })
      )
      .optional(),

    timelineVariants: z
      .array(
        z.object({
          source_work: z.string(),
          excerpt: z.string(),
          url: z.string(),
          source_medium: z.string().optional(),
          source_creator: z.string().optional(),
          release_year: z.number().int().optional(),
          context_note: z.string().optional(),
          external_links: z
            .array(
              z.object({
                name: z.string(),
                url: z.string().url(),
              })
            )
            .optional(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  archive: archiveCollection,
};
