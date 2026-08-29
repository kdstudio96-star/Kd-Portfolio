/**
 * main.js — builds the Kd Growth Engine portfolio from src/data.js.
 * Vanilla ES modules + Lenis (smooth scroll) + GSAP ScrollTrigger + Three.js.
 */

import './styles.css';
import './responsive-fixes.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScene } from './scene.js';
import {
  profile, hero, socials, navLinks, perfStrip, expPanel, brandStrip, metrics, ecosystem, experience,
  caseStudy, evaCase, paidMedia, philosophy, services, tools, contact, serviceOptions,
} from './data.js';

const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);

let lenis = null;
const scrollTo = (t) => {
  if (lenis) lenis.scrollTo(t, { offset: -70 });
  else if (typeof t === 'string') document.querySelector(t)?.scrollIntoView();
  else window.scrollTo(0, t || 0);
};
const waHref = `https://wa.me/${profile.whatsapp}`;

/* ---------------------------------------------------------------- helpers */
const h = (tag, attrs = {}, children = []) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
};
const head = (id, kicker, titleLines, lead) =>
  h('div', { class: 'sec-head' }, [
    kicker ? h('p', { class: 'kicker', text: kicker }) : null,
    h('h2', { id, class: 'sec-title' }, [].concat(titleLines).map((l, i) => h('span', { class: 'sec-title-line', text: l, style: `--i:${i}` }))),
    lead ? h('p', { class: 'sec-lead', text: lead }) : null,
  ]);
const pending = () => h('span', { class: 'pending', text: 'Data update pending' });

/* platform / metric icons — simplified marks, not exact brand logos */
const GLYPH = {
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4.5" fill="currentColor"/><path d="M10 8.5v7l6-3.5z" fill="#0a0508"/>',
  meta: '<path d="M6.5 7.5C4 7.5 3 10 3 12s1 4.5 3.5 4.5c2.6 0 3.7-3.4 5.5-6.4C15 6.8 16 7.5 17.5 7.5 20 7.5 21 10 21 12s-1 4.5-3.5 4.5c-2.6 0-3.7-3.4-5.5-6.4" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>',
  google: '<path d="M20.5 12a8.5 8.5 0 1 1-3-6.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/><path d="M20.5 12H13" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>',
  click: '<path d="M6 3.5 19.5 10 13 12.2 10.7 19 6 3.5Z" fill="currentColor"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  bars: '<path d="M4 20V11M9.5 20V4M15 20v-8M20.5 20V8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  money: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6.5v11M9.2 9.2a2.8 2 0 0 1 5.6 0c0 2-5.6 1-5.6 3a2.8 2 0 0 0 5.6 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  tiktok: '<path d="M15.5 4c.3 2 1.5 3.6 3.6 3.9v2.8c-1.4 0-2.8-.4-4-1.1v5.9a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.05v2.9a3 3 0 1 0 2.2 2.9V4h3.2Z" fill="currentColor"/>',
  x: '<path d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  snapchat: '<path d="M12 3.5c2.7 0 4 2 4 4.5 0 .6 0 1.3-.1 1.9.7-.1 1.5-.5 2 .2.3.5-.3 1-1.2 1.5-.6.3-1.4.4-1.5.9.3 1.1 2 1.7 3 2 .5.1.4.8-.3 1-.7.3-1.7.2-2.1 1-.3.5.1 1.1-.5 1.3-.5.2-1-.3-2-.3s-1.5.6-2.9.6-1.9-.6-2.9-.6-1.5.5-2 .3c-.6-.2-.2-.8-.5-1.3-.4-.8-1.4-.7-2.1-1-.7-.2-.8-.9-.3-1 1-.3 2.7-.9 3-2-.1-.5-.9-.6-1.5-.9-.9-.5-1.5-1-1.2-1.5.5-.7 1.3-.3 2-.2-.1-.6-.1-1.3-.1-1.9C8 5.5 9.3 3.5 12 3.5Z" fill="currentColor"/>',
};
const iconSvg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${GLYPH[name] || GLYPH.bars}</svg>`;
const stat = (s) =>
  h('div', { class: `stat sys-${s.system || 'white'}` }, [
    s.verified === false
      ? pending()
      : h('span', { class: 'stat-value', 'data-count': s.value }, [s.value]),
    h('span', { class: 'stat-label', text: s.label }),
    s.note ? h('span', { class: 'stat-note', text: s.note }) : null,
  ]);

/* --------------------------------------------------------- social icons */
const ICONS = {
  whatsapp: 'M19 4.9A9.8 9.8 0 0 0 12 2C6.6 2 2.1 6.5 2.1 11.9c0 1.8.5 3.5 1.3 5L2 22l5.3-1.4A9.9 9.9 0 0 0 12 21.8c5.5 0 9.9-4.4 9.9-9.9A9.9 9.9 0 0 0 19 4.9ZM12 20a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20Zm4.5-6.2c-.25-.12-1.5-.73-1.7-.8-.24-.1-.4-.13-.56.12-.16.25-.64.8-.8.97-.13.16-.28.18-.53.06-1.5-.75-2.5-1.34-3.5-3-.26-.45.26-.42.75-1.4.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.66.3-.22.26-.86.85-.86 2.07 0 1.22.9 2.4 1 2.56.13.17 1.75 2.68 4.25 3.76 1.6.68 2.22.74 3 .63.48-.07 1.5-.6 1.7-1.2.22-.58.22-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z',
  linkedin: 'M6.94 5A2 2 0 1 1 3 5a2 2 0 0 1 3.94 0ZM3.3 8.5h3.4V21H3.3V8.5Zm5.6 0h3.25v1.7h.05a3.57 3.57 0 0 1 3.2-1.76c3.43 0 4.06 2.26 4.06 5.2V21h-3.4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H8.9V8.5Z',
  instagram: 'M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.42.47.66.25 1.2.6 1.75 1.15.55.55.9 1.1 1.15 1.75.25.63.42 1.36.47 2.42C21.99 8.94 22 9.3 22 12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.42-.25.66-.6 1.2-1.15 1.75-.55.55-1.1.9-1.75 1.15-.63.25-1.36.42-2.42.47-1.06.05-1.42.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.42-.47-.66-.25-1.2-.6-1.75-1.15-.55-.55-.9-1.1-1.15-1.75-.25-.63-.42-1.36-.47-2.42C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.42.25-.66.6-1.2 1.15-1.75.55-.55 1.1-.9 1.75-1.15.63-.25 1.36-.42 2.42-.47C8.94 2.01 9.3 2 12 2Zm0 1.8c-2.66 0-2.98.01-4.03.06-.97.04-1.5.2-1.85.34-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.35-.3.88-.34 1.85C3.83 9 3.82 9.32 3.82 12s.01 3 .06 4.05c.04.97.2 1.5.34 1.85.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.14.88.3 1.85.34 1.05.05 1.37.06 4.03.06s2.98-.01 4.03-.06c.97-.04 1.5-.2 1.85-.34.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.35.3-.88.34-1.85.05-1.05.06-1.37.06-4.05s-.01-3-.06-4.05c-.04-.97-.2-1.5-.34-1.85a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.35-.14-.88-.3-1.85-.34C14.98 3.81 14.66 3.8 12 3.8Zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28Zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68Zm5.34-3.15a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z',
  youtube: 'M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5C.1 8.4.1 12 .1 12s0 3.6.4 5.5a3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1c.4-1.9.4-5.5.4-5.5s0-3.6-.4-5.5ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z',
  tiktok: 'M16.5 3c.3 2.1 1.5 3.8 3.5 4.2v3c-1.4 0-2.7-.4-3.9-1.1v6.4a6.3 6.3 0 1 1-6.3-6.3c.3 0 .6 0 .9.06v3.1a3.3 3.3 0 1 0 2.3 3.14V3h3.5Z',
  x: 'M17.5 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.3 21H1l7.7-8.8L2 3h6.8l4.7 6.2L17.5 3Zm-1.2 16h1.8L7.8 4.9H5.9L16.3 19Z',
  email: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm.4 2.2 8.6 6 8.6-6M3 18l6-5m12 5-6-5',
};
function renderSocialRail() {
  const rail = document.getElementById('social-rail');
  socials.forEach((s) => {
    const svg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${s.key === 'email' ? 'none' : 'currentColor'}" ${s.key === 'email' ? 'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"' : ''} d="${ICONS[s.key]}"/></svg>`;
    const el = h('a', {
      class: 'social-link' + (s.url ? '' : ' is-disabled'),
      href: s.url || undefined,
      target: s.url && s.url.startsWith('http') ? '_blank' : undefined,
      rel: s.url && s.url.startsWith('http') ? 'noopener' : undefined,
      'aria-label': s.name + (s.url ? '' : ' — link pending'),
      style: `--hue:${s.hue}`,
      html: svg,
    });
    rail.append(el);
  });
}

/* ------------------------------------------------------------------ nav */
function renderNav() {
  const list = document.getElementById('nav-list');
  navLinks.forEach((l) => list.append(h('li', { class: 'nav-item' }, [h('a', { href: l.href, text: l.label })])));
}

/* --------------------------------------------------------------- hero */
function renderHero() {
  const root = document.getElementById('hero');
  root.append(
    h('div', { class: 'hero-inner' }, [
      h('p', { class: 'hero-eyebrow' }, [h('span', { class: 'hero-eyebrow-mark', 'aria-hidden': 'true', text: '✦' }), hero.eyebrow]),
      h('h1', { id: 'hero-heading', class: 'hero-title' }, hero.lines.map((line) => h('span', { class: 'hero-title-line' + (line === hero.gradientLine ? ' hero-title-line--grad' : '') }, [h('span', { text: line })]))),
      h('p', { class: 'hero-lead', text: profile.positioning }),
      h('div', { class: 'hero-ctas' }, [
        h('a', { class: 'btn btn--primary', href: hero.ctaPrimary.href }, [hero.ctaPrimary.label, h('span', { class: 'btn-badge', 'aria-hidden': 'true', text: '→' })]),
        h('a', { class: 'btn btn--ghost', href: hero.ctaSecondary.href, target: '_blank', rel: 'noopener noreferrer' }, [hero.ctaSecondary.label, h('span', { class: 'btn-badge', 'aria-hidden': 'true', text: '▸' })]),
      ]),
    ]),
    h('aside', { class: 'exp-panel' }, [
      ...expPanel.stats.flatMap((s, index) => [
        index ? h('span', { class: 'exp-div', 'aria-hidden': 'true' }) : null,
        h('div', { class: 'exp-stat' }, [h('span', { class: 'exp-value', 'data-count': s.value, text: '0' }), h('span', { class: 'exp-label', text: s.label })]),
      ]),
      h('span', { class: 'exp-div', 'aria-hidden': 'true' }),
      h('p', { class: 'exp-tagline', text: expPanel.tagline }),
      h('div', { class: 'exp-platforms' }, expPanel.platforms.map((platform) => h('span', { class: 'exp-plat', 'aria-label': platform, html: iconSvg(platform) }))),
    ]),
    h('a', { class: 'hero-scroll', href: '#perfstrip', 'aria-label': 'Scroll' }, [h('span', { class: 'hero-scroll-dot', 'aria-hidden': 'true' }), 'Scroll']),
  );
}

/* --------------------------------------------------------- performance strip */
function sparkline(series, cls) {
  if (!series) return null;
  const w = 200;
  const hgt = 40;
  const pts = series.map((v, i) => `${(i / (series.length - 1)) * w},${hgt - v * (hgt - 6) - 3}`);
  const area = `M0,${hgt} L${pts.join(' L')} L${w},${hgt} Z`;
  return h('svg', { class: 'spark ' + cls, viewBox: `0 0 ${w} ${hgt}`, 'aria-hidden': 'true', preserveAspectRatio: 'none' }, [
    h('path', { class: 'spark-fill', d: area }),
    h('polyline', { class: 'spark-line', points: pts.join(' '), fill: 'none' }),
  ]);
}
function renderPerfStrip() {
  const root = document.getElementById('perfstrip');
  root.append(
    h('ul', { class: 'perf-strip' },
      perfStrip.map((m) =>
        h('li', { class: `perf-card sys-${m.system}` }, [
          h('div', { class: 'perf-top' }, [
            h('span', { class: 'perf-icon', 'aria-hidden': 'true', html: iconSvg(m.icon) }),
            h('span', { class: 'perf-arrow', 'aria-hidden': 'true', text: '↗' }),
          ]),
          h('span', { class: 'perf-value', 'data-count': m.value, text: '0' }),
          h('span', { class: 'perf-label', text: m.label }),
          sparkline(m.spark, 'perf-spark'),
        ]),
      ),
    ),
  );
}
function renderBrandStrip() {
  const root = document.getElementById('brandstrip');
  root.append(
    h('div', { class: 'brands-showcase-heading' }, [h('span', { text: 'SELECTED PARTNERS' }), h('h2', { text: 'BRANDS I WORKED WITH' })]),
    h('div', { class: 'brand-strip' }, [
      h('ul', { class: 'brand-strip-list' },
        brandStrip.brands.flatMap((b, index) => {
          const brandKey = b.name.toLowerCase().split(' ')[0];
          const match = [ecosystem.centre, ...ecosystem.brands].find((item) => item.name.toLowerCase().startsWith(brandKey));
          const links = match ? { ...(match.socials || {}), website: match.website } : {};
          const item = h('li', { class: 'brand-word' }, [
            h('a', { class: 'brand-word-name', href: `#brand-${match?.slug || b.name.toLowerCase().replaceAll(' ', '-')}` , text: b.name }),
            match?.website ? h('a', { class: 'brand-word-site', href: match.website, target: '_blank', rel: 'noopener noreferrer', text: new URL(match.website).hostname.replace(/^www\./, '') }) : null,
          ]);
          return index < brandStrip.brands.length - 1
            ? [item, h('span', { class: 'brand-divider', 'aria-hidden': 'true' })]
            : [item];
        }),
      ),
    ]),
  );
}
function renderMetrics() {
  const root = document.getElementById('metrics');
  root.append(
    head('metrics-heading', 'The command center', ['The scale', 'of execution.'], 'Verified results from YouTube Studio, Google Ads and Meta Business Suite. TikTok, X and LinkedIn — data update pending.'),
    h('ul', { class: 'metric-grid' }, metrics.map((m) => h('li', { class: 'metric-cell' }, [stat(m)]))),
  );
}

/* ---------------------------------------------------------- brand universe */
function renderEcosystem() {
  const root = document.getElementById('ecosystem');
  root.append(
    head('ecosystem-heading', 'Brand universe', ecosystem.heading, `${ecosystem.centre.name} — ${ecosystem.centre.role}.`),
    h('div', { class: 'brand-grid' },
      ecosystem.brands.map((b) =>
        h('article', { id: `brand-${b.slug}`, class: `brand sys-${b.system}` + (b.featured ? ' brand--featured' : '') }, [
          h('div', { class: 'brand-top' }, [
            h('h3', { class: 'brand-name', text: b.name }),
            b.featured ? h('span', { class: 'brand-flag', text: 'Flagship case study' }) : null,
          ]),
          h('p', { class: 'brand-kind', text: b.kind }),
          h('p', { class: 'brand-work', text: b.work }),
          h('div', { class: 'brand-socials', 'aria-label': `${b.name} social links` }, [
            ...Object.entries({ ...(b.socials || {}), website: b.website }).filter(([, url]) => url).map(([key, url]) =>
              h('a', { class: `brand-social brand-social--${key}`, href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${b.name} ${key}` }, [h('img', { src: key === 'website' ? 'https://cdn.simpleicons.org/googlechrome/ff7a18' : key === 'youtube' ? '/logos/youtube.png' : `/logos/${key}.${key === 'facebook' ? 'jpg' : 'png'}`, alt: '' })]),
            ),
          ]),
          b.featured ? h('a', { class: 'brand-link', href: '#case-study', text: 'Read the Gatay Chalo case study →' }) : null,
        ]),
      ),
    ),
  );
}

/* --------------------------------------------------------------- experience */
function renderExperience() {
  const root = document.getElementById('experience');
  root.append(
    head('experience-heading', 'Experience', [experience.company], `${experience.role} · ${experience.dates}`),
    h('p', { class: 'exp-positioning', text: `“${experience.positioning}”` }),
    h('ul', { class: 'resp-grid' }, experience.responsibilities.map((r) => h('li', { class: 'resp', text: r }))),
    h('ol', { class: 'timeline' },
      experience.timeline.map((j) =>
        h('li', { class: 'tl-item' }, [
          h('div', { class: 'tl-marker', 'aria-hidden': 'true' }),
          h('div', { class: 'tl-body' }, [
            h('p', { class: 'tl-dates', text: j.dates }),
            h('h3', { class: 'tl-role', text: j.role }),
            h('p', { class: 'tl-org', text: j.org }),
            h('ul', { class: 'tl-points' }, j.points.map((p) => h('li', { text: p }))),
          ]),
        ]),
      ),
    ),
    h('div', { class: 'edu' }, [
      h('div', {}, [h('h3', { class: 'edu-title', text: 'Education' }), h('ul', { class: 'edu-list' }, experience.education.map((e) => h('li', {}, [h('b', { text: e.credential }), ` — ${e.org} · ${e.year}`])))]),
      h('div', {}, [h('h3', { class: 'edu-title', text: 'Languages' }), h('ul', { class: 'edu-list edu-list--inline' }, experience.languages.map((l) => h('li', { text: l })))]),
    ]),
  );
}

/* --------------------------------------------------------------- case study */
function renderCaseStudy() {
  const root = document.getElementById('case-study');
  root.append(
    head('case-study-heading', 'Flagship case study', [caseStudy.name, caseStudy.season], caseStudy.subtitle),
    h('ul', { class: 'tag-row' }, caseStudy.roleTags.map((t) => h('li', { class: 'tag', text: t }))),
    h('ul', { class: 'result-row' }, caseStudy.results.map((r) => h('li', { class: 'result' }, [stat({ ...r, system: 'pink' })]))),
    h('div', { class: 'topvids' }, [
      h('span', { class: 'topvids-label', text: 'Top videos' }),
      h('ul', {}, caseStudy.topVideos.map((v) => h('li', { text: v }))),
    ]),
    h('ol', { class: 'phase-flow' },
      caseStudy.phases.map((p, i) =>
        h('li', { class: 'phase' }, [
          h('span', { class: 'phase-n', text: String(i + 1).padStart(2, '0') }),
          h('h3', { class: 'phase-title', text: p.title }),
          h('p', { class: 'phase-body', text: p.body }),
        ]),
      ),
    ),
    h('p', { class: 'sec-note', text: caseStudy.note }),
  );
}

/* --------------------------------------------------------------- eva */
function renderEva() {
  const root = document.getElementById('eva');
  root.append(
    head('eva-heading', 'Connected case study', [evaCase.title]),
    h('p', { class: 'eva-body', text: evaCase.body }),
    h('ul', { class: 'tag-row' }, evaCase.tags.map((t) => h('li', { class: 'tag', text: t }))),
    h('p', { class: 'sec-note', text: evaCase.note }),
  );
}

/* --------------------------------------------------------- paid media */
function renderPaidMedia() {
  const root = document.getElementById('paid-media');
  const col = (c) =>
    h('div', { class: `paid-col sys-${c.system}` }, [
      h('h3', { class: 'paid-col-title', text: c.platform }),
      h('ul', { class: 'paid-stats' }, c.stats.map((s) => h('li', {}, [stat({ ...s, system: c.system })]))),
    ]);
  root.append(
    head('paid-media-heading', 'Paid-media command center', ['I manage media.', 'I measure everything.']),
    h('div', { class: 'paid-cols' }, [col(paidMedia.google), col(paidMedia.meta)]),
    h('ul', { class: 'lever-row' }, paidMedia.levers.map((l) => h('li', { class: 'lever', text: l }))),
    h('p', { class: 'sec-note', text: paidMedia.note }),
  );
}

/* --------------------------------------------------------- philosophy */
function renderPhilosophy() {
  const root = document.getElementById('philosophy');
  root.append(
    h('div', { class: 'phil-inner' }, [
      h('p', { class: 'kicker', text: 'How I think' }),
      h('h2', { id: 'philosophy-heading', class: 'phil-lines' }, philosophy.lines.map((l, i) => h('span', { class: 'phil-line', style: `--i:${i}`, text: l }))),
      h('p', { class: 'phil-body', text: philosophy.body }),
    ]),
  );
}

/* --------------------------------------------------------- services */
function renderServices() {
  const root = document.getElementById('services');
  root.append(
    head('services-heading', 'What I can do for your brand', ['From strategy to execution,', 'I build the system behind growth.']),
    h('div', { class: 'svc-list' },
      services.map((s) =>
        h('article', { class: `svc sys-${s.system}` }, [
          h('div', { class: 'svc-head' }, [h('span', { class: 'svc-n', text: s.n }), h('h3', { class: 'svc-title', text: s.title })]),
          h('div', { class: 'svc-body' }, [
            h('p', { class: 'svc-row' }, [h('b', { text: 'Problem — ' }), s.problem]),
            h('p', { class: 'svc-row' }, [h('b', { text: 'Strategy — ' }), s.strategy]),
            h('ul', { class: 'svc-exec' }, s.execution.map((e) => h('li', { text: e }))),
            h('p', { class: 'svc-row' }, [h('b', { text: 'Measure — ' }), s.measurement]),
            h('p', { class: 'svc-out' }, [h('b', { text: 'Outcome — ' }), s.outcome]),
          ]),
        ]),
      ),
    ),
  );
}

/* --------------------------------------------------------- tools */
function renderTools() {
  const root = document.getElementById('tools');
  root.append(
    head('tools-heading', 'Platform universe', [tools.centre]),
    h('ul', { class: 'tool-cloud' }, tools.items.map((t) => h('li', { class: 'tool', text: t }))),
  );
}

/* --------------------------------------------------------- contact */
function renderContact() {
  const root = document.getElementById('contact');
  const field = (label, control, hint) =>
    h('div', { class: 'field' }, [h('label', { for: control.id }, label), control, hint ? h('span', { class: 'field-hint', text: hint }) : null]);
  const nameI = h('input', { id: 'c-name', name: 'name', type: 'text', required: 'true', autocomplete: 'name' });
  const emailI = h('input', { id: 'c-email', name: 'email', type: 'email', required: 'true', autocomplete: 'email' });
  const countryI = h('input', { id: 'c-country', name: 'country', type: 'text', placeholder: 'Where are you based?' });
  const svcS = h('select', { id: 'c-service', name: 'service', required: 'true' }, [h('option', { value: '', text: 'Select a service…' }), ...serviceOptions.map((o) => h('option', { value: o, text: o }))]);
  const msgI = h('textarea', { id: 'c-message', name: 'message', rows: '4', placeholder: 'What are you trying to grow?' });
  const status = h('p', { class: 'form-status', role: 'status', 'aria-live': 'polite' });
  const form = h('form', {
    class: 'contact-form', novalidate: 'true',
    onsubmit: (e) => {
      e.preventDefault();
      if (!nameI.value.trim() || !emailI.value.trim() || !svcS.value) {
        status.textContent = 'Add your name, email and the service you need.';
        status.classList.add('is-error');
        return;
      }
      status.classList.remove('is-error');
      const body = [
        ['Name', nameI.value.trim()], ['Email', emailI.value.trim()], ['Country', countryI.value.trim()],
        ['Service', svcS.value], ['Message', msgI.value.trim()],
      ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Growth enquiry — ' + svcS.value)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Opening your email app with the details filled in…';
    },
  }, [
    h('div', { class: 'field-row' }, [field('Full name', nameI), field('Email', emailI)]),
    h('div', { class: 'field-row' }, [field('Country', countryI), field('Service you need', svcS)]),
    field('Project details', msgI),
    h('div', { class: 'form-actions' }, [
      h('button', { class: 'btn btn--primary', type: 'submit' }, ['Send request', h('span', { class: 'btn-arrow', 'aria-hidden': 'true', text: '→' })]),
      h('a', { class: 'btn btn--ghost', href: waHref, target: '_blank', rel: 'noopener', text: 'Or message on WhatsApp' }),
    ]),
    status,
  ]);

  root.append(
    h('div', { class: 'contact-inner' }, [
      h('div', { class: 'contact-copy' }, [
        h('h2', { id: 'contact-heading', class: 'contact-title' }, contact.heading.map((l) => h('span', { class: 'sec-title-line', text: l }))),
        h('p', { class: 'contact-body', text: contact.body }),
        h('div', { class: 'contact-links' }, [
          h('a', { href: `mailto:${profile.email}`, text: profile.email }),
          h('a', { href: waHref, target: '_blank', rel: 'noopener', text: `WhatsApp ${profile.phoneDisplay}` }),
          h('a', { href: profile.linkedin, target: '_blank', rel: 'noopener', text: 'LinkedIn' }),
        ]),
      ]),
      form,
    ]),
  );
}

/* --------------------------------------------------------- footer */
function renderFooter() {
  const foot = document.getElementById('site-footer');
  foot.append(
    h('div', { class: 'foot-grid' }, [
      h('div', { class: 'foot-brand' }, [
        h('span', { class: 'foot-mark', 'aria-hidden': 'true', text: 'Kd' }),
        h('p', { class: 'foot-name', text: profile.name }),
        h('p', { class: 'foot-role', text: profile.role }),
      ]),
      h('ul', { class: 'foot-tags' }, ['Performance Marketing', 'Social Media', 'Content', 'Paid Media', 'YouTube', 'Growth'].map((t) => h('li', { text: t }))),
      h('ul', { class: 'foot-links' }, navLinks.map((l) => h('li', {}, [h('a', { href: l.href, text: l.label })])).concat([h('li', {}, [h('a', { href: '#contact', text: 'Contact' })])])),
    ]),
    h('p', { class: 'foot-copy', text: `© ${new Date().getFullYear()} ${profile.name} · ${profile.role}` }),
  );
}

/* ------------------------------------------------------- counters */
function animateCount(el) {
  const raw = el.dataset.count || el.textContent;
  const m = String(raw).match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) { el.textContent = raw; return; }
  const [, pre, numStr, post] = m;
  const target = parseFloat(numStr.replace(/,/g, ''));
  const decimals = numStr.includes('.') ? 1 : 0;
  if (reduced || Number.isNaN(target)) { el.textContent = raw; return; }
  const dur = 1500;
  const t0 = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const fmt = (v) => (target >= 1000 ? Math.round(v).toLocaleString() : v.toFixed(decimals));
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = `${pre}${fmt(target * ease(p))}${post}`;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
function wireCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!('IntersectionObserver' in window)) return els.forEach(animateCount);
  const io = new IntersectionObserver((ents, obs) => ents.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); } }), { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------- smooth scroll + reveal */
function initLenis() {
  if (reduced) return;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.5, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
}
function wireReveal() {
  const items = document.querySelectorAll('.sec-head, .perf-card, .metric-cell, .brand, .resp, .tl-item, .result, .phase, .svc, .tool, .lever, .contact-form, .foot-brand, .edu > div');
  if (reduced) { items.forEach((i) => (i.style.opacity = 1)); return; }
  gsap.set(items, { opacity: 0, y: 24, filter: 'blur(6px)' });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, stagger: 0.06, ease: 'power3.out', overwrite: true }),
  });
  document.querySelectorAll('.sec-title-line, .phil-line').forEach((el) => {
    gsap.set(el, { yPercent: 115, opacity: 0 });
    ScrollTrigger.create({
      trigger: el, start: 'top 92%',
      onEnter: () => gsap.to(el, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out', delay: (parseFloat(el.style.getPropertyValue('--i')) || 0) * 0.08 }),
    });
  });
  const cue = document.querySelector('.hero-scroll');
  if (cue) gsap.to(cue, { opacity: 0, y: 12, ease: 'none', scrollTrigger: { start: 'top top', end: '+=260', scrub: true } });
}

/* ------------------------------------------------------- nav / fabs */
function wireNav() {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const list = document.getElementById('nav-list');
  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const dest = document.querySelector(a.getAttribute('href'));
    if (!dest) return;
    e.preventDefault();
    scrollTo(a.getAttribute('href'));
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  const links = [...list.querySelectorAll('a[href^="#"]')];
  const map = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { links.forEach((l) => l.classList.remove('is-active')); map.get(e.target.id)?.classList.add('is-active'); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['metrics', 'ecosystem', 'paid-media', 'services', 'experience', 'case-study'].forEach((id) => {
      const s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }
}
function wireFabs() {
  document.getElementById('fab-whatsapp').setAttribute('href', waHref);
  const top = document.getElementById('fab-top');
  top.addEventListener('click', () => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 })));
  const onScroll = () => { top.hidden = window.scrollY < window.innerHeight * 0.8; };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ------------------------------------------------------- scene */
function wireScene() {
  const canvas = document.getElementById('bg-scene');
  let scene;
  try {
    scene = initScene(canvas);
  } catch (err) {
    canvas.style.display = 'none';
    document.documentElement.classList.add('no-scene');
    console.warn('3D scene disabled:', err);
    return;
  }
  document.documentElement.dataset.sceneTier = scene.tier;
  const push = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scene.setScroll(max > 0 ? window.scrollY / max : 0);
  };
  push();
  if (lenis) lenis.on('scroll', push);
  else {
    let t = false;
    window.addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(() => { t = false; push(); }); } }, { passive: true });
  }
  window.addEventListener('resize', () => scene.resize(), { passive: true });

  if (!reduced && scene.setFocus) {
    ['hero', 'metrics', 'ecosystem', 'case-study', 'paid-media', 'services'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onToggle: (self) => self.isActive && scene.setFocus(i) });
    });
  }
}

/* ------------------------------------------------------- init */
function init() {
  renderSocialRail();
  renderNav();
  renderHero();
  renderPerfStrip();
  renderBrandStrip();
  renderMetrics();
  renderEcosystem();
  renderExperience();
  renderCaseStudy();
  renderEva();
  renderPaidMedia();
  renderPhilosophy();
  renderServices();
  renderTools();
  renderContact();
  renderFooter();

  initLenis();
  wireCounters();
  wireReveal();
  wireNav();
  wireFabs();
  wireScene();

  document.documentElement.classList.add('js-ready');
  document.body.style.opacity = '1';
  ScrollTrigger.refresh();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
