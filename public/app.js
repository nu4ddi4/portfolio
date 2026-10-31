import { profile, projects } from './content.js';

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const externalURL = (value) => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(profile.email) ? profile.email : '';

$('#hero-intro').textContent = profile.intro;
$('#about-description').textContent = profile.about;
$('#copyright-year').textContent = new Date().getFullYear();
$('#skill-list').innerHTML = profile.skills.map(skill => `<span class="skill-tag">${escape(skill)}</span>`).join('');

const visuals = {
  mvno: `<div class="mvno-cover"><div class="cover-browser"><span class="browser-dots">● ● ●</span><span>mvno.feentn.com</span><span>↗</span></div><div class="mvno-cover-body"><span class="cover-kicker">A PERSONAL WEB PROJECT</span><div class="mvno-title">MVNO<span>↗</span></div><div class="signal-mark"><i></i><i></i><i></i><i></i></div><div class="mvno-cover-foot"><span>DESIGNED TO BE EXPLORED.</span><span>feentn.com</span></div></div></div>`,
  github: `<div class="github-cover"><svg class="github-symbol" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1.01 1.73 2.64 1.23 3.28.94.1-.73.4-1.23.72-1.51-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.16a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.33-2.63 5.28-5.14 5.56.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z"/></svg><span class="cover-kicker">IDEAS, IN CODE.</span><div class="github-cover-title">Hello, world<span>_</span></div><div class="github-code"><span class="code-comment">// keep learning. keep building.</span><br><span class="code-keyword">const</span> maker = <span class="code-string">'nu4ddi4'</span>;<br>curiosity.<span class="code-method">turnInto</span>(something);</div><div class="github-cover-foot"><span>⌘ &nbsp; GITHUB / NU4DDI4</span><span>↗</span></div></div>`,
};
const cover = project => {
  if (typeof project.image === 'string' && /^\/assets\/[\w/.-]+$/.test(project.image)) return `<img class="project-image" src="${escape(project.image)}" alt="" loading="lazy">`;
  return visuals[project.visual] || `<div class="generic-cover"><span class="cover-kicker">PERSONAL PROJECT</span><strong>${escape(project.title)}</strong><span>↗</span></div>`;
};

const grid = $('#project-grid');
grid.innerHTML = projects.map(project => `<article class="project-card" data-category="${escape(project.category)}"><button class="project-button" data-project="${escape(project.id)}" aria-label="${escape(project.title)} 프로젝트 상세 보기" aria-haspopup="dialog"><div class="project-visual visual-${escape(project.visual)}" aria-hidden="true"><span class="visual-label">${escape(project.number)} / ${escape(project.title.toUpperCase())}</span>${cover(project)}</div><div class="project-info"><div><div class="project-meta"><span>${escape(project.label)}</span><span class="meta-line"></span><span>${escape(project.year)}</span></div><h3 class="project-name">${escape(project.title)}</h3><p class="project-subtitle">${escape(project.subtitle)}</p></div><span class="project-go" aria-hidden="true">↗</span></div></button></article>`).join('');
$('#project-count').textContent = String(projects.length).padStart(2,'0');
$('.filter[data-filter="all"] span').textContent = String(projects.length).padStart(2,'0');

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
    if (!card.hidden) count++;
  });
  $('#project-count').textContent = String(count).padStart(2,'0');
  $('#filter-status').textContent = `${button.textContent.trim().replace(/\s*\d+$/, '')} 프로젝트 ${count}개`;
}));

const dialog = $('#project-dialog');
let trigger = null;
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-project]');
  if (!button) return;
  const project = projects.find(item => item.id === button.dataset.project);
  if (!project) return;
  const links = [[project.url, '사이트 방문'], [project.repository, '코드 보기']].map(([url,label]) => externalURL(url) ? `<a class="text-link" href="${escape(externalURL(url))}" target="_blank" rel="noopener noreferrer">${label} ↗</a>` : '').join('');
  $('#dialog-content').innerHTML = `<h2 class="dialog-heading" id="dialog-title">${escape(project.title)}</h2><p class="dialog-subtitle">${escape(project.subtitle)}</p><div class="dialog-tags">${project.tags.map(tag => `<span class="skill-tag">${escape(tag)}</span>`).join('')}</div><p class="dialog-description">${escape(project.summary)}</p>${(project.sections || []).map(section => `<section class="dialog-section"><h3>${escape(section.title)}</h3><p>${escape(section.body)}</p></section>`).join('')}<div class="dialog-links">${links}</div>`;
  trigger = button;
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('modal-open');
});
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); trigger?.focus({preventScroll:true}); });

const socials = [[profile.github,'GitHub'], [profile.linkedin,'LinkedIn']].filter(([url,label]) => externalURL(url) && (email || label !== 'GitHub'));
$('#contact-actions').innerHTML = `${email ? `<div class="contact-actions-row"><a class="email-link" href="mailto:${escape(email)}">${escape(email)} <span aria-hidden="true">↗</span></a><button class="copy-email" aria-label="이메일 주소 복사">⧉</button></div>` : (externalURL(profile.github) ? `<a class="email-link" href="${escape(externalURL(profile.github))}" target="_blank" rel="noopener noreferrer">GitHub에서 만나요 <span aria-hidden="true">↗</span></a>` : '<p class="contact-pending">연락처를 준비하고 있습니다.</p>')}${socials.length ? `<div class="social-links">${socials.map(([url,label])=>`<a href="${escape(externalURL(url))}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('')}</div>` : ''}`;
let toastTimer;
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('visible'); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500); }
$('.copy-email')?.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(email); toast('이메일 주소를 복사했습니다.'); }
  catch { toast(`복사할 이메일: ${email}`); }
});

const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open ? '메뉴 닫기' : '메뉴 열기');
  $('#main-nav').classList.toggle('open',open);
});
function closeMenu() { menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','메뉴 열기'); $('#main-nav').classList.remove('open'); }
document.querySelectorAll('#main-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
