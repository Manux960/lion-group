/**
 * Lion Group — Admin Panel JavaScript
 * CMS basato su localStorage per sito statico
 */

'use strict';

const CMS_KEY = 'liongroup_cms';

// ── Default Content ──────────────────────────────────
const DEFAULT_CONTENT = {
  hero: {
    eyebrow:  'LION GROUP',
    title1:   'EXCELLENCE',
    title2:   'BEYOND',
    title3:   'LIMITS.',
    subtitle: 'Il gruppo che definisce il lusso, la mobilità d\'élite e l\'investimento visionario.',
    image:    'assets/images/hero-bg.jpg',
    cta1:     'Scopri i Servizi',
    cta2:     'Contattaci',
  },
  section: {
    services: {
      label: 'COSA FACCIAMO',
      title: 'Un Universo di Servizi',
      desc:  'Lion Group unisce passione automobilistica, visione finanziaria e un approccio senza compromessi alla qualità.',
    },
  },
  services: [
    { title: 'Automotive',      desc: 'Un universo di eccellenza su quattro ruote. Dalla supercar al SUV premium, Lion Group gestisce ogni aspetto della mobilità di lusso con la massima competenza e cura.' },
    { title: 'E-Commerce',      desc: 'Marketplace premium di nuova generazione. Una piattaforma esclusiva che seleziona e distribuisce prodotti d\'eccellenza in ogni categoria, con standard qualitativi senza compromessi.' },
    { title: 'Investment Fund', desc: 'Fondo di investimento strategico dedicato a startup ad alto potenziale e private equity. Un approccio visionario per far crescere il capitale con rigore analitico e reti internazionali.' },
    { title: 'Real Estate',     desc: 'Portfolio immobiliare d\'élite in location strategiche nazionali e internazionali. Selezione rigorosa di asset residenziali e commerciali ad alto rendimento e valore intrinseco.' },
  ],
  pillars: [
    { title: 'Automotive',               desc: 'Mobilità d\'élite, cura tecnica certificata e una selezione esclusiva che trasforma ogni viaggio in un\'esperienza unica.',                                    img: 'https://images.pexels.com/photos/6166025/pexels-photo-6166025.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { title: 'Investimenti & Real Estate', desc: 'Capital allocation strategico su startup innovative e asset immobiliari di pregio. Rendimenti concreti, visione a lungo termine.',                              img: 'https://images.pexels.com/photos/29453302/pexels-photo-29453302.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { title: 'Commerce & Digital',        desc: 'Un marketplace premium che ridefinisce lo shopping online. Prodotti selezionati, logistica impeccabile, esperienza cliente al centro.',                        img: 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  ],
  investments: {
    label:       'INVESTIMENTI',
    title:       'Fai Crescere il Tuo Patrimonio',
    desc:        'Lion Group gestisce un fondo di investimento dedicato a startup ad alto potenziale e asset immobiliari premium. Il nostro approccio combina rigore analitico, visione strategica e una rete di partner internazionali.',
    feat0title:  'Startup Fund',
    feat0desc:   'Investiamo in startup tecnologiche e innovative nelle fasi seed e Series A.',
    feat1title:  'Real Estate Premium',
    feat1desc:   'Portfolio immobiliare selezionato in location strategiche ad alto rendimento.',
    feat2title:  'ROI Strategico',
    feat2desc:   'Rendimenti competitivi con gestione del rischio e trasparenza totale.',
    startupNum:  '12',
    startupLabel:'Startup nel Portfolio',
    startupMeta: '+72% performance media',
    reNum:       '28',
    reLabel:     'Proprietà Gestite',
    reMeta:      '+18% yield annuo medio',
    image:       'https://images.pexels.com/photos/29453302/pexels-photo-29453302.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  about: {
    label:       'CHI SIAMO',
    title:       'Chi Siamo',
    lead:        'Lion Group è un gruppo imprenditoriale multisettoriale fondato da professionisti di alto profilo nel mondo del business, della finanza e dell\'automotive di lusso.',
    body:        'La nostra missione è affiancare persone e aziende in ogni fase del loro percorso: che si tratti di investire nel mercato immobiliare, entrare nel capitale di una startup innovativa, accedere a un marketplace premium o muoversi nel mondo dell\'automotive d\'élite.\n\nDietro ogni divisione di Lion Group c\'è un team di esperti selezionati — consulenti finanziari, analisti di mercato, professionisti dell\'automotive e specialisti del digitale — che lavorano con un unico obiettivo: generare valore concreto per i nostri clienti, con trasparenza, competenza e visione strategica.',
    quoteText:   'Il vero lusso è avere qualcuno di fiducia al tuo fianco.',
    quoteAuthor: '— Lion Group',
    imgBg:       'https://images.pexels.com/photos/6752179/pexels-photo-6752179.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  contact: {
    label:        'CONTATTI',
    sectionTitle: 'Inizia la Tua Esperienza Lion',
    sectionDesc:  'Che tu voglia acquistare, noleggiare, investire o semplicemente conoscerci, siamo qui per te.',
    address:      'Via Merulana 247, Roma, Italia',
    email:        'info@liongroupsrl.it',
  },
  social: {
    instagram: '#',
    linkedin:  '#',
    facebook:  '#',
    youtube:   '#',
  },
  footer: {
    tagline:   'Excellence Beyond Limits.',
    desc:      'Il gruppo italiano che unisce automotive di lusso, investimenti strategici e servizi premium sotto un unico tetto.',
    copyright: '© 2025 Lion Group S.r.l. — Tutti i diritti riservati',
    auto1: 'Vendita Auto Premium',
    auto2: 'Noleggio a Breve Termine',
    auto3: 'Noleggio a Lungo Termine',
    auto4: 'Permuta Veicoli',
    auto5: 'Finanziamento Auto',
    inv1:  'Startup Fund',
    inv2:  'Real Estate',
    inv3:  'Portfolio',
    inv4:  'Advisory',
  },
  site: {
    name:     'Lion Group',
    tagline:  'Excellence Beyond Limits.',
    metaDesc: 'Lion Group: automotive di lusso, investimenti e real estate.',
  },
};

// ── CMS Store ─────────────────────────────────────────
class CMSStore {
  load() {
    try {
      const raw = localStorage.getItem(CMS_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
      return this._deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONTENT)), JSON.parse(raw));
    } catch {
      return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    }
  }

  save(data) {
    localStorage.setItem(CMS_KEY, JSON.stringify(data));
  }

  reset() {
    localStorage.removeItem(CMS_KEY);
    return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  }

  _deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        this._deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }
}

// ── Admin App ─────────────────────────────────────────
class AdminApp {
  constructor() {
    this.store    = new CMSStore();
    this.data     = this.store.load();
    this.password = localStorage.getItem('lg_admin_pass') || 'liongroup2025';
  }

  init() {
    this.setupSidebar();
    this.setupNavigation();
    this.populateForms();
    this.buildDynamicSections();
    this.setupSaveButtons();
    this.setupImagePreviews();
    this.setupSettings();
  }

  // ── Sidebar ──────────────────────────────────────────
  setupSidebar() {
    const toggle      = document.getElementById('sidebarToggle');
    const sidebar     = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    toggle?.addEventListener('click', () => {
      const isCollapsed = sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded', isCollapsed);

      if (window.innerWidth <= 900) {
        sidebar.classList.remove('collapsed');
        sidebar.classList.toggle('open');
        mainContent.classList.remove('expanded');
      }
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      sessionStorage.removeItem('lg_admin_auth');
      window.location.href = 'index.html';
    });
  }

  // ── Navigation ───────────────────────────────────────
  setupNavigation() {
    const links      = document.querySelectorAll('.sidebar-link[data-panel]');
    const breadcrumb = document.getElementById('breadcrumbActive');

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const panelId = link.dataset.panel;

        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`panel-${panelId}`)?.classList.add('active');

        if (breadcrumb) {
          breadcrumb.textContent = link.querySelector('svg').nextSibling.textContent.trim();
        }

        if (window.innerWidth <= 900) {
          document.getElementById('sidebar').classList.remove('open');
        }
      });
    });
  }

  // ── Populate Forms ───────────────────────────────────
  populateForms() {
    document.querySelectorAll('[data-field]').forEach(el => {
      const key = el.dataset.field;
      const val = this._get(this.data, key);
      if (val !== undefined) el.value = val;
    });
  }

  // ── Build Dynamic Sections ───────────────────────────
  buildDynamicSections() {
    this.buildServicesEditor();
    this.buildPillarsEditor();
  }

  buildServicesEditor() {
    const container = document.getElementById('servicesCards');
    if (!container) return;

    container.innerHTML = `<div class="services-cards-grid">${this.data.services.map((s, i) => `
      <div class="service-editor-card">
        <div class="card-title">Servizio ${i + 1} — ${s.title}</div>
        <div class="field-group">
          <label>Titolo</label>
          <input type="text" data-srv-field="${i}.title" value="${s.title}" />
        </div>
        <div class="field-group">
          <label>Descrizione</label>
          <textarea rows="3" data-srv-field="${i}.desc">${s.desc}</textarea>
        </div>
      </div>
    `).join('')}</div>`;
  }

  buildPillarsEditor() {
    const container = document.getElementById('pillarsEditor');
    if (!container) return;

    const pillars = this.data.pillars || DEFAULT_CONTENT.pillars;
    container.innerHTML = `<div class="services-cards-grid">${pillars.map((p, i) => `
      <div class="service-editor-card">
        <div class="card-title">Pillar ${i + 1} — ${p.title}</div>
        <div class="field-group">
          <label>Titolo</label>
          <input type="text" data-pillar-field="${i}.title" value="${p.title}" />
        </div>
        <div class="field-group">
          <label>Descrizione</label>
          <textarea rows="3" data-pillar-field="${i}.desc">${p.desc}</textarea>
        </div>
        <div class="field-group">
          <label>URL Immagine</label>
          <input type="url" data-pillar-field="${i}.img" value="${p.img}" />
        </div>
        <div class="img-preview" style="margin-top:8px;">
          <img src="${p.img}" alt="Pillar ${i + 1}" style="max-height:80px;width:100%;object-fit:cover;border-radius:4px;" />
        </div>
      </div>
    `).join('')}</div>`;
  }

  // ── Save Buttons ─────────────────────────────────────
  setupSaveButtons() {
    document.querySelectorAll('.btn-save[data-section]').forEach(btn => {
      btn.addEventListener('click', () => this.saveSection(btn.dataset.section));
    });

    document.querySelectorAll('.btn-reset[data-section]').forEach(btn => {
      btn.addEventListener('click', () => this.resetSection(btn.dataset.section));
    });
  }

  saveSection(section) {
    // Collect all data-field inputs
    document.querySelectorAll('[data-field]').forEach(el => {
      this._set(this.data, el.dataset.field, el.value);
    });

    // Collect service fields
    document.querySelectorAll('[data-srv-field]').forEach(el => {
      const [idx, key] = el.dataset.srvField.split('.');
      if (this.data.services[idx]) {
        this.data.services[idx][key] = el.value;
      }
    });

    // Collect pillar fields
    document.querySelectorAll('[data-pillar-field]').forEach(el => {
      const parts = el.dataset.pillarField.split('.');
      const idx = parts[0];
      const key = parts[1];
      if (!this.data.pillars) this.data.pillars = [];
      if (!this.data.pillars[idx]) this.data.pillars[idx] = {};
      this.data.pillars[idx][key] = el.value;
    });

    this.store.save(this.data);
    this.showSaveIndicator();
    this.buildDynamicSections();
  }

  resetSection(section) {
    if (!confirm(`Ripristinare i valori default per "${section}"? I tuoi dati verranno persi.`)) return;

    if (section === 'hero') this.data.hero = { ...DEFAULT_CONTENT.hero };

    this.store.save(this.data);
    this.populateForms();
    this.buildDynamicSections();
    this.showSaveIndicator();
  }

  // ── Image Previews ────────────────────────────────────
  setupImagePreviews() {
    // Hero image preview
    const heroInput = document.querySelector('[data-field="hero.image"]');
    const heroPreview = document.getElementById('heroImgPreviewImg');
    if (heroInput && heroPreview) {
      heroInput.addEventListener('input', () => {
        const url = heroInput.value.trim();
        if (url) heroPreview.src = url;
      });
    }

    // About bg image preview
    const aboutInput = document.querySelector('[data-field="about.imgBg"]');
    const aboutPreview = document.getElementById('aboutImgPreviewImg');
    if (aboutInput && aboutPreview) {
      aboutInput.addEventListener('input', () => {
        const url = aboutInput.value.trim();
        if (url) aboutPreview.src = url;
      });
    }

    // Investments image preview
    const investInput = document.querySelector('[data-field="investments.image"]');
    const investPreview = document.getElementById('investImgPreviewImg');
    if (investInput && investPreview) {
      investInput.addEventListener('input', () => {
        const url = investInput.value.trim();
        if (url) investPreview.src = url;
      });
    }
  }

  // ── Settings ──────────────────────────────────────────
  setupSettings() {
    // Change password
    document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
      const newPass  = document.getElementById('newPassword')?.value;
      const confirm  = document.getElementById('confirmPassword')?.value;
      const msg      = document.getElementById('passwordMsg');

      if (!newPass || newPass.length < 6) {
        msg.textContent = 'La password deve essere di almeno 6 caratteri.';
        msg.className   = 'password-msg error';
        return;
      }
      if (newPass !== confirm) {
        msg.textContent = 'Le password non coincidono.';
        msg.className   = 'password-msg error';
        return;
      }

      localStorage.setItem('lg_admin_pass', newPass);
      this.password = newPass;
      msg.textContent = 'Password aggiornata con successo!';
      msg.className   = 'password-msg success';
      document.getElementById('newPassword').value    = '';
      document.getElementById('confirmPassword').value = '';
      setTimeout(() => { msg.textContent = ''; }, 3000);
    });

    // Export JSON
    document.getElementById('exportBtn')?.addEventListener('click', () => {
      const json = JSON.stringify(this.data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'liongroup-cms-export.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    // Reset all
    document.getElementById('resetAllBtn')?.addEventListener('click', () => {
      if (!confirm('ATTENZIONE: Questa azione resetterà TUTTI i contenuti ai valori default. Continuare?')) return;
      this.data = this.store.reset();
      this.populateForms();
      this.buildDynamicSections();
      this.showSaveIndicator();
    });
  }

  // ── Show Save Indicator ───────────────────────────────
  showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    if (!indicator) return;
    indicator.classList.remove('visible');
    void indicator.offsetWidth;
    indicator.classList.add('visible');
    indicator.style.animation = 'none';
    void indicator.offsetWidth;
    indicator.style.animation = '';
    setTimeout(() => indicator.classList.remove('visible'), 3200);
  }

  // ── Helpers ───────────────────────────────────────────
  _get(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }

  _set(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
}

// ── Boot ──────────────────────────────────────────────
const admin = new AdminApp();
admin.init();
