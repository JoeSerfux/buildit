/* =====================================================================
   buildIt scroll slider
   A vertical slider on the right edge of the page. Drag the thumb, click
   the track, click a dot to jump to a section, or use the arrow keys.
   Colors come from the site theme (--blue, --sun, --surface, --line ...),
   so changing the theme in index.html changes the slider too.
   To remove it: delete this file and its <script> tag.
   ===================================================================== */
(function () {
  'use strict';
  function start() {
  try {

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- styles ---------- */
    const css = `
.ss { position: fixed; right: 16px; top: 50%; z-index: 35; height: min(52vh, 420px); width: 34px; transform: translateY(-50%); display: flex; justify-content: center; user-select: none; -webkit-user-select: none; touch-action: none; opacity: 0; transition: opacity .35s; }
.ss.ready { opacity: 1; }
.ss-track { position: relative; width: 34px; height: 100%; cursor: pointer; }
.ss-rail { position: absolute; left: 50%; top: 0; bottom: 0; width: 4px; margin-left: -2px; border-radius: 4px; background: var(--line, #265150); overflow: hidden; transition: width .2s, margin-left .2s, box-shadow .2s; }
.ss:hover .ss-rail, .ss.drag .ss-rail { width: 6px; margin-left: -3px; box-shadow: 0 0 18px -2px color-mix(in srgb, var(--blue, #35d0c0) 55%, transparent); }
.ss-fill { position: absolute; left: 0; right: 0; top: 0; height: var(--fill, 0px); border-radius: 4px; background: linear-gradient(180deg, var(--brand-1, var(--b1, #22b3a8)), var(--blue, #35d0c0)); }
.ss-dot { position: absolute; left: 50%; width: 12px; height: 12px; margin: -6px 0 0 -6px; padding: 0; border-radius: 50%; border: 2px solid var(--line, #265150); background: var(--bg, #061211); cursor: pointer; transition: transform .2s, border-color .2s, background .2s; z-index: 1; }
.ss-dot:hover { transform: scale(1.35); border-color: var(--blue, #35d0c0); }
.ss-dot.past { border-color: var(--blue, #35d0c0); }
.ss-dot.act { background: var(--blue, #35d0c0); border-color: var(--blue, #35d0c0); box-shadow: 0 0 0 4px color-mix(in srgb, var(--blue, #35d0c0) 22%, transparent); }
.ss-dot span { position: absolute; right: 24px; top: 50%; transform: translate(8px, -50%); white-space: nowrap; pointer-events: none; opacity: 0; padding: 5px 11px; border-radius: 8px; font: 500 11.5px var(--font-mono, ui-monospace, monospace); letter-spacing: .12em; text-transform: uppercase; color: var(--ink, #eefcf8); background: var(--surface, #0f2726); border: 1.5px solid var(--line, #265150); box-shadow: 0 12px 26px -14px rgba(0, 0, 0, .8); transition: opacity .18s, transform .18s; }
.ss-dot:hover span, .ss-dot:focus-visible span { opacity: 1; transform: translate(0, -50%); }
.ss-thumb { position: absolute; left: 50%; top: 0; width: 22px; height: 40px; margin-left: -11px; border-radius: 99px; cursor: grab; z-index: 2; background: linear-gradient(160deg, var(--blue, #35d0c0), var(--brand-1, var(--b1, #22b3a8))); box-shadow: 0 0 0 1.5px rgba(255, 255, 255, .25) inset, 0 10px 24px -8px color-mix(in srgb, var(--blue, #35d0c0) 70%, transparent), 0 0 22px -4px color-mix(in srgb, var(--blue, #35d0c0) 60%, transparent); transition: transform .18s, box-shadow .2s; display: grid; place-items: center; }
.ss-thumb::before { content: ""; width: 8px; height: 14px; background: repeating-linear-gradient(180deg, var(--onblue, #04201f) 0 2px, transparent 2px 5px); opacity: .7; border-radius: 2px; }
.ss-thumb:hover { transform: scale(1.08); }
.ss.drag .ss-thumb { cursor: grabbing; transform: scale(1.14); }
.ss-thumb:focus-visible { outline: 3px solid var(--sun, #ffcb9a); outline-offset: 3px; }
.ss-tip { position: absolute; right: 36px; top: 50%; transform: translate(8px, -50%) scale(.9); transform-origin: right center; padding: 6px 12px; border-radius: 10px; font: 500 12px var(--font-mono, ui-monospace, monospace); letter-spacing: .1em; color: var(--onblue, #04201f); background: var(--sun, #ffcb9a); white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .15s, transform .15s; }
.ss-tip::after { content: ""; position: absolute; right: -4px; top: 50%; width: 8px; height: 8px; margin-top: -4px; background: inherit; transform: rotate(45deg); border-radius: 2px; }
.ss:hover .ss-tip, .ss.drag .ss-tip { opacity: 1; transform: translate(0, -50%) scale(1); }
.ss-btn { position: absolute; left: 50%; width: 34px; height: 34px; margin-left: -17px; padding: 0; border-radius: 50%; display: grid; place-items: center; cursor: pointer; color: var(--blue, #35d0c0); background: var(--surface, #0f2726); border: 1.5px solid var(--line, #265150); transition: transform .15s, border-color .2s, background .2s, opacity .3s; }
.ss-btn svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.ss-btn:hover { transform: translateY(-2px); border-color: var(--blue, #35d0c0); background: color-mix(in srgb, var(--blue, #35d0c0) 12%, var(--surface, #0f2726)); }
.ss-btn:focus-visible { outline: 3px solid var(--sun, #ffcb9a); outline-offset: 2px; }
.ss-btn.up { top: -46px; }
.ss-btn.down { bottom: -46px; }
.ss-btn.off { opacity: .35; pointer-events: none; }
html.ss-on { scrollbar-width: none; }
html.ss-on::-webkit-scrollbar { display: none; }
@media (max-width: 760px), (pointer: coarse) {
  .ss { right: 3px; width: 22px; height: min(42vh, 300px); }
  .ss-track { width: 22px; }
  .ss-rail, .ss:hover .ss-rail, .ss.drag .ss-rail { width: 3px; margin-left: -1.5px; box-shadow: none; }
  .ss-btn, .ss-dot span { display: none; }
  .ss-dot { width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px; border-width: 1.5px; }
  .ss-dot.act { box-shadow: 0 0 0 3px color-mix(in srgb, var(--blue, #35d0c0) 22%, transparent); }
  .ss-thumb { width: 12px; height: 34px; margin-left: -6px; }
  .ss-thumb::before { width: 4px; height: 10px; }
  .ss-thumb::after { content: ""; position: absolute; inset: -6px -10px; } /* bigger touch area */
  .ss-thumb:hover, .ss.drag .ss-thumb { transform: none; }
  .ss-tip { right: 24px; font-size: 11px; padding: 5px 10px; }
  .ss:hover .ss-tip { opacity: 0; }
  .ss.drag .ss-tip { opacity: 1; }
  .ss.ready.idle { opacity: .0; }
  .ss.ready.idle.drag { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .ss *, .ss { transition: none !important; } }
`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    /* ---------- markup ---------- */
    const el = (tag, cls, attrs) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k]));
      return e;
    };
    const arrow = d => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>';

    const root = el('div', 'ss', { role: 'group', 'aria-label': 'Page scroll slider' });
    const up = el('button', 'ss-btn up', { type: 'button', 'aria-label': 'Scroll to top' });
    up.innerHTML = arrow('M6 15l6-6 6 6');
    const down = el('button', 'ss-btn down', { type: 'button', 'aria-label': 'Scroll to bottom' });
    down.innerHTML = arrow('M6 9l6 6 6-6');
    const track = el('div', 'ss-track');
    const rail = el('div', 'ss-rail');
    const fill = el('div', 'ss-fill');
    rail.appendChild(fill);
    const thumb = el('div', 'ss-thumb', { role: 'slider', tabindex: '0', 'aria-label': 'Page position', 'aria-orientation': 'vertical', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0' });
    const tip = el('div', 'ss-tip');
    thumb.appendChild(tip);
    track.append(rail, thumb);
    root.append(up, track, down);
    document.body.appendChild(root);
    document.documentElement.classList.add('ss-on'); // hides the browser's default scrollbar

    /* ---------- sections (read from the page's own menu) ---------- */
    const stops = [{ name: 'Top', node: document.getElementById('top') || document.body }];
    // menu links: top menu on most pages, side menu on the dashboard page
    document.querySelectorAll('.nav nav a[href^="#"]:not(.btn), .side a.nv[href^="#"]').forEach(a => {
      const node = document.querySelector(a.getAttribute('href'));
      if (node && !stops.some(s => s.node === node)) stops.push({ name: a.textContent.trim(), node });
    });
    const contact = document.getElementById('contact');
    if (contact) stops.push({ name: 'Contact', node: contact });
    stops.forEach(s => {
      s.dot = el('button', 'ss-dot', { type: 'button', 'aria-label': 'Go to ' + s.name });
      const label = el('span'); label.textContent = s.name;
      s.dot.appendChild(label);
      s.dot.addEventListener('click', e => { e.stopPropagation(); jump(s.pos * maxScroll()); });
      s.dot.addEventListener('pointerdown', e => e.stopPropagation());
      track.appendChild(s.dot);
    });

    /* ---------- maths ---------- */
    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const trackH = () => track.clientHeight;
    const thumbH = () => thumb.offsetHeight;
    const travel = () => Math.max(1, trackH() - thumbH());
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const jump = (y, smooth) => window.scrollTo({ top: clamp(y, 0, maxScroll()), behavior: smooth === false || reduce ? 'instant' : 'smooth' });

    function layoutDots() {
      const max = maxScroll(), th = thumbH(), tr = trackH();
      stops.forEach((s, i) => {
        const y = i === 0 ? 0 : s.node.getBoundingClientRect().top + scrollY - 70;
        s.pos = clamp(y / max, 0, 1);
        s.dot.style.top = (th / 2 + s.pos * (tr - th)) + 'px';
      });
    }

    /* ---------- drawing ---------- */
    let dragging = false;
    function draw() {
      const p = clamp(scrollY / maxScroll(), 0, 1);
      const y = p * travel();
      thumb.style.top = y + 'px';
      fill.style.setProperty('--fill', (y + thumbH() / 2) + 'px');
      const pct = Math.round(p * 100);
      thumb.setAttribute('aria-valuenow', pct);
      let cur = stops[0];
      stops.forEach(s => { if (s.pos <= p + 0.002) cur = s; s.dot.classList.toggle('past', s.pos <= p + 0.002); });
      stops.forEach(s => s.dot.classList.toggle('act', s === cur));
      tip.textContent = cur.name + ' · ' + pct + '%';
      thumb.setAttribute('aria-valuetext', cur.name + ', ' + pct + ' percent');
      up.classList.toggle('off', p <= 0.001);
      down.classList.toggle('off', p >= 0.999);
    }

    let ticking = false;
    // on small screens the slider fades out when you stop scrolling
    let idleT;
    const wake = () => {
      root.classList.remove('idle');
      clearTimeout(idleT);
      idleT = setTimeout(() => { if (!dragging) root.classList.add('idle'); }, 1400);
    };
    const onScroll = () => { wake(); if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; draw(); }); } };
    addEventListener('scroll', onScroll, { passive: true });

    let rt;
    const relayout = () => { layoutDots(); draw(); };
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(relayout, 120); });
    addEventListener('load', relayout);
    if ('ResizeObserver' in window) new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(relayout, 120); }).observe(document.body);

    /* ---------- dragging ---------- */
    const toY = clientY => {
      const r = track.getBoundingClientRect();
      const p = clamp((clientY - r.top - thumbH() / 2) / travel(), 0, 1);
      jump(p * maxScroll(), false);
    };
    thumb.addEventListener('pointerdown', e => {
      dragging = true; root.classList.add('drag');
      thumb.setPointerCapture(e.pointerId);
      e.preventDefault(); e.stopPropagation();
    });
    thumb.addEventListener('pointermove', e => { if (dragging) toY(e.clientY); });
    const end = e => { if (!dragging) return; dragging = false; root.classList.remove('drag'); try { thumb.releasePointerCapture(e.pointerId); } catch (x) {} };
    thumb.addEventListener('pointerup', end);
    thumb.addEventListener('pointercancel', end);

    /* click on the empty track: jump there */
    track.addEventListener('pointerdown', e => {
      if (e.target !== track && e.target !== rail && e.target !== fill) return;
      const r = track.getBoundingClientRect();
      const p = clamp((e.clientY - r.top - thumbH() / 2) / travel(), 0, 1);
      jump(p * maxScroll());
    });

    /* arrows */
    up.onclick = () => jump(0);
    down.onclick = () => jump(maxScroll());

    /* keyboard on the thumb */
    thumb.addEventListener('keydown', e => {
      const step = innerHeight * 0.4;
      const k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowRight') jump(scrollY + step);
      else if (k === 'ArrowUp' || k === 'ArrowLeft') jump(scrollY - step);
      else if (k === 'PageDown') jump(scrollY + innerHeight * 0.9);
      else if (k === 'PageUp') jump(scrollY - innerHeight * 0.9);
      else if (k === 'Home') jump(0);
      else if (k === 'End') jump(maxScroll());
      else return;
      e.preventDefault();
    });

    /* start */
    layoutDots(); draw();
    setTimeout(() => { layoutDots(); draw(); }, 600); // after fonts and animations settle
    requestAnimationFrame(() => { root.classList.add('ready'); wake(); });
    thumb.addEventListener('pointerdown', wake);
    thumb.addEventListener('pointerup', wake);
  } catch (e) { /* the slider is optional: never break the site */ }
  }
  // works wherever the script tag is (in <head> or at the end of <body>)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();