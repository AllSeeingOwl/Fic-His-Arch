const fs = require('fs');

let utils = fs.readFileSync('src/utils/article-submission.ts', 'utf8');

utils = utils.replace("import { z } from 'zod';\nimport fs from 'fs/promises';\nimport { stringify } from 'csv-stringify/sync';\nimport yaml from 'yaml';\n\n// 🛡️ Sentinel: Prevent XSS via javascript: URIs\nexport const safeUrlSchema = z.string().refine(\n  (val) => {\n    if (val.startsWith('/') || val.startsWith('#')) return true;\n    try {\n      const url = new URL(val);\n      return url.protocol === 'http:' || url.protocol === 'https:';\n    } catch {\n      return false;\n    }\n  },\n  { message: 'Must be a safe URL (http/https) or relative path' }\n);\n\nexport const archiveSchema = z.object({\n  title: z.string(),\n  dateline_location: z.string(),\n  in_universe_date: z.string(),\n  timeline_flair: z.enum([\n    'On Earth',\n    'Not On Earth',\n    'Alternate Timeline',\n    'Time Travel',\n    'Satire',\n    'Canon Reference',\n  ]),\n  source_work: z.string(),\n  source_medium: z.string(),\n  source_creator: z.string(),\n  release_year: z.number().int(),\n  context_note: z.string(),\n  image_url: safeUrlSchema.optional(),\n  multiverse_id: z.string().optional(),\n  has_spoilers: z.boolean().optional().default(false),\n  adaptation_type: z.enum(['Original', 'Remake', 'Reboot', 'Remaster', 'Adaptation']).optional(),\n  adaptation_fidelity: z\n    .enum(['Exact Match', 'Minor Alterations', 'Major Deviations'])\n    .optional(),\n  based_on: z.string().optional(),\n  adaptation_differences: z.string().optional(),\n  external_links: z\n    .array(\n      z.object({\n        name: z.string(),\n        url: safeUrlSchema,\n      })\n    )\n    .optional(),\n  timelineVariants: z\n    .array(\n      z.object({\n        source_work: z.string(),\n        excerpt: z.string(),\n        url: safeUrlSchema,\n        source_medium: z.string().optional(),\n        source_creator: z.string().optional(),\n        release_year: z.number().int().optional(),\n        context_note: z.string().optional(),\n        external_links: z\n          .array(\n            z.object({\n              name: z.string(),\n              url: safeUrlSchema,\n            })\n          )\n          .optional(),\n      })\n    )\n    .optional(),\n});\n", "import { z } from 'zod';\nimport fs from 'fs/promises';\nimport { stringify } from 'csv-stringify/sync';\nimport yaml from 'yaml';\nimport { archiveSchema, safeUrlSchema } from '../content.config';\n\nexport { archiveSchema, safeUrlSchema };\n");

// Replace updateCsv
const oldUpdateCsv = `export async function updateCsv(data: ArchiveSubmission, csvPath: string) {
  // Convert arrays to stringified JSON for CSV
  const record = {
    title: data.title,
    dateline_location: data.dateline_location,
    in_universe_date: data.in_universe_date,
    timeline_flair: data.timeline_flair,
    source_work: data.source_work,
    source_medium: data.source_medium,
    source_creator: data.source_creator,
    release_year: data.release_year,
    context_note: data.context_note,
    image_url: data.image_url || '',
    multiverse_id: data.multiverse_id || '',
    has_spoilers: data.has_spoilers ? 'true' : 'false',
    adaptation_type: data.adaptation_type || '',
    adaptation_fidelity: data.adaptation_fidelity || '',
    based_on: data.based_on || '',
    adaptation_differences: data.adaptation_differences || '',
    external_links: data.external_links ? JSON.stringify(data.external_links) : '',
    timelineVariants: data.timelineVariants ? JSON.stringify(data.timelineVariants) : '',
  };

  const csvRow = stringify([record], {
    header: false,
    columns: Object.keys(record),
  });

  await fs.appendFile(csvPath, csvRow);
}`;

const newUpdateCsv = `export async function updateCsv(data: ArchiveSubmission, csvPath: string) {
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
    data.timelineVariants ? JSON.stringify(data.timelineVariants) : ''
  ];

  const csvRow = stringify([row]);
  await fs.appendFile(csvPath, csvRow);
}`;

utils = utils.replace(oldUpdateCsv, newUpdateCsv);

fs.writeFileSync('src/utils/article-submission.ts', utils);

let testFile = fs.readFileSync('test/api-submit-endpoint.test.ts', 'utf8');
testFile = testFile.replace("jest.requireActual('../src/utils/article-submission')", "jest.requireActual('../src/utils/article-submission.js')");
fs.writeFileSync('test/api-submit-endpoint.test.ts', testFile);
