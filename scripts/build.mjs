import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
const escape = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export async function build() {
  const { profile, projects } = await import(`${new URL('../public/content.js',import.meta.url).href}?v=${Date.now()}`);
  await rm(resolve(root,'dist'),{recursive:true,force:true});
  await mkdir(resolve(root,'dist'),{recursive:true});
  await cp(resolve(root,'public'),resolve(root,'dist'),{recursive:true});
  const source = await readFile(resolve(root,'public/index.html'),'utf8');
  const projectHTML = projects.map((project, index) => {
    const url = new URL(project.url);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Invalid project URL: ${project.id}`);
    return `<li class="project"><a class="project-link" data-project="${escape(project.id)}" href="${escape(url.href)}" target="_blank" rel="noopener noreferrer"><span class="project-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><div class="project-info"><div class="project-title"><h3>${escape(project.title)}</h3><span class="project-domain">${escape(url.hostname)}</span></div><p class="project-description">${escape(project.description)}</p></div><span class="project-arrow" aria-hidden="true">↗</span><span class="sr-only">새 탭에서 열기</span></a></li>`;
  }).join('\n');
  const values = { ...profile, year: new Date().getFullYear() };
  const html = source.replace(/\{\{(\w+)\}\}/g, (_,key) => key === 'projects' ? projectHTML : escape(values[key] ?? ''));
  await writeFile(resolve(root,'dist/index.html'),html);
  console.log('Built portfolio → dist/');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
