/* ==========================================================================
   RIYAD PORTFOLIO: behavior
   --------------------------------------------------------------------------
   No libraries. Everything here is optional polish: the page content is plain
   HTML and stays readable if this file fails to load.

   Parts
     1. Optional sections (pricing, testimonials)
     2. Contact links built from js/site-config.js
     3. Service / package topic that pre-fills messages
     4. Mobile menu
     5. Current-section highlight in the menu
     6. Entrance effects
     7. FAQ accordion
     8. Hero: pause workflow animation off-screen, quiet particle background
     9. Footer year
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var contact = cfg.contact || {};
  var sections = cfg.sections || {};
  var messages = cfg.messages || {};

  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function prefersReduced() { return !!(reduceQuery && reduceQuery.matches); }

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* 1. Optional sections ------------------------------------------------ */
  function removeSection(id) {
    var el = document.getElementById(id);
    if (el) { el.remove(); }
    $$('a[href="#' + id + '"]').forEach(function (a) { (a.closest('li') || a).remove(); });
  }
  if (sections.pricing === false) { removeSection('pricing'); }
  if (sections.testimonials === false) { removeSection('testimonials'); }

  /* 2. Contact links ---------------------------------------------------- */
  var state = { topic: '' };

  function isEmail(v) { return /^[^\s@<>\[\]]+@[^\s@<>\[\]]+\.[^\s@<>\[\]]+$/.test(v); }
  function isPhone(v) {
    var digits = v.replace(/\D/g, '');
    return /^\+?[\d\s().-]+$/.test(v) && digits.length >= 8 && digits.length <= 15;
  }
  function isUrl(v) { return /^https:\/\/[^\s\[\]<>]+$/i.test(v); }
  function enc(s) { return encodeURIComponent(s); }

  function messageBody() {
    var hello = messages.greeting || 'Hi,';
    var about = state.topic ? "I'd like to talk about: " + state.topic + '.' : "I'd like to talk about: (describe your idea)";
    return hello + '\n\n' + about + '\n\nThe workflow I want to improve:\n\nThe tools I currently use:\n\nThe outcome I am looking for:\n';
  }

  function hrefFor(key) {
    var value = String(contact[key] || '').trim();
    if (key === 'email' && isEmail(value)) {
      var subject = state.topic ? 'Inquiry: ' + state.topic : (messages.emailSubject || 'Automation inquiry');
      return { href: 'mailto:' + value + '?subject=' + enc(subject) + '&body=' + enc(messageBody()), text: value, external: false };
    }
    if (key === 'whatsapp' && isPhone(value)) {
      var base = messages.greeting || 'Hi,';
      var line = state.topic ? "I'd like to talk about: " + state.topic + '.' : (messages.whatsappDefault || "I'd like to talk about automating a process.");
      return { href: 'https://wa.me/' + value.replace(/\D/g, '') + '?text=' + enc(base + ' ' + line), text: value, external: true };
    }
    if (key !== 'email' && key !== 'whatsapp' && isUrl(value)) {
      var text = value;
      try {
        var u = new URL(value);
        text = (u.hostname.replace(/^www\./, '') + u.pathname).replace(/\/$/, '');
      } catch (e) { /* keep the raw value */ }
      return { href: value, text: text, external: true };
    }
    return null;
  }

  function applyContacts() {
    $$('[data-contact]').forEach(function (a) {
      var key = a.getAttribute('data-contact');
      var link = hrefFor(key);
      var valueEl = $('.channel-value', a);
      if (link) {
        a.setAttribute('href', link.href);
        a.removeAttribute('aria-disabled');
        a.classList.remove('is-placeholder');
        if (link.external) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        } else {
          a.removeAttribute('target');
          a.removeAttribute('rel');
        }
        if (valueEl) { valueEl.textContent = link.text; }
      } else {
        a.removeAttribute('href');
        a.setAttribute('aria-disabled', 'true');
        a.classList.add('is-placeholder');
      }
    });
  }

  /* 3. Topic from "Discuss this service" / package links ----------------- */
  var topicNote = $('#topic-note');
  function setTopic(topic) {
    state.topic = topic || '';
    applyContacts();
    if (topicNote) {
      topicNote.hidden = !state.topic;
      var nameEl = $('[data-topic-name]', topicNote);
      if (nameEl) { nameEl.textContent = state.topic; }
    }
  }
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest ? e.target.closest('[data-topic]') : null;
    if (trigger) { setTopic(trigger.getAttribute('data-topic')); }
    if (e.target.closest && e.target.closest('[data-topic-clear]')) { setTopic(''); }
  });
  applyContacts();

  /* 4. Mobile menu ------------------------------------------------------ */
  var toggle = $('.nav-toggle');
  var nav = $('#primary-nav');
  function setMenu(open) {
    if (!toggle || !nav) { return; }
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { setMenu(false); } });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !e.target.closest('.site-header')) { setMenu(false); }
    });
    if (window.matchMedia) {
      var desktop = window.matchMedia('(min-width: 960px)');
      var onChange = function (e) { if (e.matches) { setMenu(false); } };
      if (desktop.addEventListener) { desktop.addEventListener('change', onChange); } else if (desktop.addListener) { desktop.addListener(onChange); }
    }
  }

  /* 5. Current-section highlight ----------------------------------------- */
  var navLinks = {};
  $$('.nav-links a[data-nav]').forEach(function (a) { navLinks[a.getAttribute('data-nav')] = a; });
  var spyEls = $$('[data-spy]');
  function setActive(key) {
    Object.keys(navLinks).forEach(function (k) {
      if (k === key) { navLinks[k].setAttribute('aria-current', 'true'); } else { navLinks[k].removeAttribute('aria-current'); }
    });
  }
  var spyTicking = false;
  function updateSpy() {
    spyTicking = false;
    if (!spyEls.length) { return; }
    var line = window.innerHeight * 0.35;
    var current = spyEls[0];
    spyEls.forEach(function (el) { if (el.getBoundingClientRect().top <= line) { current = el; } });
    var atBottom = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4;
    if (atBottom) { current = spyEls[spyEls.length - 1]; }
    setActive(current.getAttribute('data-spy'));
  }
  window.addEventListener('scroll', function () {
    if (!spyTicking) { spyTicking = true; window.requestAnimationFrame(updateSpy); }
  }, { passive: true });
  window.addEventListener('resize', updateSpy);
  updateSpy();

  /* 6. Entrance effects -------------------------------------------------- */
  var reveals = $$('.reveal');
  function showAll() { reveals.forEach(function (el) { el.classList.add('is-visible'); }); }
  if (!('IntersectionObserver' in window) || prefersReduced()) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }
  window.addEventListener('beforeprint', showAll);

  /* 7. FAQ accordion ------------------------------------------------------ */
  var faqButtons = $$('.faq-q');
  function setFaq(btn, open) {
    var item = btn.closest('.faq-item');
    if (item) { item.classList.toggle('is-open', open); }
    btn.setAttribute('aria-expanded', String(open));
  }
  faqButtons.forEach(function (btn, i) {
    setFaq(btn, i === 0);   // first answer starts open
    btn.addEventListener('click', function () { setFaq(btn, btn.getAttribute('aria-expanded') !== 'true'); });
    btn.addEventListener('keydown', function (e) {
      var idx = faqButtons.indexOf(btn), target = null;
      if (e.key === 'ArrowDown') { target = faqButtons[(idx + 1) % faqButtons.length]; }
      else if (e.key === 'ArrowUp') { target = faqButtons[(idx - 1 + faqButtons.length) % faqButtons.length]; }
      else if (e.key === 'Home') { target = faqButtons[0]; }
      else if (e.key === 'End') { target = faqButtons[faqButtons.length - 1]; }
      if (target) { e.preventDefault(); target.focus(); }
    });
  });

  var faqList = $('.faq-list');
  if (faqList) {
    window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { faqList.classList.add('is-ready'); }); });
  }

  /* 8. Hero: animation control and particles ------------------------------ */
  var panel = $('.flow-panel');
  var panelVisible = true;
  function syncPanel() { if (panel) { panel.classList.toggle('is-paused', !panelVisible || document.hidden); } }
  if (panel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { panelVisible = entries[0].isIntersecting; syncPanel(); }).observe(panel);
  }
  document.addEventListener('visibilitychange', syncPanel);

  (function particles() {
    var canvas = $('.hero-canvas');
    if (!canvas || prefersReduced() || !canvas.getContext) { return; }
    var ctx = canvas.getContext('2d');
    if (!ctx) { return; }
    var w = 0, h = 0, pts = [], raf = 0, last = 0, onScreen = true;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(32, Math.max(12, (w * h) / 34000)));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16, r: Math.random() * 1.1 + 0.6 });
      }
    }

    function draw(t) {
      raf = window.requestAnimationFrame(draw);
      if (t - last < 33) { return; }          // about 30 frames per second is plenty
      last = t;
      ctx.clearRect(0, 0, w, h);
      var i, j, p, q, dx, dy, d;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = w; } else if (p.x > w) { p.x = 0; }
        if (p.y < 0) { p.y = h; } else if (p.y > h) { p.y = 0; }
        ctx.fillStyle = 'rgba(125, 211, 252, 0.55)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j]; dx = p.x - q.x; dy = p.y - q.y; d = dx * dx + dy * dy;
          if (d < 14400) {
            ctx.strokeStyle = 'rgba(59, 130, 246, ' + (0.22 * (1 - d / 14400)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
    }

    function sync() {
      var shouldRun = onScreen && !document.hidden && !prefersReduced();
      if (shouldRun && !raf) { raf = window.requestAnimationFrame(draw); }
      if (!shouldRun && raf) { window.cancelAnimationFrame(raf); raf = 0; if (prefersReduced()) { ctx.clearRect(0, 0, w, h); } }
    }

    resize();
    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { onScreen = entries[0].isIntersecting; sync(); }).observe(canvas);
    }
    sync();
  })();

  /* 9. Footer year ------------------------------------------------------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
