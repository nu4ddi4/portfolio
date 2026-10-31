const list = document.querySelector('.page-tabs');
const tabs = [...list.querySelectorAll('[data-panel]')];
const panels = tabs.map(tab => document.getElementById(tab.dataset.panel));

list.setAttribute('role', 'tablist');
tabs.forEach((tab, index) => {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', panels[index].id);
  panels[index].setAttribute('role', 'tabpanel');
  panels[index].setAttribute('aria-labelledby', tab.id);
  panels[index].tabIndex = 0;
});

function selectPanel(id, { focus = false, history = false } = {}) {
  const selected = tabs.find(tab => tab.dataset.panel === id);
  if (!selected) return;
  const focusWasInHiddenPanel = panels.some(panel => panel.id !== id && panel.contains(document.activeElement));
  tabs.forEach((tab, index) => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    panels[index].hidden = !active;
  });
  if (history && location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
  if (focus || focusWasInHiddenPanel) selected.focus({ preventScroll: true });
}

tabs.forEach(tab => tab.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  selectPanel(tab.dataset.panel, { history: true });
}));

list.addEventListener('keydown', event => {
  const index = tabs.indexOf(document.activeElement);
  if (index < 0) return;
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  else if (event.key === ' ' || event.key === 'Enter') next = index;
  else return;
  event.preventDefault();
  selectPanel(tabs[next].dataset.panel, { focus: true, history: true });
});

const restoreHash = () => selectPanel(location.hash ? location.hash.slice(1) : 'work');
window.addEventListener('hashchange', restoreHash);
window.addEventListener('popstate', restoreHash);
selectPanel(location.hash === '#about' ? 'about' : 'work');
