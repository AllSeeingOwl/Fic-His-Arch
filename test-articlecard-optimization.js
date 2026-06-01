import fs from 'fs';
const content = fs.readFileSync('src/pages/index.astro', 'utf-8');
if (content.includes('client:load')) {
  console.log('Failed: client:load is still in index.astro');
  process.exit(1);
} else {
  console.log('Success: client:load removed from index.astro');
}

const content2 = fs.readFileSync('src/pages/archive/[slug].astro', 'utf-8');
if (content2.includes('client:load')) {
  console.log('Warning: client:load is still in archive/[slug].astro (InteractiveSection uses it)');
}
