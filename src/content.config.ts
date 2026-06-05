import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// 🛡️ Sentinel: Prevent XSS via javascript: URIs
const safeUrlSchema = z.string().refine(
  (val) => {
    if (val.startsWith('/') || val.startsWith('#')) return true;
    try {
      const url = new URL(val);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  },
  { message: 'Must be a safe URL (http/https) or relative path' }
);

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
    image_url: safeUrlSchema.optional(),
    multiverse_id: z.string().optional(),
    external_links: z
      .array(
        z.object({
          name: z.string(),
          url: safeUrlSchema,
        })
      )
      .optional(),

    timelineVariants: z
      .array(
        z.object({
          source_work: z.string(),
          excerpt: z.string(),
          url: safeUrlSchema,
          source_medium: z.string().optional(),
          source_creator: z.string().optional(),
          release_year: z.number().int().optional(),
          context_note: z.string().optional(),
          external_links: z
            .array(
              z.object({
                name: z.string(),
                url: safeUrlSchema,
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
