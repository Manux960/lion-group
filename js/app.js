/**
 * Lion Group — Main Application JavaScript
 * Compiled from TypeScript source (ts/app.ts)
 * Version 1.0.0
 */

'use strict';

// ── Utility ────────────────────────────────────────
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ── Page Loader ────────────────────────────────────
class PageLoader {
  constructor() {
    this.loader = $('#pageLoader');
    this.body = document.body;
  }

  init() {
    const minDuration = 2200;
    const startTime = Date.now();

    const hide = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        this.loader?.classList.add('hidden');
        this.body.classList.remove('loading');
      }, remaining);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
    }
  }
}

// ── Custom Cursor ──────────────────────────────────
class CustomCursor {
  constructor() {
    this.dot = $('#cursorDot');
    this.ring = $('#cursorRing');
    this.pos = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };
    this.raf = 0;
  }

  init() {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;
    if (!this.dot || !this.ring) return;

    document.addEventListener('mousemove', (e) => {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    });

    document.addEventListener('mouseenter', () => {
      this.dot.style.opacity = '1';
      this.ring.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
    });

    const hoverTargets = $$('a, button, [data-cursor-hover]');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => this.ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => this.ring.classList.remove('hovered'));
    });

    this.animate();
  }

  animate() {
    if (this.dot) {
      this.dot.style.left = `${this.pos.x}px`;
      this.dot.style.top  = `${this.pos.y}px`;
    }

    const lerp = 0.12;
    this.ringPos.x += (this.pos.x - this.ringPos.x) * lerp;
    this.ringPos.y += (this.pos.y - this.ringPos.y) * lerp;

    if (this.ring) {
      this.ring.style.left = `${this.ringPos.x}px`;
      this.ring.style.top  = `${this.ringPos.y}px`;
    }

    this.raf = requestAnimationFrame(() => this.animate());
  }
}

// ── Navbar ─────────────────────────────────────────
class Navbar {
  constructor() {
    this.nav    = $('#navbar');
    this.toggle = $('#navToggle');
    this.menu   = $('#navMenu');
    this.links  = $$('.nav-link[data-section]');
    this.lastScroll = 0;
  }

  init() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    this.toggle?.addEventListener('click', () => this.toggleMenu());

    this.menu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => this.closeMenu());
    });

    window.addEventListener('scroll', () => this.updateActiveLink(), { passive: true });
  }

  onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      this.nav?.classList.add('scrolled');
    } else {
      this.nav?.classList.remove('scrolled');
    }
    this.lastScroll = scrollY;
  }

  toggleMenu() {
    const isOpen = this.menu?.classList.toggle('open');
    this.toggle?.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.menu?.classList.remove('open');
    this.toggle?.classList.remove('active');
    document.body.style.overflow = '';
  }

  updateActiveLink() {
    const scrollY = window.scrollY + 100;

    this.links.forEach(link => {
      const section = link.dataset.section;
      if (!section) return;

      const el = $(`#${section}`);
      if (!el) return;

      const top    = el.offsetTop;
      const bottom = top + el.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        this.links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
}

// ── Scroll Reveal ──────────────────────────────────
class ScrollReveal {
  constructor() {
    this.elements = $$('.reveal-up, .reveal-left, .reveal-right, .reveal-pillar');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el    = entry.target;
          const delay = parseInt(el.dataset.delay ?? '0', 10);

          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);

          this.observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
  }

  init() {
    this.elements.forEach(el => this.observer.observe(el));
  }
}

// ── Counter Animation ──────────────────────────────
class CounterAnimation {
  constructor() {
    this.counters = $$('.stat-counter, .stat-num');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          this.animateCounter(entry.target);
          this.observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
  }

  init() {
    this.counters.forEach(el => this.observer.observe(el));
  }

  animateCounter(el) {
    const target   = parseInt(el.dataset.target ?? '0', 10);
    const suffix   = el.dataset.suffix ?? '';
    const duration = 2000;
    const fps      = 60;
    const frames   = duration / (1000 / fps);

    let current = 0;
    let frame   = 0;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const update = () => {
      frame++;
      const progress = easeOut(frame / frames);
      current = Math.min(Math.round(progress * target), target);

      el.textContent = current.toLocaleString('it-IT') + suffix;

      if (current < target) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
}

// ── Car Slider ─────────────────────────────────────
class CarSlider {
  constructor() {
    this.track         = $('#carsTrack');
    this.cards         = $$('.car-card');
    this.prevBtn       = $('#sliderPrev');
    this.nextBtn       = $('#sliderNext');
    this.dotsContainer = $('#sliderDots');
    this.dots          = [];

    this.state = {
      currentIndex: 0,
      cardWidth:    0,
      totalCards:   this.cards.length,
      gap:          24,
      isDragging:   false,
      startX:       0,
      dragDelta:    0,
    };
  }

  init() {
    if (!this.track || !this.cards.length) return;

    this.buildDots();
    this.updateDimensions();
    this.bindEvents();

    window.addEventListener('resize', () => this.updateDimensions(), { passive: true });
  }

  buildDots() {
    if (!this.dotsContainer) return;

    for (let i = 0; i < this.state.totalCards; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
    }
  }

  updateDimensions() {
    if (!this.cards.length) return;
    this.state.cardWidth = this.cards[0].offsetWidth;
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    // Mouse drag
    if (this.track) {
      this.track.addEventListener('mousedown',  (e) => this.dragStart(e.pageX));
      this.track.addEventListener('mousemove',  (e) => this.dragMove(e.pageX));
      this.track.addEventListener('mouseup',    ()  => this.dragEnd());
      this.track.addEventListener('mouseleave', ()  => this.dragEnd());

      // Touch
      this.track.addEventListener('touchstart', (e) => this.dragStart(e.touches[0].pageX), { passive: true });
      this.track.addEventListener('touchmove',  (e) => this.dragMove(e.touches[0].pageX),  { passive: true });
      this.track.addEventListener('touchend',   ()  => this.dragEnd());
    }

    // Auto-play
    this.autoPlay = setInterval(() => this.next(), 5000);

    this.track?.addEventListener('mouseenter', () => clearInterval(this.autoPlay));
    this.track?.addEventListener('mouseleave', () => {
      this.autoPlay = setInterval(() => this.next(), 5000);
    });
  }

  dragStart(x) {
    this.state.isDragging = true;
    this.state.startX     = x;
    this.state.dragDelta  = 0;
  }

  dragMove(x) {
    if (!this.state.isDragging) return;
    const delta = x - this.state.startX;
    this.state.dragDelta = delta;

    if (Math.abs(delta) > 5) {
      const baseOffset = -(this.state.currentIndex * (this.state.cardWidth + this.state.gap));
      if (this.track) {
        this.track.style.transition = 'none';
        this.track.style.transform  = `translateX(${baseOffset + delta * 0.5}px)`;
      }
    }
  }

  dragEnd() {
    if (!this.state.isDragging) return;
    this.state.isDragging = false;

    if (this.track) {
      this.track.style.transition = '';
    }

    const threshold = 60;
    if (this.state.dragDelta < -threshold)       this.next();
    else if (this.state.dragDelta > threshold)   this.prev();
    else                                          this.goTo(this.state.currentIndex);
  }

  visibleCount() {
    const sliderWidth = this.track?.parentElement?.offsetWidth ?? 0;
    if (!this.state.cardWidth) return 1;
    return Math.max(1, Math.floor(sliderWidth / (this.state.cardWidth + this.state.gap)));
  }

  goTo(index) {
    const maxIndex = Math.max(0, this.state.totalCards - this.visibleCount());
    this.state.currentIndex = clamp(index, 0, maxIndex);

    const offset = -(this.state.currentIndex * (this.state.cardWidth + this.state.gap));
    if (this.track) {
      this.track.style.transform = `translateX(${offset}px)`;
    }

    this.updateDots();
  }

  prev() {
    if (this.state.currentIndex === 0) {
      this.goTo(Math.max(0, this.state.totalCards - this.visibleCount()));
    } else {
      this.goTo(this.state.currentIndex - 1);
    }
  }

  next() {
    const maxIndex = Math.max(0, this.state.totalCards - this.visibleCount());
    if (this.state.currentIndex >= maxIndex) {
      this.goTo(0);
    } else {
      this.goTo(this.state.currentIndex + 1);
    }
  }

  updateDots() {
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.state.currentIndex);
    });
  }
}

// ── Parallax Hero ──────────────────────────────────
class HeroParallax {
  constructor() {
    this.heroImg = $('#heroImg');
    this.ticking = false;
  }

  init() {
    if (!this.heroImg) return;

    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.onScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;
    const rate = scrollY * 0.25;
    if (this.heroImg) {
      this.heroImg.style.transform = `translateY(${rate}px)`;
    }
  }
}

// ── Investment Bar Animation ───────────────────────
class InvestmentBars {
  constructor() {
    this.bars = $$('.invest-bar-fill');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const targetWidth = el.getAttribute('style')?.match(/width:\s*(\d+%)/)?.[1] ?? el.style.width;
          el.style.transition = 'none';
          el.style.width = '0';
          void el.offsetWidth;
          el.style.transition = 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.width = targetWidth;
          this.observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
  }

  init() {
    this.bars.forEach(bar => {
      const w = bar.style.width;
      bar.dataset.targetWidth = w;
      bar.style.width = '0';
      this.observer.observe(bar);
    });
  }
}

// ── Contact Form ───────────────────────────────────
class ContactForm {
  constructor() {
    this.form       = $('#contactForm');
    this.successMsg = $('#formSuccess');
    this.errorMsg   = $('#formError');
    // Formspree endpoint — registrati su formspree.io e sostituisci l'ID
    this.endpoint   = 'https://formspree.io/f/xpwzovlp';
  }

  init() {
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async handleSubmit() {
    const btn     = this.form?.querySelector('button[type="submit"]');
    const btnSpan = btn?.querySelector('span');

    if (btn) { btn.disabled = true; }
    if (btnSpan) btnSpan.textContent = 'Invio in corso...';

    this.successMsg?.classList.remove('visible');
    this.errorMsg?.classList.remove('visible');

    try {
      const response = await fetch(this.endpoint, {
        method:  'POST',
        body:    new FormData(this.form),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        this.form.reset();
        this.successMsg?.classList.add('visible');
        setTimeout(() => this.successMsg?.classList.remove('visible'), 6000);
      } else {
        throw new Error('HTTP ' + response.status);
      }
    } catch (err) {
      this.errorMsg?.classList.add('visible');
    } finally {
      if (btn) { btn.disabled = false; }
      if (btnSpan) btnSpan.textContent = 'Invia Messaggio';
    }
  }
}

// ── Smooth Scroll ──────────────────────────────────
class SmoothScroll {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        const navHeight = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
}

// ── Service Card Hover Lines ───────────────────────
class ServiceCardEffects {
  init() {
    const cards = $$('.service-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  }
}

// ── Content Manager (CMS integration) ─────────────
class ContentManager {
  constructor() {
    this.key = 'liongroup_cms';
  }

  init() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return;
      const data = JSON.parse(raw);
      // Strip legacy values that referenced years
      if (data.about?.title && /\d+\s*anni/i.test(data.about.title)) {
        data.about.title = 'Chi Siamo';
      }
      if (data.about?.lead && /dal\s+20\d\d/i.test(data.about.lead)) {
        data.about.lead = 'Lion Group è un gruppo imprenditoriale multisettoriale fondato da professionisti di alto profilo nel mondo del business, della finanza e dell\'automotive di lusso.';
      }
      this.apply(data);
    } catch (e) {
      // No CMS data, use defaults from HTML
    }
  }

  apply(data) {
    // Hero
    if (data.hero) {
      const h = data.hero;
      this.setText('[data-cms="hero-subtitle"]', h.subtitle);
      if (h.image) {
        const heroImg = $('#heroImg');
        if (heroImg) heroImg.src = h.image;
      }
      const lines = document.querySelectorAll('.title-reveal');
      if (lines[0] && h.title1) lines[0].textContent = h.title1;
      if (lines[1] && h.title2) lines[1].textContent = h.title2;
      if (lines[2] && h.title3) lines[2].textContent = h.title3;
    }

    // Services section header
    if (data.section?.services) {
      const ss = data.section.services;
      this.setText('[data-cms="services-label"]', ss.label);
      this.setText('[data-cms="services-title"]', ss.title);
      this.setText('[data-cms="services-desc"]',  ss.desc);
    }

    // Service cards
    if (data.services) {
      data.services.forEach((s, i) => {
        this.setText(`[data-cms="service-title-${i}"]`, s.title);
        this.setText(`[data-cms="service-desc-${i}"]`,  s.desc);
      });
    }

    // Pillars
    if (data.pillars) {
      data.pillars.forEach((p, i) => {
        this.setText(`[data-cms="pillar-${i}-title"]`, p.title);
        this.setText(`[data-cms="pillar-${i}-desc"]`,  p.desc);
        if (p.img) {
          const img = document.querySelector(`[data-cms-img="pillar-${i}-img"]`);
          if (img) img.src = p.img;
        }
      });
    }

    // Investments
    if (data.investments) {
      const inv = data.investments;
      this.setText('[data-cms="invest-label"]',         inv.label);
      this.setText('[data-cms="invest-title"]',         inv.title);
      this.setText('[data-cms="invest-desc"]',          inv.desc);
      this.setText('[data-cms="invest-feat-0-title"]',  inv.feat0title);
      this.setText('[data-cms="invest-feat-0-desc"]',   inv.feat0desc);
      this.setText('[data-cms="invest-feat-1-title"]',  inv.feat1title);
      this.setText('[data-cms="invest-feat-1-desc"]',   inv.feat1desc);
      this.setText('[data-cms="invest-feat-2-title"]',  inv.feat2title);
      this.setText('[data-cms="invest-feat-2-desc"]',   inv.feat2desc);
      this.setText('[data-cms="invest-startup-num"]',   inv.startupNum);
      this.setText('[data-cms="invest-startup-label"]', inv.startupLabel);
      this.setText('[data-cms="invest-startup-meta"]',  inv.startupMeta);
      this.setText('[data-cms="invest-re-num"]',        inv.reNum);
      this.setText('[data-cms="invest-re-label"]',      inv.reLabel);
      this.setText('[data-cms="invest-re-meta"]',       inv.reMeta);
      if (inv.image) {
        const img = document.querySelector('[data-cms-img="invest-img"]');
        if (img) img.src = inv.image;
      }
    }

    // About
    if (data.about) {
      const a = data.about;
      this.setText('[data-cms="about-label"]',        a.label);
      this.setText('[data-cms="about-title"]',        a.title);
      this.setText('[data-cms="about-lead"]',         a.lead);
      this.setText('[data-cms="about-body"]',         a.body);
      this.setText('[data-cms="about-quote"]',        a.quoteText);
      this.setText('[data-cms="about-quote-author"]', a.quoteAuthor);
      if (a.imgBg) {
        const img = document.querySelector('[data-cms-img="about-bg"]');
        if (img) img.src = a.imgBg;
      }
    }

    // Contact
    if (data.contact) {
      const c = data.contact;
      this.setText('[data-cms="contact-label"]', c.label);
      this.setText('[data-cms="contact-title"]', c.sectionTitle);
      this.setText('[data-cms="contact-desc"]',  c.sectionDesc);
      const infoItems = document.querySelectorAll('.contact-info-item p');
      if (infoItems[0] && c.address) infoItems[0].innerHTML = c.address.replace(/\n/g, '<br>');
      if (infoItems[1] && c.email)   infoItems[1].textContent = c.email;
    }

    // Footer
    if (data.footer) {
      const f = data.footer;
      this.setText('[data-cms="footer-tagline"]',   f.tagline);
      this.setText('[data-cms="footer-desc"]',      f.desc);
      this.setText('[data-cms="footer-copyright"]', f.copyright);
      // Footer columns
      const autoCols = document.querySelectorAll('.footer-col:nth-child(2) li a');
      const autoKeys = ['auto1','auto2','auto3','auto4','auto5'];
      autoCols.forEach((el, i) => { if (f[autoKeys[i]]) el.textContent = f[autoKeys[i]]; });
      const invCols = document.querySelectorAll('.footer-col:nth-child(3) li a');
      const invKeys = ['inv1','inv2','inv3','inv4'];
      invCols.forEach((el, i) => { if (f[invKeys[i]]) el.textContent = f[invKeys[i]]; });
    }

    // Social
    if (data.social) {
      const socialLinks = document.querySelectorAll('.social-link');
      const platforms = ['instagram', 'linkedin', 'facebook', 'youtube'];
      socialLinks.forEach((link, i) => {
        if (data.social[platforms[i]] && data.social[platforms[i]] !== '#') {
          link.href = data.social[platforms[i]];
        }
      });
    }
  }

  setText(selector, value) {
    if (!value) return;
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }
}

// ── Luxury 3D Tilt + Gold Spotlight ────────────────
class LuxuryTilt {
  constructor() {
    this.el = document.querySelector('.about-media');
  }
  init() {
    const inner = this.el?.querySelector('.about-img-main');
    if (!this.el || !inner) return;
    const MAX_TILT = 13;
    this.el.addEventListener('mousemove', (e) => {
      const rect = this.el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top)  / rect.height;
      const rotX =  (0.5 - y) * MAX_TILT * 2;
      const rotY =  (x - 0.5) * MAX_TILT * 2;
      inner.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
      inner.style.setProperty('--glare-x', `${x * 100}%`);
      inner.style.setProperty('--glare-y', `${y * 100}%`);
      inner.classList.add('tilt-active');
    });
    this.el.addEventListener('mouseleave', () => {
      inner.style.transform = '';
      inner.classList.remove('tilt-active');
    });
  }
}

// ── Hero Scramble Decode ────────────────────────────
class HeroScramble {
  constructor() {
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  init() {
    const reveals = document.querySelectorAll('.title-reveal');
    if (!reveals.length) return;

    // Sync delays with CSS animation-delay on .title-wrap:nth-child
    const delays = [450, 620, 790];

    reveals.forEach((el, i) => {
      const target = el.textContent.trim();
      setTimeout(() => this._scramble(el, target, i === reveals.length - 1), delays[i] || 450);
    });
  }

  _scramble(el, target, isLast) {
    const SCRAMBLE_MS = 600;  // ms of pure randomness while sliding up
    const RESOLVE_MS  = 420;  // ms to lock chars left→right
    const TICK        = 38;
    const scramFrames = Math.round(SCRAMBLE_MS / TICK);
    const resolFrames = Math.round(RESOLVE_MS  / TICK);
    let frame = 0;

    const rand = () => this.chars[Math.floor(Math.random() * this.chars.length)];

    const id = setInterval(() => {
      frame++;

      if (frame <= scramFrames) {
        // All chars random
        el.textContent = target.split('').map(c => /[a-zA-Z]/.test(c) ? rand() : c).join('');
      } else {
        // Resolve left → right
        const resolved = Math.floor(((frame - scramFrames) / resolFrames) * target.length);
        el.textContent = target.split('').map((c, j) =>
          j < resolved || !/[a-zA-Z]/.test(c) ? c : rand()
        ).join('');
      }

      if (frame >= scramFrames + resolFrames) {
        clearInterval(id);
        el.textContent = target;
        // Trigger gold flare once last line resolves
        if (isLast) {
          setTimeout(() => {
            const flare = document.getElementById('heroFlare');
            if (flare) {
              flare.classList.add('active');
              flare.addEventListener('animationend', () => flare.classList.remove('active'), { once: true });
            }
          }, 80);
        }
      }
    }, TICK);
  }
}

// ── Hero Floating Particles ─────────────────────────
class HeroParticles {
  init() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('span');
      p.className = 'hero-particle';
      const size = 1 + Math.random() * 2.5;
      p.style.cssText = `
        left:              ${5 + Math.random() * 90}%;
        top:               ${25 + Math.random() * 55}%;
        width:             ${size}px;
        height:            ${size}px;
        animation-delay:   ${Math.random() * 9}s;
        animation-duration:${7 + Math.random() * 9}s;
        opacity: 0;
      `;
      hero.appendChild(p);
    }
  }
}

// ── App Entry Point ────────────────────────────────
class LionGroupApp {
  constructor() {
    this.modules = [
      new ContentManager(),
      new PageLoader(),
      new CustomCursor(),
      new Navbar(),
      new ScrollReveal(),
      new CounterAnimation(),
      new HeroParallax(),
      new InvestmentBars(),
      new ContactForm(),
      new SmoothScroll(),
      new ServiceCardEffects(),
      new LuxuryTilt(),
      new HeroScramble(),
      new HeroParticles(),
    ];
  }

  init() {
    this.modules.forEach(mod => mod.init());
    console.log('%c🦁 LION GROUP — Excellence Beyond Limits', 'font-size:14px;color:#c9a96e;font-weight:bold;');
  }
}

// Boot on DOM ready
const app = new LionGroupApp();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
