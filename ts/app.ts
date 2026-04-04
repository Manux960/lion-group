/**
 * Lion Group — Main Application TypeScript
 * Version 1.0.0
 */

// ── Types ──────────────────────────────────────────
interface MousePosition {
  x: number;
  y: number;
}

interface SliderState {
  currentIndex: number;
  cardWidth: number;
  totalCards: number;
  gap: number;
  isDragging: boolean;
  startX: number;
  scrollLeft: number;
}

// ── Utility ────────────────────────────────────────
const $ = <T extends HTMLElement>(selector: string): T | null =>
  document.querySelector<T>(selector);

const $$ = <T extends HTMLElement>(selector: string): NodeListOf<T> =>
  document.querySelectorAll<T>(selector);

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

// ── Page Loader ────────────────────────────────────
class PageLoader {
  private loader: HTMLElement | null;
  private body: HTMLElement;

  constructor() {
    this.loader = $('#pageLoader');
    this.body = document.body;
  }

  init(): void {
    // Simulate loading + ensure fonts loaded
    const minDuration = 2200;
    const startTime = Date.now();

    const hide = (): void => {
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
  private dot: HTMLElement | null;
  private ring: HTMLElement | null;
  private pos: MousePosition = { x: 0, y: 0 };
  private ringPos: MousePosition = { x: 0, y: 0 };
  private raf: number = 0;

  constructor() {
    this.dot  = $('#cursorDot');
    this.ring = $('#cursorRing');
  }

  init(): void {
    if (!this.dot || !this.ring) return;

    document.addEventListener('mousemove', (e: MouseEvent) => {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    });

    document.addEventListener('mouseenter', () => {
      this.dot!.style.opacity = '1';
      this.ring!.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      this.dot!.style.opacity = '0';
      this.ring!.style.opacity = '0';
    });

    // Hover state on interactive elements
    const hoverTargets = $$<HTMLElement>('a, button, [data-cursor-hover]');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => this.ring?.classList.add('hovered'));
      el.addEventListener('mouseleave', () => this.ring?.classList.remove('hovered'));
    });

    this.animate();
  }

  private animate(): void {
    // Dot: instant follow
    if (this.dot) {
      this.dot.style.left = `${this.pos.x}px`;
      this.dot.style.top  = `${this.pos.y}px`;
    }

    // Ring: smooth follow with lerp
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
  private nav: HTMLElement | null;
  private toggle: HTMLElement | null;
  private menu: HTMLElement | null;
  private links: NodeListOf<HTMLElement>;
  private lastScroll: number = 0;

  constructor() {
    this.nav    = $('#navbar');
    this.toggle = $('#navToggle');
    this.menu   = $('#navMenu');
    this.links  = $$<HTMLElement>('.nav-link[data-section]');
  }

  init(): void {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    this.toggle?.addEventListener('click', () => this.toggleMenu());

    // Close menu on link click
    this.menu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => this.closeMenu());
    });

    // Active link on scroll
    window.addEventListener('scroll', () => this.updateActiveLink(), { passive: true });
  }

  private onScroll(): void {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      this.nav?.classList.add('scrolled');
    } else {
      this.nav?.classList.remove('scrolled');
    }

    this.lastScroll = scrollY;
  }

  private toggleMenu(): void {
    const isOpen = this.menu?.classList.toggle('open');
    this.toggle?.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  private closeMenu(): void {
    this.menu?.classList.remove('open');
    this.toggle?.classList.remove('active');
    document.body.style.overflow = '';
  }

  private updateActiveLink(): void {
    const scrollY = window.scrollY + 100;

    this.links.forEach(link => {
      const section = link.dataset['section'];
      if (!section) return;

      const el = $<HTMLElement>(`#${section}`);
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
  private observer: IntersectionObserver;
  private elements: NodeListOf<HTMLElement>;

  constructor() {
    this.elements = $$<HTMLElement>('.reveal-up, .reveal-left, .reveal-right');

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset['delay'] ?? '0', 10);

          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);

          this.observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
  }

  init(): void {
    this.elements.forEach(el => this.observer.observe(el));
  }
}

// ── Counter Animation ──────────────────────────────
class CounterAnimation {
  private counters: NodeListOf<HTMLElement>;
  private observer: IntersectionObserver;

  constructor() {
    this.counters = $$<HTMLElement>('.stat-counter, .stat-num');

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          this.animateCounter(entry.target as HTMLElement);
          this.observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
  }

  init(): void {
    this.counters.forEach(el => this.observer.observe(el));
  }

  private animateCounter(el: HTMLElement): void {
    const target = parseInt(el.dataset['target'] ?? '0', 10);
    const suffix = el.dataset['suffix'] ?? '';
    const duration = 2000;
    const fps = 60;
    const frames = duration / (1000 / fps);
    const increment = target / frames;

    let current = 0;
    let frame = 0;

    const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

    const update = (): void => {
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
  private track: HTMLElement | null;
  private cards: NodeListOf<HTMLElement>;
  private prevBtn: HTMLElement | null;
  private nextBtn: HTMLElement | null;
  private dotsContainer: HTMLElement | null;
  private state: SliderState;
  private dots: HTMLElement[] = [];

  constructor() {
    this.track          = $('#carsTrack');
    this.cards          = $$<HTMLElement>('.car-card');
    this.prevBtn        = $('#sliderPrev');
    this.nextBtn        = $('#sliderNext');
    this.dotsContainer  = $('#sliderDots');

    this.state = {
      currentIndex: 0,
      cardWidth:    0,
      totalCards:   this.cards.length,
      gap:          24,
      isDragging:   false,
      startX:       0,
      scrollLeft:   0,
    };
  }

  init(): void {
    if (!this.track || !this.cards.length) return;

    this.buildDots();
    this.updateDimensions();
    this.bindEvents();

    window.addEventListener('resize', () => this.updateDimensions(), { passive: true });
  }

  private buildDots(): void {
    if (!this.dotsContainer) return;

    for (let i = 0; i < this.state.totalCards; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
    }
  }

  private updateDimensions(): void {
    if (this.cards.length === 0) return;
    const firstCard = this.cards[0] as HTMLElement;
    this.state.cardWidth = firstCard.offsetWidth;
  }

  private bindEvents(): void {
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    // Drag / swipe
    if (this.track) {
      this.track.addEventListener('mousedown',  (e: MouseEvent)  => this.dragStart(e.pageX));
      this.track.addEventListener('mousemove',  (e: MouseEvent)  => this.dragMove(e.pageX));
      this.track.addEventListener('mouseup',    ()               => this.dragEnd());
      this.track.addEventListener('mouseleave', ()               => this.dragEnd());

      this.track.addEventListener('touchstart', (e: TouchEvent)  => this.dragStart(e.touches[0].pageX), { passive: true });
      this.track.addEventListener('touchmove',  (e: TouchEvent)  => this.dragMove(e.touches[0].pageX),  { passive: true });
      this.track.addEventListener('touchend',   ()               => this.dragEnd());
    }

    // Keyboard
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  private dragStart(x: number): void {
    this.state.isDragging   = true;
    this.state.startX       = x;
  }

  private dragMove(x: number): void {
    if (!this.state.isDragging) return;
    const delta = x - this.state.startX;

    if (Math.abs(delta) > 8) {
      // Provide live drag feedback
      if (this.track) {
        const baseOffset = -(this.state.currentIndex * (this.state.cardWidth + this.state.gap));
        this.track.style.transform = `translateX(${baseOffset + delta}px)`;
        this.track.style.transition = 'none';
      }
    }
  }

  private dragEnd(): void {
    if (!this.state.isDragging) return;
    this.state.isDragging = false;

    if (this.track) {
      this.track.style.transition = '';
    }

    // Reset: goTo current (snaps back smooth)
    this.goTo(this.state.currentIndex);
  }

  goTo(index: number): void {
    const maxIndex = this.state.totalCards - this.visibleCount();
    this.state.currentIndex = clamp(index, 0, Math.max(0, maxIndex));

    const offset = -(this.state.currentIndex * (this.state.cardWidth + this.state.gap));
    if (this.track) {
      this.track.style.transform = `translateX(${offset}px)`;
    }

    this.updateDots();
  }

  private visibleCount(): number {
    const sliderWidth = this.track?.parentElement?.offsetWidth ?? 0;
    if (!this.state.cardWidth) return 1;
    return Math.floor(sliderWidth / (this.state.cardWidth + this.state.gap)) || 1;
  }

  prev(): void {
    this.goTo(this.state.currentIndex - 1);
  }

  next(): void {
    const maxIndex = this.state.totalCards - this.visibleCount();
    if (this.state.currentIndex >= Math.max(0, maxIndex)) {
      this.goTo(0); // loop
    } else {
      this.goTo(this.state.currentIndex + 1);
    }
  }

  private updateDots(): void {
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.state.currentIndex);
    });
  }
}

// ── Parallax Hero ──────────────────────────────────
class HeroParallax {
  private heroImg: HTMLElement | null;

  constructor() {
    this.heroImg = $('#heroImg');
  }

  init(): void {
    if (!this.heroImg) return;
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  }

  private onScroll(): void {
    const scrollY = window.scrollY;
    const rate    = scrollY * 0.3;
    if (this.heroImg) {
      this.heroImg.style.transform = `scale(1) translateY(${rate}px)`;
    }
  }
}

// ── Investment Bar Animation ───────────────────────
class InvestmentBars {
  private observer: IntersectionObserver;
  private bars: NodeListOf<HTMLElement>;

  constructor() {
    this.bars = $$<HTMLElement>('.invest-bar-fill');

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const width = el.style.width;
          el.style.width = '0';
          // Trigger reflow
          void el.offsetWidth;
          el.style.width = width;
          this.observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
  }

  init(): void {
    this.bars.forEach(bar => {
      const targetWidth = bar.style.width;
      bar.style.width = '0';
      this.observer.observe(bar);
    });
  }
}

// ── Contact Form ───────────────────────────────────
class ContactForm {
  private form: HTMLFormElement | null;
  private successMsg: HTMLElement | null;

  constructor() {
    this.form       = $('#contactForm') as HTMLFormElement | null;
    this.successMsg = $('#formSuccess');
  }

  init(): void {
    this.form?.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  private handleSubmit(): void {
    // In production: send to API endpoint
    // Here: simulate success response
    const btn = this.form?.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Invio in corso...</span>';
    }

    setTimeout(() => {
      this.form?.reset();
      this.successMsg?.classList.add('visible');

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Invia Messaggio</span><svg viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }

      setTimeout(() => {
        this.successMsg?.classList.remove('visible');
      }, 5000);
    }, 1400);
  }
}

// ── Smooth Scroll ──────────────────────────────────
class SmoothScroll {
  init(): void {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        const href   = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        const navHeight = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
}

// ── App Entry Point ────────────────────────────────
class LionGroupApp {
  private modules: Array<{ init: () => void }>;

  constructor() {
    this.modules = [
      new PageLoader(),
      new CustomCursor(),
      new Navbar(),
      new ScrollReveal(),
      new CounterAnimation(),
      new CarSlider(),
      new HeroParallax(),
      new InvestmentBars(),
      new ContactForm(),
      new SmoothScroll(),
    ];
  }

  init(): void {
    this.modules.forEach(mod => mod.init());
    console.log('%c🦁 LION GROUP — Excellence Beyond Limits', 'font-size:14px;color:#c9a96e;font-weight:bold;');
  }
}

// Boot
const app = new LionGroupApp();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
