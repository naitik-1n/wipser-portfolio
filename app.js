/**
 * ==========================================================================
 * KONARK & NATARAJ PORTFOLIO - CORE APPLICATION ENGINE
 * Features:
 * 1. Loading screen: Centered chakra spins on load, smoothly goes still,
 *    and allows one-click or [Enter] entrance into the sanctuary.
 * 2. Background chakra: Stays in the back on the left, exactly half-visible.
 * 3. Rotates like a wheel: Smooth rolling physics synced to scroll (0.28 deg/px).
 * 4. Scroll effects: Dynamic solar flare & amber glow aura when scrolling.
 * 5. Strict center rotation: SVG native transform `rotate(angle 400 400)`.
 * 6. Translucent sidebar: Wheel in the back shines through the left panel.
 * 7. Dual toggle mode: "Scroll Sync" vs "Stay Still".
 * 8. Editorial data population, 1-click email copy, real-time local clock.
 * ==========================================================================
 */

(function () {
  'use strict';

  // Application State
  const state = {
    isIntroActive: true,
    currentRotation: 0,
    baseRotation: 0,
    targetRotation: 0,
    rotationMode: 'scroll', // 'scroll' | 'still'
    scrollGlowTimer: null,
    activeSection: 'about'
  };

  // DOM Elements Cache
  const DOM = {
    introOverlay: document.getElementById('intro-overlay'),
    introStage: document.getElementById('introChakraStage'),
    introRotator: document.getElementById('introChakraRotator'),
    entryPrompt: document.getElementById('introEntryPrompt'),
    entryBtn: document.getElementById('enterPortfolioBtn'),
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
    contactForm: document.getElementById('inquiryForm'),
    formStatus: document.getElementById('formStatusMsg')
  };

  // 24 Cosmic Hours / Spoke Cycle Names (Konark 24-spoke Solar Dial)
  const SPOKE_CYCLE_NAMES = [
    "Spoke I • The Cosmic Spark",
    "Spoke II • Awakening of Matter",
    "Spoke III • Rhythm & Vibration",
    "Spoke IV • Creative Synthesis",
    "Spoke V • Structural Foundations",
    "Spoke VI • Fire of Transformation",
    "Spoke VII • The Architect's Vision",
    "Spoke VIII • Equilibrium & Harmony",
    "Spoke IX • Dynamic Momentum",
    "Spoke X • Expansion of Systems",
    "Spoke XI • Resilient Boundaries",
    "Spoke XII • Solar Zenith (Midday Sun)",
    "Spoke XIII • Preservation & State",
    "Spoke XIV • Algorithmic Flow",
    "Spoke XV • Convergence of Forces",
    "Spoke XVI • Scalability & Grace",
    "Spoke XVII • The Infinite Loop",
    "Spoke XVIII • Dissolution of Redundancy",
    "Spoke XIX • Deep Reflection",
    "Spoke XX • Cosmic Starlight",
    "Spoke XXI • The Sacred Geometry",
    "Spoke XXII • Transcendence of Form",
    "Spoke XXIII • Silence Before Motion",
    "Spoke XXIV • The Complete Cosmic Cycle"
  ];

  /* --------------------------------------------------------------------------
     1. LOADING SCREEN: SPINS IN CENTER, GOES STILL, CLICK TO ENTER
     -------------------------------------------------------------------------- */
  function initLoadingSequence() {
    // The creation/destruction page has its own entrance-free, pinned animation.
    // Do not leave portfolio scroll effects blocked when its intro overlay is absent.
    if (!DOM.introStage) {
      state.isIntroActive = false;
      return;
    }
    let spinSpeed = 2.5; // Initial spin speed in deg/frame
    let introAngle = 0;
    let isIntroSpinning = true;
    if (DOM.backgroundChakraZone) DOM.backgroundChakraZone.classList.add('pre-entry');

    function introSpinStep() {
      if (isIntroSpinning) {
        introAngle += spinSpeed;
        const rotator = DOM.introRotator || document.getElementById('introChakraRotator');
        if (rotator) {
          // Rotate strictly around center (400, 400)
          rotator.setAttribute('transform', `rotate(${introAngle.toFixed(2)} 400 400)`);
        }
        requestAnimationFrame(introSpinStep);
      }
    }
    requestAnimationFrame(introSpinStep);

    // After 1.4 seconds of smooth spinning, decelerate smoothly to still
    setTimeout(() => {
      let decelTimer = setInterval(() => {
        spinSpeed *= 0.94;
        if (spinSpeed < 0.04) {
          clearInterval(decelTimer);
          spinSpeed = 0;
          isIntroSpinning = false;

          // Reveal "Enter Portfolio" prompt
          if (DOM.entryPrompt) {
            DOM.entryPrompt.classList.add('ready');
          }
        }
      }, 30);
    }, 1400);

    // Entrance handlers
    function handleEnter() {
      if (!state.isIntroActive) return;
      state.isIntroActive = false;

      // Stop the intro spin where it is; background wheel will continue from this angle
      isIntroSpinning = false;
      const overlay = DOM.introOverlay;
      const stage = DOM.introStage;
      const bg = DOM.backgroundChakraZone;

      function finish() {
        // Hand the angle over so the wheel doesn't jump, then scrolling takes over
        state.baseRotation = introAngle;
        state.currentRotation = introAngle + (state.rotationMode === 'scroll' ? window.scrollY * 0.28 : 0);
        state.targetRotation = state.currentRotation;
        if (bg) bg.classList.remove('pre-entry');
        if (overlay) overlay.classList.add('dismissed');
        showToast('☸ 24-Spoke Wheel Aligned • Welcome to Portfolio');
      }

      if (!overlay || !stage || !bg || !stage.animate) { finish(); return; }

      overlay.classList.add('entering');
      const from = stage.getBoundingClientRect();
      const to = bg.getBoundingClientRect();
      const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
      const s = to.width / from.width;

      const anim = stage.animate([
        { transform: 'translate(0,0) scale(1)' },
        { transform: `translate(${dx}px, ${dy}px) scale(${s})` }
      ], { duration: 1500, easing: 'cubic-bezier(0.65, 0, 0.25, 1)', fill: 'forwards' });

      // Keep spinning while it travels and grows, easing down to a gentle speed
      const t0 = performance.now();
      const rotator = DOM.introRotator || document.getElementById('introChakraRotator');
      (function travelSpin(now) {
        const p = Math.min(1, (now - t0) / 1500);
        introAngle += 3 * (1 - p) + 0.3;
        if (rotator) rotator.setAttribute('transform', `rotate(${introAngle.toFixed(2)} 400 400)`);
        if (p < 1) requestAnimationFrame(travelSpin);
      })(t0);

      anim.onfinish = () => {
        // Make sure the final angle is applied before swapping to the background wheel
        if (rotator) rotator.setAttribute('transform', `rotate(${introAngle.toFixed(2)} 400 400)`);
        const bgRot = DOM.chakraRotator || document.getElementById('chakraRotator');
        if (bgRot) bgRot.setAttribute('transform', `rotate(${introAngle.toFixed(2)} 400 400)`);
        finish();
      };
    }

    if (DOM.introStage) {
      DOM.introStage.addEventListener('click', handleEnter);
    }
    if (DOM.entryBtn) {
      DOM.entryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleEnter();
      });
    }

    // Enter or Space key support
    window.addEventListener('keydown', function onKey(e) {
      if (state.isIntroActive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleEnter();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. BACKGROUND CHAKRA: ROTATES LIKE A WHEEL WITH SCROLL EFFECTS
     -------------------------------------------------------------------------- */
  function initScrollWheelEngine() {
    // The pinned creation/destruction timeline owns the chakra's scroll rotation.
    if (document.getElementById('pinContainer')) return;
    // Mode toggle buttons
    if (DOM.modeScrollBtn) {
      DOM.modeScrollBtn.addEventListener('click', () => setRotationMode('scroll'));
    }
    if (DOM.modeStillBtn) {
      DOM.modeStillBtn.addEventListener('click', () => setRotationMode('still'));
    }

    // Clicking the background wheel or spoke tracker nudges by 1 spoke (+15 deg)
    if (DOM.backgroundChakraZone) {
      DOM.backgroundChakraZone.addEventListener('click', nudgeWheelSpoke);
    }
    if (DOM.spokeTracker) {
      DOM.spokeTracker.addEventListener('click', nudgeWheelSpoke);
    }

    // Scroll listener
    window.addEventListener('scroll', onPageScroll, { passive: true });
    onPageScroll();

    // 60 FPS animation loop with smooth lerp physics
    requestAnimationFrame(renderLoop);
  }

  function setRotationMode(mode) {
    state.rotationMode = mode;

    if (mode === 'scroll') {
      DOM.modeScrollBtn.classList.add('active');
      DOM.modeStillBtn.classList.remove('active');
      showToast('☸ Wheel: Synced with Scroll');
    } else {
      DOM.modeStillBtn.classList.add('active');
      DOM.modeScrollBtn.classList.remove('active');
      showToast('🔒 Wheel: Locked Still');
    }
  }

  function onPageScroll() {
    if (state.rotationMode === 'scroll') {
      // ROTATE LIKE A WHEEL: 0.28 degrees per pixel of scroll!
      // Scrolling down rolls the wheel forward (clockwise); scrolling up rolls backward!
      state.targetRotation = state.baseRotation + window.scrollY * 0.28;

      // Dynamic Solar Flare Effect on Scroll ("with some effects as it scroll")
      if (DOM.backgroundChakraZone) {
        DOM.backgroundChakraZone.classList.add('is-scrolling');
        clearTimeout(state.scrollGlowTimer);
        state.scrollGlowTimer = setTimeout(() => {
          DOM.backgroundChakraZone.classList.remove('is-scrolling');
        }, 160);
      }
    }

    // Scroll spy for navigation
    updateActiveNavSection();
  }

  function renderLoop() {
    // Lerp interpolation for buttery smooth rotation
    const diff = state.targetRotation - state.currentRotation;
    if (Math.abs(diff) > 0.01) {
      state.currentRotation += diff * 0.12;

      // Apply exact SVG center rotation around (400, 400)
      const rotator = DOM.chakraRotator || document.getElementById('chakraRotator');
      if (rotator) {
        rotator.setAttribute('transform', `rotate(${state.currentRotation.toFixed(2)} 400 400)`);
      }

      // Update active spoke indicator
      updateSpokeIndicator(calculateCurrentSpokeIndex(state.currentRotation));
    }

    requestAnimationFrame(renderLoop);
  }

  function nudgeWheelSpoke() {
    state.targetRotation += 15; // Advance exactly one spoke (15 deg)
    if (state.rotationMode === 'still') {
      state.currentRotation += 15;
      const rotator = DOM.chakraRotator || document.getElementById('chakraRotator');
      if (rotator) {
        rotator.setAttribute('transform', `rotate(${state.currentRotation.toFixed(2)} 400 400)`);
      }
      updateSpokeIndicator(calculateCurrentSpokeIndex(state.currentRotation));
    }
    // Solar pulse effect on click
    if (DOM.backgroundChakraZone) {
      DOM.backgroundChakraZone.classList.add('is-scrolling');
      setTimeout(() => {
        DOM.backgroundChakraZone.classList.remove('is-scrolling');
      }, 400);
    }
    showToast(`☸ Spoke: ${SPOKE_CYCLE_NAMES[calculateCurrentSpokeIndex(state.currentRotation)]}`);
  }

  function calculateCurrentSpokeIndex(angleDeg) {
    const normalized = ((angleDeg % 360) + 360) % 360;
    return Math.floor(normalized / 15) % 24;
  }

  function updateSpokeIndicator(index) {
    if (!DOM.spokeTracker) return;
    const name = SPOKE_CYCLE_NAMES[index] || `Spoke ${index + 1} / 24`;
    DOM.spokeTracker.textContent = name;
  }

  /* --------------------------------------------------------------------------
     3. EDITORIAL SCROLL SPY
     -------------------------------------------------------------------------- */
  function updateActiveNavSection() {
    const sections = ['about', 'history', 'projects', 'hobbies', 'contact'];
    const scrollPos = window.scrollY + 180;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && el.offsetTop <= scrollPos) {
        if (state.activeSection !== sections[i]) {
          state.activeSection = sections[i];
          DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === sections[i]) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
        break;
      }
    }
  }

  /* --------------------------------------------------------------------------
     4. DYNAMIC DATA POPULATION (EDITORIAL VERTICAL FLOW, NO BOXY CARDS)
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

    // Section 1: Introduction (Narrative & Skills)
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
            <div class="metric-number">${item.metric}</div>
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

    // Section 2: History (Editorial Timeline Stream)
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

    // Section 3: Projects (Clean Case Studies)
    if (Array.isArray(data.projects)) {
      const projectsEl = document.getElementById('projectsStream');
      if (projectsEl) {
        projectsEl.innerHTML = data.projects.map((proj, idx) => `
          <article class="project-case-study">
            <div class="project-meta-row">
              <span class="project-index-tag">PROJ // 0${idx + 1}</span>
              <span class="project-category">${proj.category}</span>
            </div>
            <h3 class="project-title serif-font">${proj.title}</h3>
            <p class="project-desc">${proj.description}</p>
            ${proj.metrics ? `
              <div class="project-metrics-line">
                <span class="metrics-bullet">⚡</span>
                <span>${proj.metrics}</span>
              </div>
            ` : ''}
            <div class="project-tech-strip">
              ${proj.tech.map(t => `<span class="project-tech-item">${t}</span>`).join('')}
            </div>
            <div class="project-actions-row">
              ${proj.githubUrl ? `
                <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="editorial-link">
                  <span>Source Code</span>
                  <span>↗</span>
                </a>
              ` : ''}
              ${proj.demoUrl ? `
                <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="editorial-link">
                  <span>Live Demonstration</span>
                  <span>↗</span>
                </a>
              ` : ''}
            </div>
          </article>
        `).join('');
      }
    }

    // Section 4: Hobbies (Editorial Essays)
    if (Array.isArray(data.hobbies)) {
      const hobbiesEl = document.getElementById('hobbiesGrid');
      if (hobbiesEl) {
        hobbiesEl.innerHTML = data.hobbies.map(hobby => `
          <article class="hobby-article">
            <div class="hobby-glyph-accent">${hobby.glyph || '☸'}</div>
            <h3 class="hobby-title serif-font">${hobby.title}</h3>
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
     5. CONTACT INTERACTIONS & REAL-TIME LOCAL CLOCK
     -------------------------------------------------------------------------- */
  function initContactInteractions() {
    // 1-Click Email copy
    if (DOM.copyEmailBtn) {
      DOM.copyEmailBtn.addEventListener('click', () => {
        const emailText = DOM.copyEmailVal ? DOM.copyEmailVal.textContent.trim() : 'naitik.engineer@example.com';
        navigator.clipboard.writeText(emailText).then(() => {
          showToast(`✓ Copied: ${emailText}`);
        }).catch(() => {
          showToast(`Direct Email: ${emailText}`);
        });
      });
    }

    // Minimalist contact form submission
    if (DOM.contactForm) {
      DOM.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = DOM.contactForm.querySelector('.minimal-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Transmitting... ☸';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Transmission Received ✓';
          if (DOM.formStatus) {
            DOM.formStatus.textContent = 'Thank you. Your message has entered my inbox cycle.';
            DOM.formStatus.className = 'form-status-msg success';
          }
          showToast('✓ Message received. I will respond within 24 hours.');
          DOM.contactForm.reset();

          setTimeout(() => {
            submitBtn.innerHTML = `Send Message ▸`;
            if (DOM.formStatus) DOM.formStatus.className = 'form-status-msg';
          }, 3500);
        }, 800);
      });
    }

    // Update local clock (24-hour Konark solar cycle)
    updateLocalClock();
    setInterval(updateLocalClock, 1000);
  }

  function showToast(message) {
    if (!DOM.toastNotice || !DOM.toastMessage) return;
    DOM.toastMessage.textContent = message;
    DOM.toastNotice.classList.add('show');
    clearTimeout(DOM.toastTimer);
    DOM.toastTimer = setTimeout(() => {
      DOM.toastNotice.classList.remove('show');
    }, 3000);
  }

  function updateLocalClock() {
    if (!DOM.localClock) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    DOM.localClock.textContent = `${h}:${m}:${s} LOCAL`;
  }

  /* --------------------------------------------------------------------------
     6. FULLSCREEN COSMIC CANVAS: INWARD SWIRL, NATARAJA EMBERS & CLICK SPARKS
     -------------------------------------------------------------------------- */
  let cosmicCanvasEngine = null;

  function initCosmicCanvasEngine() {
    // The pinned animation page has its own particle canvas engine.
    if (document.getElementById('pinContainer')) return;
    const canvas = document.getElementById('cosmicCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#ffcc00', '#f2541b', '#ff7236', '#ffe680', '#ffffff'];

    // Inward swirling cosmic dust particle
    class SwirlDustParticle {
      constructor(centerX, centerY) {
        this.cx = centerX;
        this.cy = centerY;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = 180 + Math.random() * 320;
        this.speed = 0.03 + Math.random() * 0.04;
        this.radialSpeed = 1.8 + Math.random() * 2.8;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = 1.2 + Math.random() * 2.5;
        this.alpha = 0.25 + Math.random() * 0.7;
        this.alive = true;
      }
      update() {
        this.angle += this.speed;
        this.radius -= this.radialSpeed;
        if (this.radius <= 10) this.alive = false;
        this.x = this.cx + Math.cos(this.angle) * this.radius;
        this.y = this.cy + Math.sin(this.angle) * this.radius;
      }
      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha * (this.radius / 280));
        c.fillStyle = this.color;
        c.shadowBlur = 10;
        c.shadowColor = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // Rising Nataraja Embers particle
    class RisingEmberParticle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 360;
        this.y = y + (Math.random() - 0.5) * 200;
        this.vx = (Math.random() - 0.5) * 2.2;
        this.vy = -(1.5 + Math.random() * 3.5);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = 1.5 + Math.random() * 3;
        this.alpha = 0.85 + Math.random() * 0.15;
        this.decay = 0.012 + Math.random() * 0.02;
        this.alive = true;
      }
      update() {
        this.x += this.vx + Math.sin(this.y * 0.02) * 1.2;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.size *= 0.985;
        if (this.alpha <= 0.02 || this.size <= 0.3) this.alive = false;
      }
      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = this.color;
        c.shadowBlur = 12;
        c.shadowColor = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // Click Stardust Spark
    class ClickSparkParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 7;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = 2 + Math.random() * 3;
        this.alpha = 1;
        this.gravity = 0.18;
        this.drag = 0.95;
        this.alive = true;
      }
      update() {
        this.vx *= this.drag;
        this.vy = this.vy * this.drag + this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.028;
        this.size *= 0.97;
        if (this.alpha <= 0.02 || this.size <= 0.4) this.alive = false;
      }
      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = this.color;
        c.shadowBlur = 14;
        c.shadowColor = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.alive) {
          p.draw(ctx);
        } else {
          particles.splice(i, 1);
        }
      }
      requestAnimationFrame(renderParticles);
    }
    requestAnimationFrame(renderParticles);

    cosmicCanvasEngine = {
      spawnInwardDust(cx, cy, count = 28) {
        for (let i = 0; i < count; i++) particles.push(new SwirlDustParticle(cx, cy));
      },
      spawnNatarajaEmbers(cx, cy, count = 35) {
        for (let i = 0; i < count; i++) particles.push(new RisingEmberParticle(cx, cy));
      },
      triggerClickBurst(x, y) {
        for (let i = 0; i < 24; i++) particles.push(new ClickSparkParticle(x, y));

        const ring = document.createElement('div');
        ring.className = 'cosmic-click-ring';
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        ring.style.width = '40px';
        ring.style.height = '40px';
        document.body.appendChild(ring);

        if (window.gsap) {
          gsap.to(ring, {
            scale: 4.5,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.out',
            onComplete: () => ring.remove()
          });
        } else {
          setTimeout(() => ring.remove(), 600);
        }
      }
    };

    // Universal Click Burst everywhere
    window.addEventListener('pointerdown', (e) => {
      cosmicCanvasEngine.triggerClickBurst(e.clientX, e.clientY);
    });
  }

  /* --------------------------------------------------------------------------
     7. BIDIRECTIONAL COSMIC CREATION & DESTRUCTION SCROLL ENGINE
     -------------------------------------------------------------------------- */
  function initCosmicCreationDestruction() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Split text into characters helper
    function splitTextToChars(element) {
      if (!element || element.dataset.splitDone) return [];
      const text = element.textContent.trim();
      const words = text.split(/\s+/);
      element.innerHTML = '';
      element.dataset.splitDone = 'true';
      const chars = [];

      words.forEach(word => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'cosmic-word';
        for (let char of word) {
          const charSpan = document.createElement('span');
          charSpan.className = 'cosmic-char';
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          chars.push(charSpan);
        }
        element.appendChild(wordSpan);
      });
      return chars;
    }

    const sections = ['about', 'history', 'projects', 'hobbies', 'contact'];

    sections.forEach((secId) => {
      const sectionEl = document.getElementById(secId);
      if (!sectionEl) return;

      const titleEl = sectionEl.querySelector('.section-title');
      const titleChars = titleEl ? splitTextToChars(titleEl) : [];
      const singularity = document.getElementById(`singularity-${secId}`);
      const shockwave = document.getElementById(`shockwave-${secId}`);
      const radialglow = document.getElementById(`radialglow-${secId}`);
      const flamering = document.getElementById(`flamering-${secId}`);
      const mandala = document.getElementById(`mandala-${secId}`);
      const mandalaLines = mandala ? mandala.querySelectorAll('.mandala-stroke-line') : [];

      const mainBlocks = sectionEl.querySelectorAll(
        '.section-lead, .narrative-headline, .narrative-body p, .metrics-strip, .skills-editorial-grid, .history-entry, .project-case-study, .hobby-article, .editorial-contact-split'
      );

      // Initial state
      if (singularity) gsap.set(singularity, { scale: 0, opacity: 0 });
      if (shockwave) gsap.set(shockwave, { scale: 0.1, opacity: 0 });
      if (radialglow) gsap.set(radialglow, { scale: 0.2, opacity: 0 });
      if (flamering) gsap.set(flamering, { scale: 1.4, opacity: 0 });
      if (mandala) gsap.set(mandala, { opacity: 0 });
      if (mandalaLines.length) gsap.set(mandalaLines, { strokeDashoffset: 1200 });

      // Creation Trigger (When section enters viewport)
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter: () => triggerCreation(false),
        onEnterBack: () => triggerCreation(true),
        onLeave: () => triggerDestruction(false),
        onLeaveBack: () => triggerDestruction(true)
      });

      function triggerCreation(isReverse) {
        const rect = sectionEl.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.55;
        const cy = Math.max(100, Math.min(window.innerHeight - 100, rect.top + 200));

        if (cosmicCanvasEngine) {
          cosmicCanvasEngine.spawnInwardDust(cx, cy, 32);
        }

        // Singularity point of warm light bursts
        if (singularity) {
          gsap.killTweensOf(singularity);
          gsap.fromTo(singularity,
            { scale: 0, opacity: 0 },
            { scale: 1.8, opacity: 1, duration: 0.45, ease: 'power2.out', onComplete: () => {
              gsap.to(singularity, { scale: 0, opacity: 0, duration: 0.35, ease: 'power2.in' });
            }}
          );
        }

        // Expanding ring pulse & radial glow (Big Bang / Seed Sprouting)
        if (shockwave) {
          gsap.killTweensOf(shockwave);
          gsap.fromTo(shockwave,
            { scale: 0.1, opacity: 0.9 },
            { scale: 2.5, opacity: 0, duration: 1, ease: 'power2.out' }
          );
        }
        if (radialglow) {
          gsap.killTweensOf(radialglow);
          gsap.fromTo(radialglow,
            { scale: 0.2, opacity: 0.8 },
            { scale: 2.2, opacity: 0, duration: 1.1, ease: 'power2.out' }
          );
        }

        // Thin orange mandala & spiral lines draw in via stroke-dashoffset
        if (mandala) {
          gsap.killTweensOf(mandala);
          gsap.to(mandala, { opacity: 0.65, duration: 0.3 });
          if (mandalaLines.length) {
            gsap.fromTo(mandalaLines,
              { strokeDashoffset: 1200 },
              { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out', onComplete: () => {
                gsap.to(mandala, { opacity: 0.18, duration: 0.6 });
              }}
            );
          }
        }

        // Heading SplitText characters stagger in from random offsets
        if (titleChars.length) {
          titleChars.forEach((char) => {
            gsap.killTweensOf(char);
            gsap.fromTo(char,
              {
                x: (Math.random() - 0.5) * 140,
                y: (Math.random() - 0.5) * 100,
                rotation: (Math.random() - 0.5) * 60,
                scale: 0.6,
                filter: 'blur(18px)',
                opacity: 0
              },
              {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                filter: 'blur(0px)',
                opacity: 1,
                duration: 0.9 + Math.random() * 0.3,
                ease: 'power3.out'
              }
            );
          });
        }

        // Content blocks assemble from scale 0.6, blur 20px -> 0
        if (mainBlocks.length) {
          gsap.killTweensOf(mainBlocks);
          gsap.fromTo(mainBlocks,
            { scale: 0.75, filter: 'blur(16px)', opacity: 0, y: isReverse ? -40 : 40 },
            {
              scale: 1,
              filter: 'blur(0px)',
              opacity: 1,
              y: 0,
              stagger: 0.06,
              duration: 0.65,
              ease: 'power3.out'
            }
          );
        }
      }

      function triggerDestruction(isReverse) {
        const rect = sectionEl.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.55;
        const cy = Math.max(100, Math.min(window.innerHeight - 100, rect.top + 200));

        if (cosmicCanvasEngine) {
          cosmicCanvasEngine.spawnNatarajaEmbers(cx, cy, 30);
        }

        // Contracting flame ring
        if (flamering) {
          gsap.killTweensOf(flamering);
          gsap.fromTo(flamering,
            { scale: 1.4, opacity: 0.9 },
            { scale: 0.15, opacity: 0, duration: 0.75, ease: 'power2.in' }
          );
        }

        // Title chars shatter like ash
        if (titleChars.length) {
          titleChars.forEach((char) => {
            gsap.killTweensOf(char);
            gsap.to(char, {
              x: (Math.random() - 0.5) * 120,
              y: isReverse ? 60 : -60,
              rotation: (Math.random() - 0.5) * 50,
              scale: 0.7,
              filter: 'blur(16px)',
              opacity: 0,
              duration: 0.75,
              ease: 'power2.in'
            });
          });
        }

        // Content dissolves and drifts out while keeping paragraph text level.
        if (mainBlocks.length) {
          mainBlocks.forEach((block, idx) => {
            gsap.killTweensOf(block);
            const dirX = idx % 2 === 0 ? -120 : 120;
            const dirY = isReverse ? 90 : -90;
            gsap.to(block, {
              x: dirX,
              y: dirY,
              rotation: 0,
              skewX: 0,
              filter: 'blur(18px)',
              opacity: 0,
              duration: 0.55,
              ease: 'power2.inOut'
            });
          });
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. DETAILED & MORE ANIMATIONS ON HOVER AND CLICKS
     -------------------------------------------------------------------------- */
  function initInteractiveInteractions() {
    // 3D Magnetic card tilt on hover
    const tiltItems = document.querySelectorAll(
      '.project-case-study, .metric-cell, .history-entry, .hobby-article, .contact-email-card'
    );

    tiltItems.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        if (window.gsap) {
          gsap.to(el, {
            rotateY: x * 0.05,
            rotateX: -y * 0.05,
            duration: 0.25,
            ease: 'power1.out',
            transformPerspective: 900
          });
        }
      });

      el.addEventListener('mouseleave', () => {
        if (window.gsap) {
          gsap.to(el, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.45,
            ease: 'elastic.out(1, 0.4)'
          });
        }
      });

      el.addEventListener('click', () => {
        if (window.gsap) {
          gsap.fromTo(el, { scale: 0.96 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
        }
      });
    });

    // Ambient floating embers cursor follower
    let lastMoveTime = 0;
    window.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - lastMoveTime > 45 && cosmicCanvasEngine) {
        lastMoveTime = now;
        cosmicCanvasEngine.spawnInwardDust(e.clientX, e.clientY, 1);
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. INITIALIZATION LIFECYCLE
     -------------------------------------------------------------------------- */
  function init() {
    populatePortfolioContent();
    initLoadingSequence();
    initScrollWheelEngine();
    initContactInteractions();
    initCosmicCanvasEngine();
    initCosmicCreationDestruction();
    initInteractiveInteractions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
