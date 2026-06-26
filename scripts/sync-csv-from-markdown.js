import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import { stringify } from 'csv-stringify/sync';
import { z } from 'zod';

// We inline the schema here to avoid importing from 'astro:content' in our script
// as Astro modules are virtual and can't be imported by a plain Node script.
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

const archiveSchema = z.object({
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
  has_spoilers: z.boolean().optional().default(false),
  adaptation_type: z.enum(['Original', 'Remake', 'Reboot', 'Remaster', 'Adaptation']).optional(),
  adaptation_fidelity: z.enum(['Exact Match', 'Minor Alterations', 'Major Deviations']).optional(),
  based_on: z.string().optional(),
  adaptation_differences: z.string().optional(),
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
});


const archiveDir = path.join(process.cwd(), 'src/content/archive');
const csvFile = path.join(process.cwd(), 'Database Schema - Main Part.csv');

// The required fields from the prompt
const CSV_COLUMNS = [
  'title',
  'dateline_location',
  'in_universe_date',
  'timeline_flair',
  'source_work',
  'source_medium',
  'source_creator',
  'release_year',
  'context_note',
  'image_url',
  'multiverse_id',
  'has_spoilers',
  'adaptation_type',
  'adaptation_fidelity',
  'based_on',
  'adaptation_differences',
  'external_links',
  'timelineVariants'
];

async function sync() {
  console.log('Syncing CSV with Markdown articles...');

  // 1. Read all files
  let files;
  try {
    files = fs.readdirSync(archiveDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  } catch (err) {
    console.error('Error reading archive directory:', err);
    process.exit(1);
  }

  const articles = [];

  for (const file of files) {
    const filePath = path.join(archiveDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 2. Extract YAML Frontmatter
    const match = content.match(/^---\n([\s\S]+?)\n---/);
    if (!match) {
      console.warn(`No frontmatter found in ${file}. Skipping.`);
      continue;
    }

    try {
      const frontmatter = parseYaml(match[1]);

      // 3. Validate against Zod schema
      const parsed = archiveSchema.parse(frontmatter);
      articles.push(parsed);
    } catch (err) {
      console.error(`Validation failed for ${file}:`, err);
      // We'll skip invalid files rather than halting everything
      continue;
    }
  }

  // 4. Map fields to CSV format
  const dataRows = articles.map(article => {
    return CSV_COLUMNS.map(col => {
      const val = article[col];
      if (val === undefined || val === null) {
        return '';
      }
      if (Array.isArray(val) || typeof val === 'object') {
        return JSON.stringify(val);
      }
      return String(val);
    });
  });

  // Include the original header text
  const docLines = [
    ['Every article in src/content/archive/ must be a flat Markdown file. The framework must enforce strict validation against the following relational schema before compiling:', '', '', ''],
    ['', '', '', ''],
    ['Field Name', 'Data Type', 'Required', 'Allowed Values / Logic'],
    ['title', 'String', 'Yes', 'Journalistic style headline'],
    ['dateline_location', 'String', 'Yes', 'In-universe city, province, or space quadrant'],
    ['in_universe_date', 'String', 'Yes', 'Explicit date inside quotation marks'],
    ['timeline_flair', 'Enum', 'Yes', 'On Earth, Not On Earth, Alternate Timeline, Time Travel, Satire, Canon Reference'],
    ['source_work', 'String', 'Yes', 'Title of the original fictional work'],
    ['source_medium', 'String', 'Yes', 'Book, Film, TV Show, Video Game, Graphic Novel'],
    ['source_creator', 'String', 'Yes', 'Author, Director, or Studio'],
    ['release_year', 'Integer', 'Yes', 'Real-world publication/broadcast year'],
    ['context_note', 'String', 'Yes', 'Explaining the narrative impact of the event'],
    ['image_url', 'String', 'No', 'Path to local image or conceptual render'],
    ['multiverse_id', 'String', 'No', 'Shared slug identifier to link overlapping historical dates'],
    ['has_spoilers', 'Boolean', 'No', 'Default false'],
    ['adaptation_type', 'Enum', 'No', 'Original, Remake, Reboot, Remaster, Adaptation'],
    ['adaptation_fidelity', 'Enum', 'No', 'Exact Match, Minor Alterations, Major Deviations'],
    ['based_on', 'String', 'No', 'Original work title'],
    ['adaptation_differences', 'String', 'No', 'Explanation of differences'],
    ['external_links', 'Array', 'No', 'List of JSON objects {name, url}'],
    ['timelineVariants', 'Array', 'No', 'List of JSON objects representing variants'],
    ['', '', '', ''], // empty line before data
    CSV_COLUMNS // data headers
  ];

  const fullData = docLines.concat(dataRows);

  const csvString = stringify(fullData);

  let existingCsv = '';
  try {
    existingCsv = fs.readFileSync(csvFile, 'utf-8');
  } catch {
    // file doesn't exist, we will create it
  }

  if (existingCsv !== csvString) {
    fs.writeFileSync(csvFile, csvString);
    console.log(`Updated CSV file: ${csvFile}`);
  } else {
    console.log('No changes detected in CSV. Skipping write.');
  }
}

sync();
