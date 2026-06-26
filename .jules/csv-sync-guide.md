# CSV Auto-Sync Guide

## Overview

The `Database Schema - Main Part.csv` file acts as a backup/export for all the Markdown articles in `src/content/archive/`. To ensure it stays in sync, we have set up an automated synchronization process.

## How the Automation Works

1. When a change to any `.md` or `.mdx` file in `src/content/archive/` is pushed to the `main` branch, the GitHub Action workflow `.github/workflows/sync-csv.yml` is triggered.
2. The workflow checks out the code, sets up Node.js and pnpm, and installs project dependencies.
3. It runs the sync script: `node scripts/sync-csv-from-markdown.js`.
4. The script:
   - Reads all markdown files in the archive directory.
   - Extracts the YAML frontmatter.
   - Validates it against the `archiveSchema` defined using `zod`.
   - Converts the validated data to a row matching the CSV structure.
   - Updates the `Database Schema - Main Part.csv` file if there are any changes compared to the current file content.
5. If changes to the CSV were made, the workflow automatically commits and pushes the updated file back to the repository with the message `chore: sync CSV with new article`.

## How to Manually Run the Sync Script

If you want to manually update the CSV locally (for testing or debugging), simply run:

```bash
pnpm install
node scripts/sync-csv-from-markdown.js
```

This will run the same script the GitHub Action uses and update the `Database Schema - Main Part.csv` file in your local repository. You can then review the git diff to see the applied changes.

## Troubleshooting

- **Script fails due to missing dependencies:** Make sure you have run `pnpm install` locally so that `yaml`, `csv-parse`, `csv-stringify`, and `zod` are installed.
- **Data missing or incorrectly serialized:** The script uses `JSON.stringify` to serialize array and object fields like `external_links` and `timelineVariants`. If changes in serialization are needed, update the column mapping step in `scripts/sync-csv-from-markdown.js`.
- **Validation fails on a file:** The script currently logs a warning and skips invalid files to allow the remainder to compile. If an article doesn't appear in the CSV, run the script locally to check the console for validation error logs on specific files, and fix the corresponding markdown frontmatter to conform to `src/content.config.ts`.
