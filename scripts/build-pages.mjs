import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, extname } from 'node:path';
import { build, root } from './build.mjs';

await build();
const directory = resolve(root, 'dist');
const output = resolve(root, 'dist-pages');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };
const files = {};
async function collect(path = '') {
  for (const entry of await readdir(resolve(directory, path), { withFileTypes: true })) {
    const name = path ? `${path}/${entry.name}` : entry.name;
    if (entry.isDirectory()) await collect(name);
    else if (!entry.name.startsWith('_')) {
      const data = await readFile(resolve(directory, name));
      files[`/${name}`] = { value: data.toString('base64'), contentType: types[extname(name)] || 'application/octet-stream', etag: createHash('sha256').update(data).update(extname(name)).digest('hex').slice(0, 32) };
    }
  }
}
await collect();
const headers = {};
const headerSource = await readFile(resolve(directory, '_headers'), 'utf8');
for (const line of headerSource.split('\n')) {
  if (line.startsWith('/assets/')) break;
  const match = line.match(/^\s+([^:]+):\s*(.+)$/);
  if (match) headers[match[1].trim()] = match[2].trim();
}
const handler = await readFile(resolve(root, 'scripts/pages-handler.mjs'), 'utf8');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(resolve(output, '_worker.js'), `${handler}\nexport default createHandler(${JSON.stringify(files)}, ${JSON.stringify(headers)});\n`);
await writeFile(resolve(output, '_routes.json'), JSON.stringify({ version: 1, include: ['/*'], exclude: [] }));
console.log(`Built Pages deployment → dist-pages/ (${Object.keys(files).length} files)`);
