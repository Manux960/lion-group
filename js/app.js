/**
 * Lion Group — Main Application JavaScript
 * Version 2.0.0 — Clean & Professional
 */

'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ── Page Loader ────────────────────────────────────
class PageLoader {
  constructor() {
    this.loader = $('#pageLoader');
    this.body = document.body;
  }

  init() {
    const hide = () => {
      setTimeout(() => {
        this.loader?.classList.add('hidden');
        this.body.classList.remove('loading');
      }, 1200);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
    }
  }
}

// ── Navbar ─────────────────────────────────────────
class Navbar {
  constructor() {
    this.nav     = $('#navbar');
    this.toggle  = $('#navToggle');
    this.menu    = $('#navMenu');
    this.overlay = $('#navOverlay');
    this.links   = $$('.nav-link[data-section]');
    this.isOpen  = false;
  }

  init() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    this.toggle?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMenu();
    });

    this.overlay?.addEventListener('click', () => this.closeMenu());

    this.menu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => this.closeMenu());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.closeMenu();
    });

    window.addEventListener('scroll', () => this.updateActiveLink(), { passive: true });
  }

  onScroll() {
    if (window.scrollY > 60) {
      this.nav?.classList.add('scrolled');
    } else {
      this.nav?.classList.remove('scrolled');
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menu?.classList.toggle('open', this.isOpen);
    this.toggle?.classList.toggle('active', this.isOpen);
    this.overlay?.classList.toggle('visible', this.isOpen);
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isOpen = false;
    this.menu?.classList.remove('open');
    this.toggle?.classList.remove('active');
    this.overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  updateActiveLink() {
    const scrollY = window.scrollY + 100;
    this.links.forEach(link => {
      const section = link.dataset.section;
      if (!section) return;
      const el = $(`#${section}`);
      if (!el) return;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        this.links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
}

// ── Hero Slider ─────────────────────────────────────
class HeroSlider {
  constructor() {
    this.slides = $$('.hero-slide');
    this.current = 0;
  }

  init() {
    if (this.slides.length === 0) return;
    this.slides[0].classList.add('active');
    setInterval(() => this.nextSlide(), 7000);
  }

  nextSlide() {
    this.slides[this.current].classList.remove('active');
    this.current = (this.current + 1) % this.slides.length;
    this.slides[this.current].classList.add('active');
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
          const targetWidth = el.dataset.targetWidth || el.style.width;
          el.style.width = '0';
          requestAnimationFrame(() => {
            el.style.transition = 'width 1.2s ease-out';
            el.style.width = targetWidth;
          });
          this.observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
  }

  init() {
    this.bars.forEach(bar => {
      bar.dataset.targetWidth = bar.style.width;
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
    if (btn) btn.disabled = true;
    if (btnSpan) btnSpan.textContent = 'Invio in corso...';
    this.successMsg?.classList.remove('visible');
    this.errorMsg?.classList.remove('visible');

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        body: new FormData(this.form),
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
      if (btn) btn.disabled = false;
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
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
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
      if (data.about?.title && /\d+\s*anni/i.test(data.about.title)) {
        data.about.title = 'Chi Siamo';
      }
      if (data.about?.lead && /dal\s+20\d\d/i.test(data.about.lead)) {
        data.about.lead = 'Lion Group \u00e8 un gruppo imprenditoriale multisettoriale fondato da professionisti di alto profilo nel mondo del business, della finanza e dell\'automotive di lusso.';
      }
      this.apply(data);
    } catch (e) {}
  }

  apply(data) {
    if (data.hero) {
      const h = data.hero;
      this.setText('[data-cms="hero-subtitle"]', h.subtitle);
      const lines = document.querySelectorAll('.title-reveal');
      if (lines[0] && h.title1) lines[0].textContent = h.title1;
      if (lines[1] && h.title2) lines[1].textContent = h.title2;
    }
    if (data.section?.services) {
      const ss = data.section.services;
      this.setText('[data-cms="services-label"]', ss.label);
      this.setText('[data-cms="services-title"]', ss.title);
      this.setText('[data-cms="services-desc"]',  ss.desc);
    }
    if (data.services) {
      data.services.forEach((s, i) => {
        this.setText(`[data-cms="service-title-${i}"]`, s.title);
        this.setText(`[data-cms="service-desc-${i}"]`,  s.desc);
      });
    }
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
    if (data.contact) {
      const c = data.contact;
      this.setText('[data-cms="contact-label"]', c.label);
      this.setText('[data-cms="contact-title"]', c.sectionTitle);
      this.setText('[data-cms="contact-desc"]',  c.sectionDesc);
      const infoItems = document.querySelectorAll('.contact-info-item p');
      if (infoItems[0] && c.address) infoItems[0].innerHTML = c.address.replace(/\n/g, '<br>');
      if (infoItems[1] && c.email)   infoItems[1].textContent = c.email;
    }
    if (data.footer) {
      const f = data.footer;
      this.setText('[data-cms="footer-tagline"]',   f.tagline);
      this.setText('[data-cms="footer-desc"]',      f.desc);
      this.setText('[data-cms="footer-copyright"]', f.copyright);
    }
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

// ── App Entry Point ────────────────────────────────
class LionGroupApp {
  constructor() {
    this.modules = [
      new PageLoader(),
      new Navbar(),
      new HeroSlider(),
      new InvestmentBars(),
      new ContactForm(),
      new SmoothScroll(),
      new ContentManager(),
    ];
  }

  init() {
    this.modules.forEach(mod => mod.init());
  }
}

const app = new LionGroupApp();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
