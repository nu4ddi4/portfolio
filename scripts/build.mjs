import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
const escape = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export async function build() {
  const { profile } = await import(`${new URL('../public/content.js',import.meta.url).href}?v=${Date.now()}`);
  await rm(resolve(root,'dist'),{recursive:true,force:true});
  await mkdir(resolve(root,'dist'),{recursive:true});
  await cp(resolve(root,'public'),resolve(root,'dist'),{recursive:true});
  const source = await readFile(resolve(root,'public/index.html'),'utf8');
  const html = source.replace(/\{\{(\w+)\}\}/g, (_,key) => escape(profile[key] ?? ''));
  await writeFile(resolve(root,'dist/index.html'),html);
  console.log('Built portfolio → dist/');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
