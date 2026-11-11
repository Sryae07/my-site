/**
 * nav.js — one navigation, written once, put into every page.
 *
 * Why a script and not copy-paste? Because a nav pasted into five pages is five
 * places to edit when one link changes. Here the markup lives in nav.html and is
 * fetched once per page load.
 *
 * Two details that matter:
 *  - It needs http:// (Live Server, or GitHub Pages). Opening the file directly
 *    with file:// blocks fetch for security reasons, so there is a fallback below
 *    that builds the same list from data instead of failing silently.
 *  - The current page is marked with aria-current="page", so the style comes from
 *    semantics instead of a hard-coded class on every page.
 */

const NAV_ITEMS = [
  { href: 'index.html', label: 'Home' },
  { href: 'quotes.html', label: 'Quotes' },
  { href: 'project.html', label: 'Projects' },
  { href: 'machine.html', label: 'Machine' },
];

function markCurrentPage(root) {
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  root.querySelectorAll('.nav-list a').forEach((link) => {
    const target = (link.getAttribute('href') || '').toLowerCase();
    if (target === here) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

function wireMobileToggle(root) {
  const button = root.querySelector('.nav-toggle');
  const list = root.querySelector('.nav-list');
  if (!button || !list) return;

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    list.classList.toggle('is-open', !isOpen);
  });
}

function fallbackNav(root) {
  const links = NAV_ITEMS
    .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
    .join('');
  root.innerHTML = `
    <a class="brand" href="index.html">
      <span class="brand-mark" aria-hidden="true">&lt;/&gt;</span>
      <span class="brand-text">Learning HTML</span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-list">Menu</button>
    <ul class="nav-list" id="nav-list">${links}</ul>
  `;
}

async function installNav() {
  const root = document.querySelector('[data-nav]');
  if (!root) return;

  try {
    const response = await fetch('nav.html', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    root.innerHTML = await response.text();
  } catch (error) {
    // file:// or a missing fragment: still give the visitor a working menu.
    console.warn('[nav] fetched fragment unavailable, using fallback:', error.message);
    fallbackNav(root);
  }

  markCurrentPage(root);
  wireMobileToggle(root);
}

installNav();
