import fs from 'fs/promises';
import { stringify } from 'csv-stringify/sync';
import yaml from 'yaml';
import { archiveSchema, safeUrlSchema } from '../content.config';
import { z } from 'zod';

export type ArchiveSubmission = z.infer<typeof archiveSchema>;
export { archiveSchema, safeUrlSchema };

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function jsonToFrontmatter(data: Record<string, unknown>): string {
  return `---\n${yaml.stringify(data)}---\n`;
}

export async function updateCsv(data: ArchiveSubmission, csvPath: string) {
  // Read first few lines of CSV to understand structure. Or hardcode the columns.
  // We'll explicitly map to the Database Schema columns in their exact order.
  const row = [
    data.title,
    data.dateline_location,
    data.in_universe_date,
    data.timeline_flair,
    data.source_work,
    data.source_medium,
    data.source_creator,
    data.release_year,
    data.context_note,
    data.image_url || '',
    data.multiverse_id || '',
    data.has_spoilers ? 'true' : 'false',
    data.adaptation_type || '',
    data.adaptation_fidelity || '',
    data.based_on || '',
    data.adaptation_differences || '',
    data.external_links ? JSON.stringify(data.external_links) : '',
    data.timelineVariants ? JSON.stringify(data.timelineVariants) : '',
  ];

  const csvRow = stringify([row]);
  await fs.appendFile(csvPath, csvRow);
}
