document.addEventListener('DOMContentLoaded', () => {

  // ─── Cursor (instant dot, slight ring trail) ───
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

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

  document.querySelectorAll('a, button, .mosaic-img, .visual-hero, .hero-city, .timeline-step, .address-link')
    .forEach((el) => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
    });

  // ─── Hero scroll-to-content links ───
  document.querySelectorAll('[data-scroll]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ─── Address popup ───
  const popup = document.createElement('div');
  popup.className = 'address-popup';
  popup.innerHTML = `
    <button class="address-popup-item" data-action="copy">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      <span>Copier l'adresse</span>
    </button>
    <a class="address-popup-item" data-action="apple" target="_blank" rel="noopener">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
      <span>Apple Maps</span>
    </a>
    <a class="address-popup-item" data-action="google" target="_blank" rel="noopener">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>Google Maps</span>
    </a>
  `;
  document.body.appendChild(popup);

  let currentAddress = '';

  function positionPopup(anchor) {
    const rect = anchor.getBoundingClientRect();
    const popupH = popup.offsetHeight || 140;
    const popupW = popup.offsetWidth || 200;
    let top = rect.bottom + 8;
    let left = rect.left;

    if (top + popupH > window.innerHeight) top = rect.top - popupH - 8;
    if (left + popupW > window.innerWidth) left = window.innerWidth - popupW - 12;
    if (left < 12) left = 12;

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
  }

  document.querySelectorAll('[data-address]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      currentAddress = el.dataset.address;
      const encoded = encodeURIComponent(currentAddress);

      popup.querySelector('[data-action="apple"]').href =
        `https://maps.apple.com/?q=${encoded}`;
      popup.querySelector('[data-action="google"]').href =
        `https://www.google.com/maps/search/?api=1&query=${encoded}`;

      const copyBtn = popup.querySelector('[data-action="copy"]');
      copyBtn.querySelector('span').textContent = "Copier l'adresse";
      copyBtn.classList.remove('address-popup-copied');

      popup.classList.add('active');
      positionPopup(el);
    });
  });

  popup.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(currentAddress).then(() => {
      const btn = popup.querySelector('[data-action="copy"]');
      btn.querySelector('span').textContent = 'Copié !';
      btn.classList.add('address-popup-copied');
      setTimeout(() => popup.classList.remove('active'), 800);
    });
  });

  popup.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      setTimeout(() => popup.classList.remove('active'), 100);
    });
  });

  document.addEventListener('click', () => popup.classList.remove('active'));
  document.addEventListener('scroll', () => popup.classList.remove('active'), { passive: true });

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
});
