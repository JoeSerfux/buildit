/* buildIt sample projects: shared effects (reveal on scroll, progress bar, counters, toast) */
(function () {
  'use strict';
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // background glow + progress bar
  const bar = document.createElement('div'); bar.id = 'fx-bar';
  const aur = document.createElement('div'); aur.className = 'aurora'; aur.setAttribute('aria-hidden', 'true'); aur.innerHTML = '<i></i><i></i><i></i>';
  document.body.prepend(bar, aur);
  let tick = false;
  const onScroll = () => {
    tick = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // number counters
  window.countUp = function (el) {
    const to = parseFloat(el.dataset.count), dec = (el.dataset.dec | 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = pre + to.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (to * e).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // scroll reveal
  const targets = $$('[data-rv]');
  targets.forEach(el => {
    const sibs = Array.from(el.parentNode.children);
    el.style.setProperty('--rd', Math.min(sibs.indexOf(el), 6) * 0.09 + 's');
    el.classList.add('rv');
  });
  const show = el => { el.classList.add('in'); $$('[data-count]', el).concat(el.matches('[data-count]') ? [el] : []).forEach(window.countUp); };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(el => io.observe(el));
  } else targets.forEach(show);
  setTimeout(() => targets.forEach(el => { if (!el.classList.contains('in')) show(el); }), 6000);

  // toast
  let tt;
  window.toast = function (msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2800);
  };
})();
