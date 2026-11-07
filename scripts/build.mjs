import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
const escape = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const assetPath = value => typeof value === 'string' && /^\/assets\/[\w/.-]+$/.test(value) && !value.split('/').includes('..');
const externalURL = value => {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Invalid external URL: ${value}`);
  return url.href;
};
const render = (source, values, markup = {}) => source.replace(/\{\{(\w+)\}\}/g, (_, key) => Object.hasOwn(markup, key) ? markup[key] : escape(values[key] ?? ''));
const externalLink = (url, label, className = '') => `<a${className ? ` class="${className}"` : ''} href="${escape(externalURL(url))}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span><span class="sr-only"> (새 탭)</span></a>`;
const blocks = items => items.map(([title, body]) => `<div class="feature"><h3>${escape(title)}</h3><p>${escape(body)}</p></div>`).join('\n');

export async function build() {
  const { profile, projects } = await import(`${new URL('../public/content.js', import.meta.url).href}?v=${Date.now()}`);
  // Validate paths before writing pages; detail routes always stay inside dist/projects/.
  const ids = new Set();
  for (const project of projects) {
    if (!/^[a-z0-9-]+$/.test(project.id) || ids.has(project.id)) throw new Error(`Invalid or duplicate project ID: ${project.id}`);
    ids.add(project.id);
    if (project.details) {
      if (project.url !== `/projects/${project.id}/`) throw new Error(`Invalid project route: ${project.url}`);
    } else externalURL(project.url);
  }
  await rm(resolve(root, 'dist'), { recursive: true, force: true });
  await mkdir(resolve(root, 'dist'), { recursive: true });
  await cp(resolve(root, 'public'), resolve(root, 'dist'), { recursive: true });
  const source = await readFile(resolve(root, 'public/index.html'), 'utf8');
  const projectHTML = projects.map((project, index) => {
    const internal = Boolean(project.details);
    const url = internal ? project.url : externalURL(project.url);
    const image = assetPath(project.image) ? `<div class="project-visual"><img src="${escape(project.image)}" alt="${escape(project.imageAlt || '')}" width="840" height="600" loading="lazy"></div>` : '';
    const category = project.category ? `<span>${escape(project.category)}</span>` : '';
    const focus = project.focus ? `<p class="project-focus"><span>작업 주제</span>${escape(project.focus)}</p>` : '';
    const intention = !internal && project.intention ? `<details class="project-details"><summary>작업 소개 <span aria-hidden="true">+</span></summary><p>${escape(project.intention)}</p></details>` : '';
    const target = internal ? '' : ' target="_blank" rel="noopener noreferrer"';
    return `<li class="project"><div class="project-meta"><span>${String(index + 1).padStart(2, '0')}</span>${category}</div><a class="project-link" data-project="${escape(project.id)}" href="${escape(url)}"${target}>${image}<div class="project-heading"><h3>${escape(project.title)}</h3><span class="project-arrow" aria-hidden="true">${internal ? '→' : '↗'}</span></div><p class="project-description">${escape(project.description)}</p><span class="project-domain">${internal ? '더 알아보기' : '프로젝트 방문'} <span aria-hidden="true">${internal ? '→' : '↗'}</span><span>${internal ? '프로젝트 소개' : escape(new URL(url).hostname)}</span></span>${internal ? '' : '<span class="sr-only">새 탭에서 열기</span>'}</a>${focus}${intention}</li>`;
  }).join('\n');
  const values = { ...profile, year: new Date().getFullYear() };
  await writeFile(resolve(root, 'dist/index.html'), render(source, values, { projects: projectHTML }));

  const detailProjects = projects.filter(project => project.details);
  if (detailProjects.length) {
    const template = await readFile(resolve(root, 'templates/project.html'), 'utf8');
    for (const [index, project] of detailProjects.entries()) {
      const detail = project.details;
      if (!assetPath(project.image)) throw new Error(`Invalid project image: ${project.id}`);
      const actions = [
        detail.live && externalLink(detail.live, '서비스 방문', 'action-primary'),
        detail.download && externalLink(detail.download, 'Windows 다운로드', 'action-primary'),
        detail.repo && externalLink(detail.repo, 'GitHub 소스', 'action-secondary'),
      ].filter(Boolean).join('');
      const gallery = (detail.gallery || []).map(item => {
        if (!assetPath(item.image)) throw new Error(`Invalid gallery image: ${project.id}`);
        return `<figure class="detail-gallery"><img src="${escape(item.image)}" alt="${escape(item.alt)}" width="1280" height="720" loading="lazy"><figcaption>${escape(item.caption)}</figcaption></figure>`;
      }).join('');
      const next = detailProjects[(index + 1) % detailProjects.length];
      const markup = {
        actions,
        heroCaption: detail.heroCaption ? `<figcaption>${escape(detail.heroCaption)}</figcaption>` : '',
        facts: detail.facts.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join(''),
        features: blocks(detail.features || []),
        gallery,
        missions: detail.missions ? `<h3 class="detail-subheading">사무실에서 맡게 될 여섯 가지 업무</h3><ol class="mission-list">${detail.missions.map(([title, body]) => `<li><h4>${escape(title)}</h4><p>${escape(body)}</p></li>`).join('')}</ol>` : '',
        implementation: detail.implementation ? `<h3 class="detail-subheading">구현에서 다룬 것들</h3><div class="implementation-list">${blocks(detail.implementation)}</div>` : '',
        controls: detail.controls ? `<h3 class="detail-subheading" id="controls-title">기본 조작</h3><div class="controls-table"><table aria-labelledby="controls-title"><thead><tr><th scope="col">입력</th><th scope="col">동작</th></tr></thead><tbody>${detail.controls.map(([key, action]) => `<tr><th scope="row">${escape(key)}</th><td>${escape(action)}</td></tr>`).join('')}</tbody></table></div>` : '',
        playNote: detail.playNote ? `<p>${escape(detail.playNote)}</p>` : '',
        connections: [detail.live && externalLink(detail.live, '서비스 방문'), detail.download && externalLink(detail.download, 'Windows 다운로드 · 최신 릴리스'), detail.repo && externalLink(detail.repo, 'GitHub · 소스 코드'), detail.sourceUrl && externalLink(detail.sourceUrl, detail.sourceLabel)].filter(Boolean).join(''),
        nextProject: `<a href="${escape(next.url)}"><span>다음 프로젝트 <span aria-hidden="true">→</span></span><strong>${escape(next.title)}</strong></a>`,
      };
      const html = render(template, {
        ...values, ...project, ...detail,
        pageUrl: new URL(project.url, profile.siteUrl).href,
        imageUrl: new URL(project.image, profile.siteUrl).href,
        imageAlt: project.imageAlt || `${project.title} 프로젝트 소개 이미지`,
      }, markup);
      const directory = resolve(root, 'dist/projects', project.id);
      await mkdir(directory, { recursive: true });
      await writeFile(resolve(directory, 'index.html'), html);
    }
  }
  const urls = ['/', ...detailProjects.map(project => project.url)];
  await writeFile(resolve(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${escape(new URL(path, profile.siteUrl).href)}</loc></url>`).join('')}</urlset>\n`);
  console.log(`Built portfolio → dist/ (${detailProjects.length} project pages)`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
