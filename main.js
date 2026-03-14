document.addEventListener('DOMContentLoaded', () => {

  // ─── Dual Cursor ───
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.classList.add('visible');
    ring.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.remove('visible');
    ring.classList.remove('visible');
  });

  (function tick() {
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    ringX += (mouseX - ringX) * 0.08;
    ringY += (mouseY - ringY) * 0.08;
    dot.style.transform  = `translate(${dotX - dot.offsetWidth / 2}px, ${dotY - dot.offsetWidth / 2}px)`;
    ring.style.transform = `translate(${ringX - ring.offsetWidth / 2}px, ${ringY - ring.offsetWidth / 2}px)`;
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a, button, .mosaic-img, .visual-hero, .hero-side')
    .forEach((el) => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
    });

  // ─── Hero Side Navigation ───
  document.querySelectorAll('[data-hero-tab]').forEach((side) => {
    side.addEventListener('click', (e) => {
      e.preventDefault();
      const target = side.dataset.heroTab;
      switchTab(target);
    });
  });

  // ─── Tabs ───
  const tabNav  = document.getElementById('tabNav');
  const btns    = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.tab-panel');

  function switchTab(target) {
    btns.forEach((b) => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${target}"]`).classList.add('active');
    panels.forEach((p) => {
      p.classList.remove('active');
      if (p.id === target) { p.classList.add('active'); resetReveals(p); }
    });
    tabNav.classList.toggle('theme-dark', target === 'marseille');
    document.querySelector('.weekends').scrollIntoView({ behavior: 'smooth' });
  }

  btns.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // ─── Scroll Reveal ───
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const parent = el.closest('.mosaic');
        if (parent) {
          const siblings = [...parent.querySelectorAll('.reveal')];
          el.style.transitionDelay = `${siblings.indexOf(el) * 0.08}s`;
        }
        el.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));

  function resetReveals(panel) {
    const els = panel.querySelectorAll('.reveal');
    els.forEach((el) => { el.classList.remove('visible'); el.style.transitionDelay = '0s'; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      els.forEach((el) => obs.observe(el));
    }));
  }
});
