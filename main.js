document.addEventListener('DOMContentLoaded', () => {

  // ─── Cursor (instant dot, slight ring trail) ───
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.classList.add('visible');
    ring.classList.add('visible');
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.remove('visible');
    ring.classList.remove('visible');
  });

  (function tick() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a, button, .mosaic-img, .visual-hero, .hero-city, .timeline-step')
    .forEach((el) => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
    });

  // ─── Hero Navigation ───
  document.querySelectorAll('[data-hero-tab]').forEach((side) => {
    side.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(side.dataset.heroTab);
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
        const parent = el.closest('.mosaic, .timeline');
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
