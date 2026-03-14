document.addEventListener('DOMContentLoaded', () => {

  // ─── Custom Cursor ───
  const cursor = document.querySelector('.cursor');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX - 14}px, ${cursorY - 14}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = document.querySelectorAll('a, button, .event-card, .day-grid-item');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // ─── Tabs ───
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const tabNav = document.querySelector('.tab-nav');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach((panel) => {
        panel.classList.remove('active');
        if (panel.id === target) {
          panel.classList.add('active');
          triggerAnimations(panel);
        }
      });

      if (target === 'marseille') {
        tabNav.classList.add('marseille-active');
      } else {
        tabNav.classList.remove('marseille-active');
      }

      const weekends = document.querySelector('.weekends');
      weekends.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ─── Scroll Reveal ───
  const revealElements = document.querySelectorAll(
    '.intro-text, .weekend-hero-title, .weekend-hero-subtitle, .statement-text, .event-card, .day-grid-item'
  );

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));

  function triggerAnimations(panel) {
    const els = panel.querySelectorAll(
      '.weekend-hero-title, .weekend-hero-subtitle, .statement-text, .event-card, .day-grid-item'
    );
    els.forEach((el) => {
      el.classList.remove('visible');
      void el.offsetWidth;
    });
    setTimeout(() => {
      els.forEach((el) => observer.observe(el));
    }, 100);
  }

  // ─── Stagger Event Cards ───
  const staggerGroups = document.querySelectorAll('.events, .day-grid');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.event-card, .day-grid-item');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
        });
      }
    });
  }, { threshold: 0.1 });

  staggerGroups.forEach((group) => staggerObserver.observe(group));
});
