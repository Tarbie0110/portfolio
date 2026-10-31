/* ═══════════════════════════════════════════════════════════════
   MAKWENA RAMMUTLA — PORTFOLIO
   script.js — navigation, scroll effects, reveal animations
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAV: shadow on scroll ──────────────────────────────── */
  const header = document.querySelector('.site-header');

  function updateNavShadow() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavShadow, { passive: true });
  updateNavShadow(); // run once on load

  /* ── NAV: mobile hamburger toggle ──────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      }
    });

    // Close menu with Escape and return focus to toggle
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        navToggle.focus();
      }
    });
  }

  /* ── NAV: active link highlighting on scroll ────────────── */
  const sections    = document.querySelectorAll('main section[id]');
  const navLinkEls  = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNavLink() {
    let currentId = '';
    const scrollY = window.scrollY + 80; // offset for fixed nav

    sections.forEach(function (section) {
      if (scrollY >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });
  setActiveNavLink();

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  // Elements to animate in as they enter the viewport.
  // We target section headings, cards, and groups.
  const revealTargets = [
    '.about-text',
    '.about-card-inner',
    '.skill-group',
    '.project-card',
    '.cert-card',
    '.contact-intro',
    '.contact-links',
    '.section-label',
  ];

  const revealEls = document.querySelectorAll(revealTargets.join(', '));

  revealEls.forEach(function (el) {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately for older browsers
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── STAGGER: skill groups and project cards ────────────── */
  // Add a small delay offset so siblings animate one after another.
  function staggerChildren(parentSelector, childSelector, delayStep) {
    document.querySelectorAll(parentSelector).forEach(function (parent) {
      parent.querySelectorAll(childSelector).forEach(function (child, i) {
        child.style.transitionDelay = i * delayStep + 'ms';
      });
    });
  }

  staggerChildren('.skills-grid',   '.skill-group',   80);
  staggerChildren('.projects-grid', '.project-card',  100);
  staggerChildren('.certs-list',    '.cert-card',     80);
  staggerChildren('.about-grid',    '.about-detail',  60);

  /* ── SMOOTH SCROLL: honour reduced-motion preference ───── */
  // The CSS already sets scroll-behavior: smooth. This JS override
  // respects prefers-reduced-motion by disabling smooth scroll.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyScrollBehavior() {
    if (prefersReducedMotion.matches) {
      document.documentElement.style.scrollBehavior = 'auto';
    } else {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  applyScrollBehavior();
  prefersReducedMotion.addEventListener('change', applyScrollBehavior);

  /* ── HERO SCROLL HINT: hide once user scrolls ───────────── */
  const scrollHint = document.querySelector('.hero-scroll-hint');

  if (scrollHint) {
    function hideScrollHint() {
      if (window.scrollY > 80) {
        scrollHint.style.opacity = '0';
        scrollHint.style.pointerEvents = 'none';
      }
    }
    window.addEventListener('scroll', hideScrollHint, { passive: true });
  }

})();

/* ═══════════════════════════════════════════════════════════════
   SKATER EASTER EGG
   Pixel-art girl on a skateboard. Click → trick → fall → tooth
   flies → stats card appears. Appended; no existing code changed.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('skater-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const hint   = document.querySelector('.skater-hint');
  const stats  = document.getElementById('skater-stats');
  const reset  = document.getElementById('skater-reset');

  /* ── Palette (mirrors site CSS vars as hex) ──────────────── */
  const P = {
    cream:      '#F5EDD8',
    ochre:      '#C8832A',
    ochreLight: '#E0A44E',
    rust:       '#A63D22',
    brown:      '#2C1A0E',
    brownMid:   '#5C3317',
    skin:       '#D4956A',   /* warm skin tone                  */
    skinShade:  '#B87A52',
    hair:       '#1A0A00',   /* very dark brown / black         */
    clothing1:  '#A63D22',   /* rust top — matches site accent  */
    clothing2:  '#C8832A',   /* ochre trousers                  */
    boardTop:   '#8B5E3C',
    boardBot:   '#5C3317',
    wheel:      '#2C1A0E',
    wheelHub:   '#C8832A',
    tooth:      '#F5EDD8',
    ground:     '#8B5E3C',
    transparent:'rgba(0,0,0,0)',
  };

  /* ── State machine ───────────────────────────────────────── */
  // States: 'idle' | 'trick' | 'fall' | 'down'
  let state      = 'idle';
  let animFrame  = null;
  let startTime  = null;
  let toothX, toothY, toothVx, toothVy;

  /* ── Reduced-motion check ────────────────────────────────── */
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Drawing helpers ─────────────────────────────────────── */
  // Pixel-perfect rect (snapped to integer coords)
  function px(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // Clear canvas
  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* ── Ground ──────────────────────────────────────────────── */
  function drawGround(y) {
    // Ground line
    px(0, y, canvas.width, 2, P.ground);
    // Subtle shadow strip
    ctx.fillStyle = 'rgba(44,26,14,0.15)';
    ctx.fillRect(0, y + 2, canvas.width, 4);
  }

  /* ── Skateboard ──────────────────────────────────────────── */
  // deck: x = left edge, y = top of deck, angle in radians
  function drawBoard(bx, by, angle) {
    ctx.save();
    // pivot at center of board
    const cx = bx + 28, cy = by + 3;
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    // deck top surface
    px(-28, -3, 56, 6, P.boardTop);
    // deck underside darker
    px(-28, 3, 56, 3, P.boardBot);
    // nose & tail kicks (2px bumps)
    px(-30, -5, 4, 5, P.boardTop);
    px(26, -5, 4, 5, P.boardTop);
    // trucks (axles)
    px(-22, 4, 6, 3, '#4A3020');
    px(16, 4, 6, 3, '#4A3020');
    // wheels (circles approximated with squares in pixel art)
    const wheelColor = P.wheel;
    const hubColor   = P.wheelHub;
    // left wheels
    px(-25, 5, 8, 8, wheelColor);
    px(-23, 7, 4, 4, hubColor);
    // right wheels
    px(17, 5, 8, 8, wheelColor);
    px(19, 7, 4, 4, hubColor);
    ctx.restore();
  }

  /* ── Girl character ──────────────────────────────────────── */
  // gx, gy = bottom-center of character feet position
  // pose: 'ride' | 'trick' | 'fall' | 'down'
  // legPhase: 0-1 for idle bob
  function drawGirl(gx, gy, pose, legPhase) {
    // All coords relative to gx, gy (feet)
    const x = Math.round(gx);
    const y = Math.round(gy);

    if (pose === 'ride') {
      // ── Riding pose ──
      // Legs (bent, riding stance) — slightly bob with legPhase
      const legBob = Math.round(Math.sin(legPhase * Math.PI * 2) * 1);
      // back leg
      px(x - 8, y - 14 + legBob, 6, 14, P.clothing2);
      // front leg
      px(x + 2, y - 14 + legBob, 6, 14, P.clothing2);
      // shoes
      px(x - 10, y - 4 + legBob, 8, 5, P.brown);
      px(x + 2, y - 4 + legBob, 8, 5, P.brown);
      // body / torso
      px(x - 7, y - 30 + legBob, 14, 16, P.clothing1);
      // arms (one forward, one back for balance)
      px(x - 14, y - 28 + legBob, 8, 4, P.skin);
      px(x + 6, y - 24 + legBob, 8, 4, P.skin);
      // neck
      px(x - 2, y - 34 + legBob, 5, 5, P.skin);
      // head
      px(x - 6, y - 48 + legBob, 13, 14, P.skin);
      // hair (locs/braids suggestion)
      px(x - 6, y - 48 + legBob, 13, 5, P.hair);
      px(x - 6, y - 43 + legBob, 3, 8, P.hair);
      px(x + 4, y - 43 + legBob, 3, 8, P.hair);
      // eye
      px(x,     y - 42 + legBob, 2, 2, P.brown);
      px(x + 3, y - 42 + legBob, 2, 2, P.brown);
      // mouth (small smile)
      px(x + 1, y - 38 + legBob, 4, 1, P.brownMid);

    } else if (pose === 'trick') {
      // ── Trick pose: airborne, body tucked, knees up ──
      // board is drawn separately at angle, so just draw body
      // legs tucked high
      px(x - 6, y - 24, 5, 10, P.clothing2);
      px(x + 1, y - 22, 5, 10, P.clothing2);
      px(x - 10, y - 20, 7, 5, P.brown); // shoes
      px(x + 3,  y - 16, 7, 5, P.brown);
      // torso leaning forward
      px(x - 7, y - 38, 13, 16, P.clothing1);
      // arms grabbing board suggestion
      px(x - 12, y - 36, 8, 4, P.skin);
      px(x + 5,  y - 34, 8, 4, P.skin);
      // neck + head
      px(x - 2, y - 42, 5, 5, P.skin);
      px(x - 6, y - 54, 13, 14, P.skin);
      px(x - 6, y - 54, 13, 5, P.hair);
      px(x - 6, y - 49, 3, 8, P.hair);
      px(x + 4, y - 49, 3, 8, P.hair);
      // excited eyes (wide open)
      px(x,     y - 48, 3, 3, P.brown);
      px(x + 4, y - 48, 3, 3, P.brown);

    } else if (pose === 'fall') {
      // ── Falling: arms flailing, body tilted ──
      px(x - 4, y - 18, 5, 14, P.clothing2);
      px(x + 3, y - 16, 5, 12, P.clothing2);
      px(x - 8, y - 8,  8, 5,  P.brown);
      px(x + 4, y - 6,  8, 5,  P.brown);
      // torso tilted
      px(x - 8, y - 34, 14, 16, P.clothing1);
      // arms flailing out
      px(x - 18, y - 30, 11, 4, P.skin);
      px(x + 7,  y - 26, 11, 4, P.skin);
      // head
      px(x - 3, y - 38, 5, 5, P.skin);
      px(x - 7, y - 50, 13, 14, P.skin);
      px(x - 7, y - 50, 13, 5, P.hair);
      px(x - 7, y - 45, 3, 8, P.hair);
      px(x + 3, y - 45, 3, 8, P.hair);
      // surprised mouth O
      px(x + 1, y - 41, 3, 3, P.brownMid);
      // eyes alarmed (lines)
      px(x - 1,  y - 44, 3, 2, P.brown);
      px(x + 3,  y - 44, 3, 2, P.brown);

    } else if (pose === 'down') {
      // ── On the ground: crumpled heap ──
      // legs splayed
      px(x - 18, y - 8, 14, 6, P.clothing2);
      px(x + 4,  y - 6, 14, 6, P.clothing2);
      px(x - 20, y - 6, 8, 5, P.brown);
      px(x + 12, y - 5, 8, 5, P.brown);
      // torso flat
      px(x - 10, y - 18, 20, 12, P.clothing1);
      // arm out
      px(x - 20, y - 16, 12, 4, P.skin);
      px(x + 8,  y - 14, 12, 4, P.skin);
      // head resting on side
      px(x - 4, y - 26, 5, 5, P.skin);
      px(x - 7, y - 36, 14, 12, P.skin);
      px(x - 7, y - 36, 14, 5, P.hair);
      px(x - 7, y - 31, 3, 6, P.hair);
      px(x + 3, y - 31, 3, 6, P.hair);
      // little x eyes
      px(x - 2, y - 30, 2, 2, P.brownMid);
      px(x + 2, y - 30, 2, 2, P.brownMid);
      px(x - 1, y - 31, 2, 2, P.brownMid);
      px(x + 1, y - 31, 2, 2, P.brownMid);
      // gap in smile where tooth was
      px(x - 1, y - 26, 5, 2, P.brownMid);
    }
  }

  /* ── Tooth ────────────────────────────────────────────────── */
  function drawTooth(tx, ty) {
    // Simple 5×7 pixel tooth
    px(tx,     ty,     5, 5, P.tooth);
    px(tx,     ty + 5, 2, 2, P.tooth);
    px(tx + 3, ty + 5, 2, 2, P.tooth);
    // shadow
    px(tx + 1, ty + 6, 3, 1, 'rgba(44,26,14,0.3)');
  }

  /* ── Idle animation ──────────────────────────────────────── */
  let idlePhase = 0;

  function drawIdle(ts) {
    clear();
    const groundY = 76;
    drawGround(groundY);
    // slow rolling: board moves slightly left-right for life
    const boardX = 30;
    const boardY = groundY - 10;
    drawBoard(boardX, boardY, 0);
    idlePhase = (ts / 1200) % 1; // complete cycle every 1.2 s
    drawGirl(boardX + 28, boardY, 'ride', idlePhase);

    // wheel spin sparkle dots
    if (Math.sin(ts / 80) > 0.7) {
      px(boardX + 2, groundY - 2, 2, 2, 'rgba(200,131,42,0.4)');
    }

    animFrame = requestAnimationFrame(drawIdle);
  }

  /* ── Trick + fall animation ──────────────────────────────── */
  const TRICK_DURATION = 380;  // ms — jump up and spin
  const FALL_DURATION  = 320;  // ms — falling down
  const TOOTH_GRAVITY  = 0.4;

  function drawTrickAndFall(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const totalDur = TRICK_DURATION + FALL_DURATION;

    clear();
    const groundY = 76;
    drawGround(groundY);

    if (elapsed < TRICK_DURATION) {
      // ── Phase 1: Trick (airborne) ──
      const t = elapsed / TRICK_DURATION;           // 0→1
      // jump arc: up then starts down
      const jumpH = Math.sin(t * Math.PI) * 28;
      const boardY = groundY - 10 - jumpH;
      const boardX = 30;
      // board spins
      const boardAngle = t * Math.PI * 1.5;
      drawBoard(boardX, boardY + 8, boardAngle);
      drawGirl(boardX + 28, boardY, 'trick', 0);

    } else if (elapsed < totalDur) {
      // ── Phase 2: Fall ──
      const t = (elapsed - TRICK_DURATION) / FALL_DURATION; // 0→1
      const fallY = t * t * 18; // quadratic drop
      const boardX = 30;
      const boardY = groundY - 10 + fallY;
      drawBoard(boardX, Math.min(boardY, groundY - 10), 0.8); // board askew
      drawGirl(boardX + 28, groundY - fallY * 0.3, 'fall', 0);

      // Tooth starts flying from frame 0 of fall phase
      if (!toothX) {
        // init tooth position at head
        toothX  = boardX + 34;
        toothY  = groundY - 46;
        toothVx = 3 + Math.random() * 2;
        toothVy = -4 - Math.random() * 2;
      }
      toothX  += toothVx;
      toothY  += toothVy;
      toothVy += TOOTH_GRAVITY;
      if (toothY + 7 < groundY) {
        drawTooth(toothX, toothY);
      } else {
        // tooth landed — draw it on ground
        drawTooth(Math.min(toothX, canvas.width - 8), groundY - 7);
      }

    } else {
      // ── Phase 3: Down — final frame, stop animating ──
      cancelAnimationFrame(animFrame);
      clear();
      drawGround(groundY);
      // board off to the side
      drawBoard(80, groundY - 10, 0.4);
      // girl on the ground
      drawGirl(50, groundY, 'down', 0);
      // tooth resting on ground
      drawTooth(Math.min(toothX || 120, canvas.width - 10), groundY - 7);
      // gap spark where tooth was — little stars
      px(44, groundY - 28, 2, 2, P.ochreLight);
      px(48, groundY - 26, 2, 2, 'rgba(245,237,216,0.6)');

      // Show stats card
      showStats();
      state = 'down';
      return;
    }

    animFrame = requestAnimationFrame(drawTrickAndFall);
  }

  /* ── Build stat pip bars ─────────────────────────────────── */
  function buildPips() {
    document.querySelectorAll('.stat-bar').forEach(function (bar) {
      const fill  = parseInt(bar.dataset.fill, 10);
      const total = 10;
      bar.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const pip = document.createElement('span');
        pip.className = 'stat-bar-pip ' + (i < fill ? 'filled' : 'empty');
        bar.appendChild(pip);
      }
    });
  }

  /* ── Show stats card ─────────────────────────────────────── */
  function showStats() {
    buildPips();
    stats.removeAttribute('hidden');
    // Announce to screen readers
    stats.setAttribute('aria-label', 'Player stats: Skateboarding LVL 1, Fear of losing teeth MAX, Human behavior analysis LVL 99');
  }

  /* ── Reduced-motion: skip to final frame immediately ─────── */
  function skipToDown() {
    cancelAnimationFrame(animFrame);
    clear();
    const groundY = 76;
    drawGround(groundY);
    drawBoard(80, groundY - 10, 0.4);
    drawGirl(50, groundY, 'down', 0);
    drawTooth(120, groundY - 7);
    showStats();
    state = 'down';
  }

  /* ── Start idle loop ─────────────────────────────────────── */
  function startIdle() {
    state     = 'idle';
    startTime = null;
    toothX = toothY = toothVx = toothVy = null;
    stats.setAttribute('hidden', '');
    if (hint) hint.classList.remove('hidden');
    animFrame = requestAnimationFrame(drawIdle);
  }

  /* ── Click / keyboard handler ────────────────────────────── */
  function handleActivate() {
    if (state !== 'idle') return;
    state = 'trick';
    if (hint) hint.classList.add('hidden');
    cancelAnimationFrame(animFrame);
    startTime  = null;
    toothX = toothY = toothVx = toothVy = null;

    if (noMotion) {
      skipToDown();
    } else {
      animFrame = requestAnimationFrame(drawTrickAndFall);
    }
  }

  canvas.addEventListener('click', handleActivate);
  canvas.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  });

  /* ── Reset button ────────────────────────────────────────── */
  if (reset) {
    reset.addEventListener('click', function () {
      cancelAnimationFrame(animFrame);
      startIdle();
    });
  }

  /* ── Boot ────────────────────────────────────────────────── */
  startIdle();

})();
