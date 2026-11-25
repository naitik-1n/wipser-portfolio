/**
 * ==========================================================================
 * NAITIK KUMAR PRADHAN — SOFTWARE ENGINEERING APPLICATION ENGINE
 * Living Architectural Editorial Interface
 * Features:
 * 1. Background Konark Dial: Smooth inertia rotation physics synced to scroll
 *    with scroll-velocity momentum, harmonic idle celestial breathing, and spoke pulse.
 * 2. Astronomical 24-Spoke Telemetry: Real-time solar phase & spoke index readout.
 * 3. Living Celestial Dust Canvas: Multi-layer cosmic particle depth with scroll parallax.
 * 4. Dynamic Reading Progress Line & Gliding Nav Indicator Capsule.
 * 5. GSAP ScrollTrigger Sequences: Staggered 3D card reveals, animated metric counters,
 *    and interactive 3D mouse tilt with glass reflection sheen.
 * 6. Telemetry & Contact: 1-click email copy, form handler, and real-time IST clock.
 * ==========================================================================
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentRotation: 0,
    targetRotation: 0,
    rotationMode: 'scroll', // 'scroll' | 'still'
    activeSection: 'about',
    lastScrollY: 0,
    scrollVelocity: 0,
    lastSpokeIndex: 0
  };

  // DOM Elements Cache
  const DOM = {
    backgroundChakraZone: document.getElementById('backgroundChakraZone'),
    chakraRotator: document.getElementById('chakraRotator'),
    spokeTracker: document.getElementById('chakraSpokeTracker'),
    modeScrollBtn: document.getElementById('modeScrollBtn'),
    modeStillBtn: document.getElementById('modeStillBtn'),
    copyEmailBtn: document.getElementById('copyEmailCard'),
    copyEmailVal: document.getElementById('copyEmailVal'),
    toastNotice: document.getElementById('toastNotice'),
    toastMessage: document.getElementById('toastMessage'),
    localClock: document.getElementById('liveClockDisplay'),
    navLinks: document.querySelectorAll('.nav-link-item a'),
    navTrackerBar: document.querySelector('.nav-tracker-bar'),
    scrollProgressLine: document.getElementById('scrollProgressLine'),
    navPillIndicator: document.getElementById('navPillIndicator'),
    celestialDustCanvas: document.getElementById('celestialDustCanvas'),
    contactForm: document.getElementById('inquiryForm'),
    formStatus: document.getElementById('formStatusMsg')
  };

  // 24 Solar Spoke Phases of the Konark Sun Temple Chariot
  const SPOKE_CYCLE_NAMES = [
    "Prathama", "Dvitiya", "Tritiya", "Chaturthi",
    "Panchami", "Shashthi", "Saptami", "Ashtami",
    "Navami", "Dashami", "Ekadashi", "Dvadashi",
    "Trayodashi", "Chaturdashi", "Purnima", "Pratipada",
    "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Amavasya"
  ];

  /* --------------------------------------------------------------------------
     1. SCROLL-SYNCED KONARK ASTRONOMICAL DIAL ENGINE (Fluid Physics)
     -------------------------------------------------------------------------- */
  function initScrollWheelEngine() {
    const rotator = DOM.chakraRotator || document.getElementById('chakraRotator');
    if (!rotator) return;

    // Mode Toggle
    function setRotationMode(mode) {
      state.rotationMode = mode;
      if (DOM.modeScrollBtn && DOM.modeStillBtn) {
        if (mode === 'scroll') {
          DOM.modeScrollBtn.classList.add('active');
          DOM.modeStillBtn.classList.remove('active');
          showToast('Dial synchronized with scroll');
        } else {
          DOM.modeStillBtn.classList.add('active');
          DOM.modeScrollBtn.classList.remove('active');
          showToast('Dial locked in static position');
        }
      }
    }

    if (DOM.modeScrollBtn) DOM.modeScrollBtn.addEventListener('click', () => setRotationMode('scroll'));
    if (DOM.modeStillBtn) DOM.modeStillBtn.addEventListener('click', () => setRotationMode('still'));

    // Scroll tracking: calculate rotation target and velocity
    function onPageScroll() {
      const scrollY = window.scrollY;
      const delta = scrollY - state.lastScrollY;
      state.scrollVelocity = delta;
      state.lastScrollY = scrollY;

      if (state.rotationMode === 'scroll') {
        state.targetRotation = scrollY * 0.28;
      }

      updateScrollProgress();
      updateActiveNavSection();
    }
    window.addEventListener('scroll', onPageScroll, { passive: true });

    // Smooth RAF physics loop: rock-solid concentric rotation, zero wobble + rolling flare
    function renderLoop() {
      if (state.rotationMode === 'scroll') {
        const diff = state.targetRotation - state.currentRotation;
        // Smooth ease interpolation
        state.currentRotation += diff * 0.08;

        if (rotator) {
          // Strictly rotate around exact center (400, 400) with zero scaling or wobble
          rotator.setAttribute(
            'transform',
            `rotate(${state.currentRotation.toFixed(2)} 400 400)`
          );
        }

        // Toggle rolling solar flare effect based on scroll velocity
        if (DOM.backgroundChakraZone) {
          if (Math.abs(diff) > 0.35) {
            DOM.backgroundChakraZone.classList.add('is-rolling');
          } else {
            DOM.backgroundChakraZone.classList.remove('is-rolling');
          }
        }

        updateSpokeIndicator(state.currentRotation);
      } else {
        // Static mode: fixed position around center (400, 400)
        if (rotator) {
          rotator.setAttribute('transform', 'rotate(0 400 400)');
        }
        if (DOM.backgroundChakraZone) {
          DOM.backgroundChakraZone.classList.remove('is-rolling');
        }
      }

      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);

    // Initial trigger
    onPageScroll();
  }

  function calculateCurrentSpokeIndex(angle) {
    const normalized = ((angle % 360) + 360) % 360;
    return Math.floor(normalized / 15) % 24;
  }

  function updateSpokeIndicator(angle) {
    if (!DOM.spokeTracker) return;
    const spokeIdx = calculateCurrentSpokeIndex(angle);
    const spokeNum = String(spokeIdx + 1).padStart(2, '0');
    const phaseName = SPOKE_CYCLE_NAMES[spokeIdx] || 'Solar Phase';

    // Trigger subtle pulse animation on spoke change
    if (state.lastSpokeIndex !== spokeIdx) {
      state.lastSpokeIndex = spokeIdx;
      DOM.spokeTracker.classList.remove('tick-pulse');
      // trigger reflow
      void DOM.spokeTracker.offsetWidth;
      DOM.spokeTracker.classList.add('tick-pulse');
    }

    DOM.spokeTracker.textContent = `Solar dial: Spoke ${spokeNum} / 24 • ${phaseName}`;
  }

  /* --------------------------------------------------------------------------
     2. READING PROGRESS LINE & GLIDING ACTIVE NAV CAPSULE
     -------------------------------------------------------------------------- */
  function updateScrollProgress() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (DOM.scrollProgressLine) {
      DOM.scrollProgressLine.style.width = `${progress.toFixed(1)}%`;
    }

    if (DOM.navTrackerBar) {
      if (scrollY > 30) {
        DOM.navTrackerBar.classList.add('scrolled');
      } else {
        DOM.navTrackerBar.classList.remove('scrolled');
      }
    }
  }

  function updateActiveNavSection() {
    const sections = ['about', 'history', 'projects', 'hobbies', 'contact', 'chakra-defense'];
    const scrollPos = window.scrollY + 220;

    for (let i = sections.length - 1; i >= 0; i--) {
      const secEl = document.getElementById(sections[i]);
      if (secEl && secEl.offsetTop <= scrollPos) {
        if (state.activeSection !== sections[i]) {
          state.activeSection = sections[i];
          DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sections[i]}`) {
              link.classList.add('active');
              positionNavPillIndicator(link);
            } else {
              link.classList.remove('active');
            }
          });
        }
        break;
      }
    }
  }

  function positionNavPillIndicator(activeLink) {
    if (!DOM.navPillIndicator || !activeLink) return;
    const parent = activeLink.closest('.nav-links-list');
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const left = linkRect.left - parentRect.left;
    const top = linkRect.top - parentRect.top;
    const width = linkRect.width;
    const height = linkRect.height;

    DOM.navPillIndicator.style.transform = `translate(${left}px, ${top}px)`;
    DOM.navPillIndicator.style.width = `${width}px`;
    DOM.navPillIndicator.style.height = `${height}px`;
    DOM.navPillIndicator.style.opacity = '1';
  }

  // Smooth click scroll with pill glide
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          positionNavPillIndicator(link);
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. LIVING CELESTIAL DUST CANVAS (Scroll Parallax Particles)
     -------------------------------------------------------------------------- */
  function initCelestialDustCanvas() {
    const canvas = DOM.celestialDustCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    const PARTICLE_COUNT = 38;

    const colors = [
      'rgba(200, 66, 24, ',  // terracotta
      'rgba(234, 88, 12, ',  // warm orange
      'rgba(180, 160, 140, ', // warm bronze
      'rgba(245, 158, 11, '  // golden solar
    ];

    function resizeCanvas() {
      const parent = canvas.parentElement;
      width = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
      height = canvas.height = parent ? parent.offsetHeight : window.innerHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseY: Math.random() * height,
          radius: Math.random() * 2.2 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.45 + 0.15,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.2,
          parallaxFactor: Math.random() * 0.25 + 0.05,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    resizeCanvas();
    createParticles();

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);
      const scrollY = window.scrollY;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.phase += 0.02;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Apply gentle floating + scroll parallax
        const floatY = Math.sin(p.phase) * 8;
        const parallaxY = (scrollY * p.parallaxFactor) % height;
        let drawY = (p.baseY - parallaxY + floatY) % height;
        if (drawY < 0) drawY += height;

        // Draw soft radiant particle
        const currentAlpha = p.alpha * (0.8 + Math.sin(p.phase) * 0.2);
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + currentAlpha.toFixed(3) + ')';
        ctx.fill();
      }

      requestAnimationFrame(renderCanvas);
    }
    requestAnimationFrame(renderCanvas);
  }

  /* --------------------------------------------------------------------------
     4. EDITORIAL CONTENT POPULATION (DATA-DRIVEN)
     -------------------------------------------------------------------------- */
  function populatePortfolioContent() {
    if (typeof PORTFOLIO_DATA === 'undefined') return;
    const data = PORTFOLIO_DATA;

    // Sidebar Identity
    if (data.personal) {
      const nameEl = document.getElementById('identityName');
      const roleEl = document.getElementById('identityRole');
      const taglineEl = document.getElementById('identityTagline');
      const copyValEl = document.getElementById('copyEmailVal');

      if (nameEl) nameEl.textContent = data.personal.fullName || data.personal.name;
      if (roleEl) roleEl.textContent = data.personal.title;
      if (taglineEl) taglineEl.textContent = data.personal.roleTagline;
      if (copyValEl && data.personal.email) copyValEl.textContent = data.personal.email;
    }

    // Section 1: About (Narrative, Metrics, Skills)
    if (data.about) {
      const headlineEl = document.getElementById('narrativeHeadline');
      const bodyEl = document.getElementById('narrativeBody');
      const metricsEl = document.getElementById('metricsStrip');
      const skillsEl = document.getElementById('skillsEditorialGrid');

      if (headlineEl) headlineEl.textContent = data.about.headline;

      if (bodyEl && Array.isArray(data.about.paragraphs)) {
        bodyEl.innerHTML = data.about.paragraphs.map(p => `<p>${p}</p>`).join('');
      }

      if (metricsEl && Array.isArray(data.about.highlights)) {
        metricsEl.innerHTML = data.about.highlights.map(item => `
          <div class="metric-cell">
            <div class="metric-number" data-target="${item.metric}">${item.metric}</div>
            <div class="metric-label">${item.label}</div>
          </div>
        `).join('');
      }

      if (skillsEl && Array.isArray(data.about.skillsCategories)) {
        skillsEl.innerHTML = data.about.skillsCategories.map(cat => `
          <div class="skill-category-block">
            <h4 class="category-title">${cat.category}</h4>
            <div class="skill-text-list">
              ${cat.skills.map(s => `<span class="skill-tag-item">${s}</span>`).join('')}
            </div>
          </div>
        `).join('');
      }
    }

    // Section 2: History (Experience Timeline)
    if (Array.isArray(data.history)) {
      const historyEl = document.getElementById('historyStream');
      if (historyEl) {
        historyEl.innerHTML = data.history.map(epoch => `
          <article class="history-entry">
            <div class="history-period-col">
              <span class="history-period">${epoch.period}</span>
              <span class="history-location">${epoch.location}</span>
            </div>
            <div class="history-content-col">
              <h3 class="history-role">${epoch.role}</h3>
              <div class="history-company">${epoch.company}</div>
              <p class="history-desc">${epoch.description}</p>
              ${Array.isArray(epoch.achievements) ? `
                <ul class="history-bullets">
                  ${epoch.achievements.map(a => `<li>${a}</li>`).join('')}
                </ul>
              ` : ''}
              ${Array.isArray(epoch.tags) ? `
                <div class="history-tags">
                  ${epoch.tags.map(t => `<span class="history-tag">#${t}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          </article>
        `).join('');
      }
    }

    // Section 3: Projects (Case Studies)
    if (Array.isArray(data.projects)) {
      const projectsEl = document.getElementById('projectsStream');
      if (projectsEl) {
        projectsEl.innerHTML = data.projects.map((proj, idx) => `
          <article class="project-case-study" data-tilt="true">
            <div class="project-meta-row">
              <span class="project-index-tag">0${idx + 1}</span>
              <span class="project-category">${proj.category}</span>
            </div>
            <h3 class="project-title">${proj.title}</h3>
            <p class="project-desc">${proj.description}</p>
            ${proj.metrics ? `
              <div class="project-metrics-line">
                <span class="metrics-bullet">▪</span>
                <span>${proj.metrics}</span>
              </div>
            ` : ''}
            <div class="project-tech-strip">
              ${proj.tech.map(t => `<span class="project-tech-item">${t}</span>`).join('')}
            </div>
            <div class="project-actions-row">
              ${proj.githubUrl ? `
                <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="editorial-link">
                  <span>Source code</span>
                  <span>↗</span>
                </a>
              ` : ''}
              ${proj.demoUrl ? `
                <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="editorial-link">
                  <span>Demonstration</span>
                  <span>↗</span>
                </a>
              ` : ''}
            </div>
          </article>
        `).join('');
      }
    }

    // Section 4: Hobbies & Essays
    if (Array.isArray(data.hobbies)) {
      const hobbiesEl = document.getElementById('hobbiesGrid');
      if (hobbiesEl) {
        const hobbyIcons = [
          `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/></svg>`,
          `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
          `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4"/></svg>`
        ];

        hobbiesEl.innerHTML = data.hobbies.map((hobby, idx) => `
          <article class="hobby-article">
            <div class="hobby-glyph-accent">${hobbyIcons[idx] || hobbyIcons[0]}</div>
            <h3 class="hobby-title">${hobby.title}</h3>
            <div class="hobby-tagline">${hobby.tagline}</div>
            <p class="hobby-narrative">${hobby.narrative}</p>
            ${hobby.quote ? `
              <blockquote class="hobby-quote">"${hobby.quote}"</blockquote>
            ` : ''}
          </article>
        `).join('');
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. LOADING INTRO & GSAP SCROLLTRIGGER SEQUENCES
     -------------------------------------------------------------------------- */
  function initWheelIntro() {
    const chakraZone = DOM.backgroundChakraZone;
    const mainEl = document.getElementById('portfolio-main');
    const greetingsOverlay = document.getElementById('greetingsOverlay');
    if (!chakraZone || typeof gsap === 'undefined') {
      document.body.classList.remove('intro-active', 'greetings-active');
      return;
    }

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.body.classList.remove('intro-active', 'greetings-active');
      return;
    }

    document.body.classList.add('intro-active', 'greetings-active');

    // Start centered and smaller in loading state so it stays well inside the viewport
    gsap.set(chakraZone, {
      left: '70%',
      top: '100%',
      xPercent: -50,
      yPercent: -50,
      scale: 0.45,
      opacity: 0
    });

    const tl = gsap.timeline({
      onComplete: () => {
        showGreetingsOverlay(greetingsOverlay, chakraZone, mainEl);
      }
    });

    tl.to(chakraZone, {
      opacity: 1,
      scale: 0.54,
      duration: 0.65,
      ease: 'power2.out'
    })
      .to(state, {
        targetRotation: 45,
        duration: 0.75,
        ease: 'power2.inOut'
      }, '<');
  }

  function showGreetingsOverlay(greetingsOverlay, chakraZone, mainEl) {
    if (!greetingsOverlay) {
      document.body.classList.remove('intro-active', 'greetings-active');
      if (chakraZone) gsap.set(chakraZone, { clearProps: 'left,top,xPercent,yPercent,scale,opacity' });
      if (mainEl) gsap.to(mainEl, { opacity: 1, duration: 0.5 });
      return;
    }

    greetingsOverlay.classList.add('is-visible');
    greetingsOverlay.setAttribute('aria-hidden', 'false');
    gsap.fromTo(greetingsOverlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.55, ease: 'power2.out' }
    );

    let dismissed = false;
    function dismissGreetings(e) {
      if (dismissed) return;
      if (e && e.type === 'keydown' && e.code !== 'Space') return;
      if (e && e.type === 'keydown' && e.code === 'Space') {
        e.preventDefault();
      }
      dismissed = true;

      window.removeEventListener('click', dismissGreetings);
      window.removeEventListener('wheel', dismissGreetings);
      window.removeEventListener('touchstart', dismissGreetings);
      window.removeEventListener('keydown', dismissGreetings);

      const exitTl = gsap.timeline({
        onComplete: () => {
          greetingsOverlay.classList.remove('is-visible');
          greetingsOverlay.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('intro-active', 'greetings-active');
          if (chakraZone) {
            gsap.set(chakraZone, { clearProps: 'left,top,xPercent,yPercent,scale,opacity' });
          }
        }
      });

      exitTl.to(greetingsOverlay, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut'
      })
        .to(chakraZone, {
          left: '0%',
          xPercent: -50,
          yPercent: -50,
          scale: 1,
          duration: 0.9,
          ease: 'power3.inOut'
        }, '-=0.2')
        .to(mainEl, {
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out'
        }, '-=0.45');
    }

    window.addEventListener('click', dismissGreetings);
    window.addEventListener('wheel', dismissGreetings, { passive: true });
    window.addEventListener('touchstart', dismissGreetings, { passive: true });
    window.addEventListener('keydown', dismissGreetings);
  }

  function initScrollTriggerSequences() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Initial position of navigation pill
    const firstActiveLink = document.querySelector('.nav-link-item a.active');
    if (firstActiveLink) {
      setTimeout(() => positionNavPillIndicator(firstActiveLink), 150);
    }

    // 1. Section Headers & Lead Text Entrance
    const sections = document.querySelectorAll('.portfolio-section');
    sections.forEach(sec => {
      const header = sec.querySelector('.section-header-block');
      if (header) {
        gsap.fromTo(header,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 86%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // Narrative & Lab Cards Entrance
    const narrativeBlocks = document.querySelectorAll('.editorial-narrative-block, .defense-game');
    narrativeBlocks.forEach(block => {
      gsap.fromTo(block,
        { opacity: 0, y: 28, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 2. Animated Metric Counters
    const metricsStrip = document.getElementById('metricsStrip');
    if (metricsStrip) {
      ScrollTrigger.create({
        trigger: metricsStrip,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const cells = metricsStrip.querySelectorAll('.metric-cell');
          cells.forEach((cell, idx) => {
            gsap.fromTo(cell,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, delay: idx * 0.1, ease: 'power2.out' }
            );

            const numEl = cell.querySelector('.metric-number');
            if (numEl) {
              const text = numEl.textContent.trim();
              if (text.includes('5+')) {
                animateCounter(numEl, 0, 5, '+ Years');
              } else if (text.includes('99.99')) {
                animateCounterFloat(numEl, 90.00, 99.99, '%');
              } else if (text.includes('15') || text.includes('50')) {
                animateCounter(numEl, 60, 15, 'ms', '<');
              } else if (text.includes('24')) {
                animateCounter(numEl, 0, 24, ' Spokes');
              }
            }
          });
        }
      });
    }

    // Helper: Integer Counter
    function animateCounter(el, start, end, suffix, prefix = '') {
      const obj = { val: start };
      gsap.to(obj, {
        val: end,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
        }
      });
    }

    // Helper: Float Counter
    function animateCounterFloat(el, start, end, suffix) {
      const obj = { val: start };
      gsap.to(obj, {
        val: end,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${obj.val.toFixed(2)}${suffix}`;
        }
      });
    }

    // 3. Staggered Timeline History Entries
    const historyEntries = document.querySelectorAll('.history-entry');
    if (historyEntries.length > 0) {
      historyEntries.forEach((entry, idx) => {
        gsap.fromTo(entry,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: entry,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }

    // 4. Staggered 3D Project Cards with Tilt Physics
    const projectCards = document.querySelectorAll('.project-case-study');
    if (projectCards.length > 0) {
      projectCards.forEach((card, idx) => {
        gsap.fromTo(card,
          { opacity: 0, y: 36, rotateX: 3 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.75,
            delay: idx * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              toggleActions: 'play none none none'
            }
          }
        );

        // Interactive 3D cursor tilt
        initCardTilt(card);
      });
    }

    // 5. Staggered Hobbies & Interests Cards
    const hobbyCards = document.querySelectorAll('.hobby-article');
    if (hobbyCards.length > 0) {
      hobbyCards.forEach((card, idx) => {
        gsap.fromTo(card,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: idx * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }

    // 6. Skill Tags Wave Reveal
    const skillCategories = document.querySelectorAll('.skill-category-block');
    skillCategories.forEach(cat => {
      const tags = cat.querySelectorAll('.skill-tag-item');
      gsap.fromTo(tags,
        { opacity: 0, scale: 0.88 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: cat,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // Interactive 3D Tilt on Mousemove for Cards
  function initCardTilt(card) {
    if (!card) return;

    function handleMouseMove(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
    }

    function handleMouseLeave() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    }

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  }

  /* --------------------------------------------------------------------------
     6. CONTACT INTERACTIONS & REAL-TIME LOCAL CLOCK
     -------------------------------------------------------------------------- */
  function initContactInteractions() {
    // 1-Click Email copy
    if (DOM.copyEmailBtn) {
      DOM.copyEmailBtn.addEventListener('click', () => {
        const emailText = DOM.copyEmailVal ? DOM.copyEmailVal.textContent.trim() : 'naitikkumarpradhan@gmail.com';
        navigator.clipboard.writeText(emailText).then(() => {
          showToast(`Email copied: ${emailText}`);
        }).catch(() => {
          showToast(`Email: ${emailText}`);
        });
      });
    }

    // Contact form submission
    if (DOM.contactForm) {
      DOM.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = DOM.contactForm.querySelector('.minimal-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending message...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Message sent';
          }
          if (DOM.formStatus) {
            DOM.formStatus.textContent = 'Thank you. Your message has been sent.';
            DOM.formStatus.className = 'form-status-msg success';
          }
          showToast('Message sent. Reply within 24 hours.');
          DOM.contactForm.reset();

          setTimeout(() => {
            if (submitBtn) submitBtn.textContent = 'Send Message ▸';
          }, 4000);
        }, 600);
      });
    }

    // Real-time IST clock update
    updateLocalClock();
    setInterval(updateLocalClock, 1000);
  }

  function showToast(message) {
    if (!DOM.toastNotice || !DOM.toastMessage) return;
    DOM.toastMessage.textContent = message;
    DOM.toastNotice.classList.add('visible');

    if (window._toastTimer) clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      DOM.toastNotice.classList.remove('visible');
    }, 2800);
  }

  function updateLocalClock() {
    if (!DOM.localClock) return;
    const now = new Date();
    // Calculate IST (UTC + 5:30)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istDate = new Date(utc + (3600000 * 5.5));
    const h = String(istDate.getHours()).padStart(2, '0');
    const m = String(istDate.getMinutes()).padStart(2, '0');
    const s = String(istDate.getSeconds()).padStart(2, '0');
    DOM.localClock.textContent = `${h}:${m}:${s} IST`;
  }

  /* --------------------------------------------------------------------------
     7. INITIALIZATION LIFECYCLE
     -------------------------------------------------------------------------- */
  function init() {
    populatePortfolioContent();
    initWheelIntro();
    initScrollWheelEngine();
    initCelestialDustCanvas();
    initContactInteractions();
    initScrollTriggerSequences();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
