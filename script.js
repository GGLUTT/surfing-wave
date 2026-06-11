/* ============================================================
   TIDAL NOMAD — script.js  (performance-optimised)
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     PRELOADER → PAGE READY
     ============================================================ */
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    // Wait for loader bar animation (~1.5s) then hide
    setTimeout(function () {
      if (preloader) preloader.classList.add('loaded');
      // Stagger: add page-ready slightly after fade starts
      setTimeout(function () {
        document.body.classList.add('page-ready');
      }, 200);
    }, 1500);
  });

  /* ============================================================
     1. MOBILE MENU TOGGLE
     ============================================================ */
  const burgerBtn = document.getElementById('mobile-burger-btn');
  const menuOverlay = document.getElementById('mobile-menu-overlay');

  if (burgerBtn && menuOverlay) {
    burgerBtn.addEventListener('click', function () {
      burgerBtn.classList.toggle('open');
      menuOverlay.classList.toggle('open');
      document.body.style.overflow = burgerBtn.classList.contains('open') ? 'hidden' : '';
    });

    menuOverlay.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        burgerBtn.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
     2. SCROLL REVEAL — IntersectionObserver
     ============================================================ */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ============================================================
     3. GLOBAL rAF-THROTTLED SCROLL HANDLER
        (single scroll listener for everything scroll-related)
     ============================================================ */
  var scrollRafPending = false;
  var lastScrollY = window.scrollY;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!scrollRafPending) {
      scrollRafPending = true;
      requestAnimationFrame(function () {
        scrollRafPending = false;
        handleServicesParallax();
        handleNavHighlight();
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============================================================
     4. SURFBOARD CAROUSEL
     ============================================================ */
  var boards = [
    { name: "TIDAL NOMAD 6'0\"", tags: ['LONGBOARD', 'CRUISER'],      price: '$649' },
    { name: "TIDAL NOMAD 6'2\"", tags: ['ALL ROUND', 'BEGINNER'],     price: '$729' },
    { name: "TIDAL NOMAD 6'2\"", tags: ['ALL ROUND', 'PERFORMANCE'],  price: '$799' },
    { name: "TIDAL NOMAD 6'4\"", tags: ['DEEP WATER', 'ADVANCED'],    price: '$849' },
    { name: "TIDAL NOMAD 5'10\"", tags: ['SHORTBOARD', 'PERFORMANCE'], price: '$879' }
  ];

  var activeIndex = 2;
  var totalBoards = boards.length;
  var carouselAnimating = false;

  var carouselStage  = document.getElementById('carousel-stage');
  var boardNameEl    = document.getElementById('board-name');
  var boardPriceEl   = document.getElementById('board-price');
  var boardTagsEl    = document.querySelector('.board-tags');
  var prevBtn        = document.getElementById('carousel-prev');
  var nextBtn        = document.getElementById('carousel-next');
  var dotsContainer  = document.getElementById('carousel-dots');
  var boardInfoEl    = document.getElementById('board-info');

  // Cache step once on first interaction (layout read happens anyway)
  var cachedStep = 0;
  function getStep() {
    if (cachedStep) return cachedStep;
    if (carouselStage) {
      var items = carouselStage.querySelectorAll('.board-item');
      if (items.length > 1) {
        var r0 = items[0].getBoundingClientRect();
        var r1 = items[1].getBoundingClientRect();
        cachedStep = Math.abs(r1.left - r0.left) || 292;
        return cachedStep;
      }
    }
    return 292;
  }
  // Invalidate on resize
  window.addEventListener('resize', function () { cachedStep = 0; }, { passive: true });

  function updateCarousel(skipFade) {
    if (!carouselStage) return;
    var items = carouselStage.querySelectorAll('.board-item');
    var dots  = dotsContainer ? dotsContainer.querySelectorAll('.dot-btn') : [];

    items.forEach(function (item, i) {
      item.classList.remove('active', 'adjacent');
      var diff = Math.abs(i - activeIndex);
      if (i === activeIndex) {
        item.classList.add('active');
        if (!item.querySelector('.board-pedestal')) {
          var ped = document.createElement('div');
          ped.className = 'board-pedestal';
          ped.setAttribute('aria-hidden', 'true');
          item.appendChild(ped);
        }
      } else {
        var ped = item.querySelector('.board-pedestal');
        if (ped) ped.remove();
        if (diff === 1) item.classList.add('adjacent');
      }
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === activeIndex);
    });

    var STEP = getStep();
    var shift = (2 - activeIndex) * STEP;
    carouselStage.style.transform = 'translateX(' + shift + 'px)';

    // Board info fade
    if (boardInfoEl && !skipFade) {
      boardInfoEl.classList.add('switching');
      setTimeout(function () {
        setInfo();
        boardInfoEl.classList.remove('switching');
      }, 180);
    } else {
      setInfo();
    }
  }

  function setInfo() {
    var b = boards[activeIndex];
    if (boardNameEl)  boardNameEl.textContent = b.name;
    if (boardPriceEl) boardPriceEl.textContent = b.price;
    if (boardTagsEl)  boardTagsEl.innerHTML = b.tags.map(function (t) {
      return '<span class="tag">' + t + '</span>';
    }).join('');
  }

  function goNext() {
    if (carouselAnimating) return;
    carouselAnimating = true;
    activeIndex = (activeIndex + 1) % totalBoards;
    updateCarousel();
    setTimeout(function () { carouselAnimating = false; }, 400);
  }

  function goPrev() {
    if (carouselAnimating) return;
    carouselAnimating = true;
    activeIndex = (activeIndex - 1 + totalBoards) % totalBoards;
    updateCarousel();
    setTimeout(function () { carouselAnimating = false; }, 400);
  }

  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  if (dotsContainer) {
    dotsContainer.querySelectorAll('.dot-btn').forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        activeIndex = i;
        updateCarousel();
      });
    });
  }

  if (carouselStage) {
    carouselStage.querySelectorAll('.board-item').forEach(function (item, i) {
      item.addEventListener('click', function () {
        if (i !== activeIndex) { activeIndex = i; updateCarousel(); }
      });
    });

    var touchStartX = 0;
    carouselStage.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carouselStage.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? goNext() : goPrev(); }
    }, { passive: true });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });

  updateCarousel(true); // initial, no fade

  /* ============================================================
     5. TESTIMONIALS CAROUSEL (mobile)
     ============================================================ */
  var testiGrid = document.getElementById('testimonials-grid');
  var testiPrev = document.getElementById('testi-prev');
  var testiNext = document.getElementById('testi-next');
  var testiIndex = 0;
  var testiCards = testiGrid ? Array.from(testiGrid.querySelectorAll('.testi-card')) : [];
  var totalTesti = testiCards.length;

  function isMobile() { return window.innerWidth <= 768; }

  function updateTesti() {
    if (!isMobile()) {
      testiCards.forEach(function (c) { c.style.display = ''; });
      return;
    }
    testiCards.forEach(function (c, i) {
      c.style.display = i === testiIndex ? 'flex' : 'none';
    });
  }

  if (testiPrev) testiPrev.addEventListener('click', function () {
    testiIndex = (testiIndex - 1 + totalTesti) % totalTesti; updateTesti();
  });
  if (testiNext) testiNext.addEventListener('click', function () {
    testiIndex = (testiIndex + 1) % totalTesti; updateTesti();
  });

  window.addEventListener('resize', updateTesti, { passive: true });
  updateTesti();

  /* ============================================================
     6. BOOKING FORM
     ============================================================ */
  var bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = bookingForm.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.textContent = 'Booking Sent!';
      btn.style.background = 'linear-gradient(135deg, #2E909D, #4BDEDC)';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
        bookingForm.reset();
      }, 3000);
    });
  }

  /* ============================================================
     7. SMOOTH SCROLL
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     8. GLOW MENU — nav highlight via IntersectionObserver
     ============================================================ */
  var sections  = document.querySelectorAll('section[id]');
  var glowItems = document.querySelectorAll('.gm-item');

  glowItems.forEach(function (item) {
    item.addEventListener('click', function () {
      glowItems.forEach(function (el) { el.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  function handleNavHighlight() {
    // handled by IntersectionObserver below — no-op here
  }

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          glowItems.forEach(function (item) {
            item.classList.remove('active');
            var t = item.getAttribute('data-target');
            if (t === id || (id === 'hero' && t === 'home')) item.classList.add('active');
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ============================================================
     9. THEME TOGGLE — rAF debounce
     ============================================================ */
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    var themePending = false;
    themeToggle.addEventListener('click', function () {
      if (themePending) return;
      themePending = true;
      requestAnimationFrame(function () {
        document.body.classList.toggle('light-theme');
        themePending = false;
      });
    });
  }

  /* ============================================================
     10. HERO SHUTTER TEXT (runs once)
     ============================================================ */
  var shutterWrap = document.getElementById('shutter-wrap');
  if (shutterWrap) {
    var text = 'SURFING';
    // Clear existing text node but keep sr-only span
    Array.from(shutterWrap.childNodes).forEach(function (n) {
      if (n.nodeType === 3 || (n.nodeType === 1 && !n.classList.contains('sr-only'))) {
        shutterWrap.removeChild(n);
      }
    });

    text.split('').forEach(function (char, i) {
      var charDiv = document.createElement('div');
      charDiv.className = 'shutter-char';

      var main = document.createElement('span');
      main.className = 'char-main';
      main.textContent = char === ' ' ? '\u00A0' : char;
      main.style.animationDelay = (i * 0.04 + 0.3) + 's';

      var s1 = document.createElement('span');
      s1.className = 'char-slice slice-top';
      s1.textContent = char;
      s1.style.animationDelay = (i * 0.04) + 's';

      var s2 = document.createElement('span');
      s2.className = 'char-slice slice-mid';
      s2.textContent = char;
      s2.style.animationDelay = (i * 0.04 + 0.1) + 's';

      var s3 = document.createElement('span');
      s3.className = 'char-slice slice-bot';
      s3.textContent = char;
      s3.style.animationDelay = (i * 0.04 + 0.2) + 's';

      charDiv.appendChild(main);
      charDiv.appendChild(s1);
      charDiv.appendChild(s2);
      charDiv.appendChild(s3);
      shutterWrap.appendChild(charDiv);
    });
  }

  /* ============================================================
     11. GOOEY TEXT MORPHING — uses performance.now(), not Date
     ============================================================ */
  var gText1 = document.getElementById('gooey-text1');
  var gText2 = document.getElementById('gooey-text2');

  if (gText1 && gText2) {
    var texts = ["IS", "NOT JUST", "A SPORT", "IT'S A", "LIFESTYLE"];
    var MORPH_TIME    = 1.2;
    var COOLDOWN_TIME = 0.5;
    var textIndex = texts.length - 1;
    var morph     = 0;
    var cooldown  = COOLDOWN_TIME;
    var lastTime  = performance.now();

    gText1.textContent = texts[textIndex % texts.length];
    gText2.textContent = texts[(textIndex + 1) % texts.length];

    function setMorph(f) {
      gText2.style.filter  = 'blur(' + Math.min(8 / f - 8, 100) + 'px)';
      gText2.style.opacity = (Math.pow(f, 0.4) * 100) + '%';
      f = 1 - f;
      gText1.style.filter  = 'blur(' + Math.min(8 / f - 8, 100) + 'px)';
      gText1.style.opacity = (Math.pow(f, 0.4) * 100) + '%';
    }

    function animateGooey(now) {
      requestAnimationFrame(animateGooey);
      var dt = Math.min((now - lastTime) / 1000, 0.05); // cap dt to avoid jump on tab focus
      lastTime = now;

      var shouldIncrement = cooldown > 0;
      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrement) {
          textIndex = (textIndex + 1) % texts.length;
          gText1.textContent = texts[textIndex % texts.length];
          gText2.textContent = texts[(textIndex + 1) % texts.length];
        }
        morph -= cooldown;
        cooldown = 0;
        var f = morph / MORPH_TIME;
        if (f > 1) { cooldown = COOLDOWN_TIME; f = 1; }
        setMorph(f);
      } else {
        morph = 0;
        gText2.style.filter  = '';
        gText2.style.opacity = '100%';
        gText1.style.filter  = '';
        gText1.style.opacity = '0%';
      }
    }

    requestAnimationFrame(animateGooey);
  }

  /* ============================================================
     12. SERVICES PARALLAX — throttled via global scroll rAF
     ============================================================ */
  var servicesParallax = document.getElementById('services-parallax');
  var parallaxStage    = document.getElementById('parallax-stage');
  var rowLefts         = document.querySelectorAll('.row-left');
  var rowRights        = document.querySelectorAll('.row-right');

  function handleServicesParallax() {
    if (!servicesParallax || !parallaxStage) return;

    var rect = servicesParallax.getBoundingClientRect();
    var vh   = window.innerHeight;
    var progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));

    // Slowed down Y movement
    var ty  = -200 + progress * 400; 
    var rx  = 10  - Math.min(progress / 0.3, 1) * 10;
    var rz  = 10  - Math.min(progress / 0.3, 1) * 10;
    var op  = 0.4 + Math.min(progress / 0.3, 1) * 0.6; // Keep opacity higher initially

    parallaxStage.style.transform = 'rotateX(' + rx + 'deg) rotateZ(' + rz + 'deg) translateY(' + ty + 'px)';
    parallaxStage.style.opacity   = op;

    // Slowed down X movement
    var txL =  -150 + progress * 300;
    var txR =   150 - progress * 300;
    rowLefts.forEach(function (r)  { r.style.transform = 'translateX(' + txL + 'px)'; });
    rowRights.forEach(function (r) { r.style.transform = 'translateX(' + txR + 'px)'; });
  }

  /* ============================================================
     13. WAVE DIVIDER ANIMATION (runs only if elements exist)
     ============================================================ */
  var waveDividers = document.querySelectorAll('.wave-divider svg path');
  if (waveDividers.length) {
    var waveOffset = 0;
    function animateWaves() {
      waveOffset += 0.2;
      waveDividers.forEach(function (path, i) {
        var y = Math.sin((waveOffset + i * 30) * 0.02) * 3;
        path.style.transform = 'translateY(' + y + 'px)';
      });
      requestAnimationFrame(animateWaves);
    }
    requestAnimationFrame(animateWaves);
  }

})();
