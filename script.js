/* Portfolio scripts: 8 small, independent features. */
(() => {
  'use strict';

  // Tiny helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---- 1. Dark mode toggle (remembers choice) ---- */
  function initTheme() {
    const btn = $('#themeBtn');
    const apply = (dark) => {
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      btn.setAttribute('aria-pressed', dark);
      btn.textContent = dark ? 'Light mode' : 'Dark mode';
    };
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }
    apply(saved === 'dark');
    btn.addEventListener('click', () => {
      const dark = document.documentElement.dataset.theme !== 'dark';
      apply(dark);
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { /* ignore */ }
    });
  }

  /* ---- 2. Mobile menu toggle (closes after a link is clicked) ---- */
  function initMenu() {
    const btn = $('#menuBtn');
    const menu = $('#menu');
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---- 3. Scroll-spy: highlight the nav link of the section in view ---- */
  function initScrollSpy() {
    const links = $$('#menu a');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const match = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('active', match);
          if (match) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('main section').forEach((s) => observer.observe(s));
  }

  /* ---- 4. Typing effect in the hero ---- */
  function initTyping() {
    const el = $('#typed');
    const words = ['UNIMAS student', 'badminton player', 'fragrance collector', 'F1 fan'];
    // Skip animation for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = words[0];
      return;
    }
    let w = 0, i = 0, deleting = false;
    const tick = () => {
      const word = words[w];
      i += deleting ? -1 : 1;
      el.textContent = word.slice(0, i);
      let delay = deleting ? 50 : 100;
      if (!deleting && i === word.length) { deleting = true; delay = 1400; }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
      setTimeout(tick, delay);
    };
    tick();
  }

  /* ---- 5. Project filter buttons ---- */
  function initFilters() {
    const buttons = $$('.filters button');
    const cards = $$('.card[data-cat]');
    buttons.forEach((btn) => btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on);
      });
      cards.forEach((c) => c.classList.toggle('hide', f !== 'all' && c.dataset.cat !== f));
    }));
  }

  /* ---- 6. Reveal-on-scroll animation ---- */
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('show'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    $$('.reveal').forEach((el) => observer.observe(el));
  }

  /* ---- 7. Scroll progress bar + back-to-top button ---- */
  function initScrollUI() {
    const bar = $('#progress');
    const top = $('#topBtn');
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      top.hidden = window.scrollY < 400;
    };
    window.addEventListener('scroll', update, { passive: true });
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    update();
  }

  /* ---- 8. Contact form validation + character counter (front-end only) ---- */
  function initForm() {
    const form = $('#form');
    const msg = $('#msg');
    const count = $('#count');
    const status = $('#status');

    msg.addEventListener('input', () => { count.textContent = `(${msg.value.length}/300)`; });

    // Returns an error string, or '' when the field is fine
    const rules = {
      name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email.'),
      msg: (v) => (v.trim().length < 10 ? 'Message must be at least 10 characters.' : '')
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      Object.keys(rules).forEach((id) => {
        const input = $('#' + id);
        const error = rules[id](input.value);
        $('#' + id + 'Err').textContent = error;
        input.setAttribute('aria-invalid', error ? 'true' : 'false');
        if (error && ok) input.focus(); // focus the first invalid field
        if (error) ok = false;
      });
      if (!ok) { status.textContent = ''; return; }
      status.textContent = 'Thanks! Your message looks good (demo only, nothing was sent).';
      form.reset();
      count.textContent = '(0/300)';
    });
  }

  /* ---- Footer year ---- */
  $('#year').textContent = new Date().getFullYear();

  // Start everything
  initTheme();
  initMenu();
  initScrollSpy();
  initTyping();
  initFilters();
  initReveal();
  initScrollUI();
  initForm();
})();
