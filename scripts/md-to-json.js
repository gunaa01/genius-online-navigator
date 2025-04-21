// Script to convert Markdown files in content/ to JSON for frontend consumption
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

function mdToJsonDir(dir, outDir, transform) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const index = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, '');
    const html = marked.parse(content);
    const json = transform(data, html, slug);
    fs.writeFileSync(path.join(outDir, slug + '.json'), JSON.stringify(json, null, 2));
    index.push({ ...json, body: undefined });
  }
  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2));
}

// Guides
mdToJsonDir(
  path.join(__dirname, '../content/guides'),
  path.join(__dirname, '../frontend/public/content/guides'),
  (data, html, slug) => ({ title: data.title, steps: data.steps || [html], slug })
);
// Community
mdToJsonDir(
  path.join(__dirname, '../content/community'),
  path.join(__dirname, '../frontend/public/content/community'),
  (data, html, slug) => ({ title: data.title, author: data.author, body: html, event_date: data.event_date, image: data.image, slug })
);
// Pages
mdToJsonDir(
  path.join(__dirname, '../content/pages'),
  path.join(__dirname, '../frontend/public/content/pages'),
  (data, html, slug) => ({ title: data.title, body: html, image: data.image, slug })
);
