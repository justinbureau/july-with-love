document.addEventListener('DOMContentLoaded', () => {

  // ─── Dual Cursor ───
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;

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

  (function animate() {
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    ringX += (mouseX - ringX) * 0.08;
    ringY += (mouseY - ringY) * 0.08;

    const dotW = dot.offsetWidth;
    const ringW = ring.offsetWidth;

    dot.style.transform  = `translate(${dotX - dotW / 2}px, ${dotY - dotW / 2}px)`;
    ring.style.transform = `translate(${ringX - ringW / 2}px, ${ringY - ringW / 2}px)`;

    requestAnimationFrame(animate);
  })();

  const hoverTargets = document.querySelectorAll(
    'a, button, [data-expandable], .visual-break, .visual-hero'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    });
  });

  // ─── Expandable Cards ───
  document.querySelectorAll('[data-expandable]').forEach((card) => {
    card.addEventListener('click', () => {
      const wasExpanded = card.classList.contains('expanded');

      card.closest('.events, .day-grid')
        ?.querySelectorAll('[data-expandable].expanded')
        .forEach((c) => c.classList.remove('expanded'));

      if (!wasExpanded) {
        card.classList.add('expanded');
      }
    });
  });

  // ─── Tab Switching ───
  const tabNav    = document.getElementById('tabNav');
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach((panel) => {
        panel.classList.remove('active');
        if (panel.id === target) {
          panel.classList.add('active');
          resetReveals(panel);
        }
      });

      tabNav.classList.toggle('theme-dark', target === 'marseille');

      document.querySelector('.weekends').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ─── Scroll Reveal ───
  const revealOpts = { threshold: 0.12, rootMargin: '0px 0px -30px 0px' };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');

        const parent = el.closest('.events, .day-grid');
        if (parent) {
          const siblings = [...parent.querySelectorAll('.reveal')];
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = `${idx * 0.08}s`;
        }
      }
    });
  }, revealOpts);

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  function resetReveals(panel) {
    const els = panel.querySelectorAll('.reveal');
    els.forEach((el) => {
      el.classList.remove('visible');
      el.style.transitionDelay = '0s';
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        els.forEach((el) => revealObserver.observe(el));
      });
    });
  }
});
