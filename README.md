# Learning HTML

The four-page site I built for the Web Technologies module: a home page, a page
of quotes, a page of project ideas, and a page with a useless machine and a
small game.

Live: <https://sryae07.github.io/my-site/>

## How it is put together

- `nav.html` + `nav.js` — one navigation, fetched into every page. Adding a link
  means editing one file, not four. If the fetch fails the script builds the same
  menu from an array, so the page never ends up with an empty header.
- `style.css` — one stylesheet for the whole site, written mobile-first. The base
  rules describe a phone; media queries add columns at 44rem and 52rem.
- `quotes.html` — fifteen quotes, and a hero that shows a different one on each
  load without repeating the previous choice.
- `machine.html` + `machine.js` — a switch that turns itself off, and a 30-second
  game where you click a moving dot. Both work with the keyboard.
- `images/` — the hero is hand-written SVG; the icons and the social preview are
  generated from a script so they stay consistent.

No framework, no build step, no dependencies. Open `index.html` through a local
server (the navigation is fetched, so `file://` falls back to the built-in menu).

## Accessibility notes

Every page has a skip link, a `main` landmark and one `h1`. The navigation marks
the current page with `aria-current="page"`. The machine switch exposes
`aria-pressed` and announces its state in a live region, and animations are
disabled under `prefers-reduced-motion`.
