/* ============================================================
   TIDAL NOMAD — script.js
   ============================================================ */

(function () {
  'use strict';

  // --- CUSTOM CURSOR ---
  const cursor = document.getElementById('custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    }, { passive: true });
    
    document.querySelectorAll('a, button, .carousel-stage, .board-item, .play-btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // --- PRELOADER & HERO ANIMATION ---
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
      if (preloader) preloader.classList.add('loaded');
      document.body.classList.add('loaded');
    }, 600); // Minimum 600ms to show the loading animation
  });

  /* ============================================================
     1. HEADER — REMOVED (Replaced by Glow Menu)
     ============================================================ */

  /* ============================================================
     2. SCROLL REVEAL — IntersectionObserver
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.1 + 's';
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ============================================================
     3. HERO PARALLAX — mouse move
     ============================================================ */
  const heroBoard = document.getElementById('hero-board');
  const heroSurfer = document.getElementById('hero-surfer');
  const splashRing = document.getElementById('splash-ring');
  let mouseX = 0, mouseY = 0;
  let rafId = null;

  function updateParallax() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (mouseX - cx) / cx;
    const dy = (mouseY - cy) / cy;

    if (heroBoard) {
      heroBoard.style.transform = 'translateX(' + dx * 8 + 'px) translateY(' + dy * 6 + 'px)';
    }
    if (heroSurfer) {
      heroSurfer.style.transform = 'translateX(' + dx * 14 + 'px) translateY(' + dy * 10 + 'px)';
    }
    if (splashRing) {
      splashRing.style.transform = 'translate(calc(-50% + ' + dx * 5 + 'px), calc(-50% + ' + dy * 4 + 'px))';
    }
    rafId = null;
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  }, { passive: true });

  /* ============================================================
     4. SURFBOARD CAROUSEL
     ============================================================ */
  const boards = [
    {
      name: "TIDAL NOMAD 6'0\"",
      tags: ['LONGBOARD', 'CRUISER'],
      price: '$649',
      img: '/assets/board-1.png'
    },
    {
      name: "TIDAL NOMAD 6'2\"",
      tags: ['ALL ROUND', 'BEGINNER'],
      price: '$729',
      img: '/assets/board-2.png'
    },
    {
      name: "TIDAL NOMAD 6'2\"",
      tags: ['ALL ROUND', 'PERFORMANCE'],
      price: '$799',
      img: '/assets/board-3.png'
    },
    {
      name: "TIDAL NOMAD 6'4\"",
      tags: ['DEEP WATER', 'ADVANCED'],
      price: '$849',
      img: '/assets/board-4.png'
    },
    {
      name: "TIDAL NOMAD 5'10\"",
      tags: ['SHORTBOARD', 'PERFORMANCE'],
      price: '$879',
      img: '/assets/board-5.png'
    }
  ];

  let activeIndex = 2; // center board
  const totalBoards = boards.length;

  const carouselStage = document.getElementById('carousel-stage');
  const boardName = document.getElementById('board-name');
  const boardPrice = document.getElementById('board-price');
  const boardTagsEl = document.querySelector('.board-tags');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  function updateCarousel() {
    const items = carouselStage ? carouselStage.querySelectorAll('.board-item') : [];
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot-btn') : [];

    items.forEach(function (item, i) {
      item.classList.remove('active', 'adjacent');
      const diff = Math.abs(i - activeIndex);
      if (i === activeIndex) {
        item.classList.add('active');
        // Move pedestal to active item
        let pedestal = item.querySelector('.board-pedestal');
        if (!pedestal) {
          pedestal = document.createElement('div');
          pedestal.className = 'board-pedestal';
          pedestal.setAttribute('aria-hidden', 'true');
          item.appendChild(pedestal);
        }
      } else {
        // Remove pedestal from non-active
        const pedestal = item.querySelector('.board-pedestal');
        if (pedestal) pedestal.remove();
        if (diff === 1) item.classList.add('adjacent');
      }
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === activeIndex);
    });

    if (carouselStage) {
      const itemsArr = Array.from(items);
      const activeItem = itemsArr[activeIndex];
      if (activeItem) {
        // Calculate offset to center the active item
        const stageWidth = carouselStage.offsetWidth;
        const activeItemRect = activeItem.getBoundingClientRect();
        const stageRect = carouselStage.getBoundingClientRect();
        
        // This math assumes items have a fixed width and the container is larger
        // For simplicity, we just use a percentage or fixed width offset based on index.
        const centerIndex = 2; // Middle index of 5 items
        const shift = (centerIndex - activeIndex) * 280; // 280px per item
        carouselStage.style.transform = `translateX(${shift}px)`;
        carouselStage.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      }
    }

    // Update product info
    const board = boards[activeIndex];
    if (boardName) boardName.textContent = board.name;
    if (boardPrice) boardPrice.textContent = board.price;
    if (boardTagsEl) {
      boardTagsEl.innerHTML = board.tags
        .map(function (t) { return '<span class="tag">' + t + '</span>'; })
        .join('');
    }
  }

  function goNext() {
    activeIndex = (activeIndex + 1) % totalBoards;
    updateCarousel();
  }

  function goPrev() {
    activeIndex = (activeIndex - 1 + totalBoards) % totalBoards;
    updateCarousel();
  }

  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  // Dot navigation
  if (dotsContainer) {
    dotsContainer.querySelectorAll('.dot-btn').forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        activeIndex = i;
        updateCarousel();
      });
    });
  }

  // Board item click
  if (carouselStage) {
    carouselStage.querySelectorAll('.board-item').forEach(function (item, i) {
      item.addEventListener('click', function () {
        activeIndex = i;
        updateCarousel();
      });
      item.style.cursor = 'pointer';
    });
  }

  // Touch/swipe support
  let touchStartX = 0;
  if (carouselStage) {
    carouselStage.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carouselStage.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goNext(); else goPrev();
      }
    }, { passive: true });
  }

  // Keyboard support
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });

  // Init
  updateCarousel();

  /* ============================================================
     5. TESTIMONIALS CAROUSEL (mobile)
     ============================================================ */
  const testiGrid = document.getElementById('testimonials-grid');
  const testiPrev = document.getElementById('testi-prev');
  const testiNext = document.getElementById('testi-next');

  let testiIndex = 0;
  const testiCards = testiGrid ? Array.from(testiGrid.querySelectorAll('.testi-card')) : [];
  const totalTesti = testiCards.length;

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

  if (testiPrev) {
    testiPrev.addEventListener('click', function () {
      testiIndex = (testiIndex - 1 + totalTesti) % totalTesti;
      updateTesti();
    });
  }
  if (testiNext) {
    testiNext.addEventListener('click', function () {
      testiIndex = (testiIndex + 1) % totalTesti;
      updateTesti();
    });
  }

  window.addEventListener('resize', updateTesti, { passive: true });
  updateTesti();

  /* ============================================================
     6. BOOKING FORM — submit handler
     ============================================================ */
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = bookingForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Booking Sent!';
      btn.style.background = 'linear-gradient(135deg, #2E909D, #4BDEDC)';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        bookingForm.reset();
      }, 3000);
    });
  }

  /* ============================================================
     7. NEWSLETTER FORM
     ============================================================ */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      if (input && input.value) {
        btn.textContent = '✓';
        btn.style.background = '#2E909D';
        input.value = '';
        setTimeout(function () {
          btn.textContent = '→';
          btn.style.background = '';
        }, 2500);
      }
    });
  }

  /* ============================================================
     8. SMOOTH SCROLL for anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 84; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
  /* ============================================================
     9. GLOW MENU ACTIVE STATE & SCROLL
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const glowItems = document.querySelectorAll('.gm-item');

  // Handle click on glow items
  glowItems.forEach(item => {
    item.addEventListener('click', function() {
      glowItems.forEach(el => el.classList.remove('active'));
      this.classList.add('active');
    });
  });

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          glowItems.forEach(function(item) {
            item.classList.remove('active');
            const target = item.getAttribute('data-target');
            if (target === currentId || (currentId === 'hero' && target === 'home')) {
              item.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' });

    sections.forEach(function(section) {
      navObserver.observe(section);
    });
  }
  /* ============================================================
     10. WAVE DIVIDER ANIMATION — subtle horizontal movement
     ============================================================ */
  const waveDividers = document.querySelectorAll('.wave-divider svg path');
  let waveOffset = 0;

  function animateWaves() {
    waveOffset += 0.2;
    waveDividers.forEach(function (path, i) {
      const speed = (i % 2 === 0) ? 0.15 : -0.1;
      const amplitude = 3;
      const y = Math.sin((waveOffset + i * 30) * 0.02) * amplitude;
      path.style.transform = 'translateY(' + y + 'px)';
    });
    requestAnimationFrame(animateWaves);
  }

  requestAnimationFrame(animateWaves);

  /* ============================================================
     11. STAGGERED REVEAL for service cards
     ============================================================ */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.08) + 's';
  });

  /* ============================================================
     12. HERO BOARD — pause parallax during float animation
         (reset transform on mouse leave)
     ============================================================ */
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mouseleave', function () {
      if (heroBoard) heroBoard.style.transform = '';
      if (heroSurfer) heroSurfer.style.transform = '';
      if (splashRing) splashRing.style.transform = 'translate(-50%, -50%)';
    });
  }

  /* ============================================================
     13. HERO SHUTTER TEXT & THEME SWITCH
     ============================================================ */
  
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  }

  // Shutter Text Logic
  const shutterWrap = document.getElementById('shutter-wrap');
  if (shutterWrap) {
    const text = "SURFING";
    shutterWrap.innerHTML = '';
    
    text.split('').forEach((char, i) => {
      const charDiv = document.createElement('div');
      charDiv.className = 'shutter-char';
      
      const mainSpan = document.createElement('span');
      mainSpan.className = 'char-main';
      mainSpan.textContent = char === ' ' ? '\u00A0' : char;
      mainSpan.style.animationDelay = (i * 0.04 + 0.3) + 's';
      
      const slice1 = document.createElement('span');
      slice1.className = 'char-slice slice-top';
      slice1.textContent = char;
      slice1.style.animationDelay = (i * 0.04) + 's';
      
      const slice2 = document.createElement('span');
      slice2.className = 'char-slice slice-mid';
      slice2.textContent = char;
      slice2.style.animationDelay = (i * 0.04 + 0.1) + 's';
      
      const slice3 = document.createElement('span');
      slice3.className = 'char-slice slice-bot';
      slice3.textContent = char;
      slice3.style.animationDelay = (i * 0.04 + 0.2) + 's';
      
      charDiv.appendChild(mainSpan);
      charDiv.appendChild(slice1);
      charDiv.appendChild(slice2);
      charDiv.appendChild(slice3);
      shutterWrap.appendChild(charDiv);
    });
  }

  // Gooey Text Morphing Logic
  const text1 = document.getElementById('gooey-text1');
  const text2 = document.getElementById('gooey-text2');
  
  if (text1 && text2) {
    const texts = ["IS", "NOT JUST", "A SPORT", "IT'S A", "LIFESTYLE"];
    const morphTime = 1.2;
    const cooldownTime = 0.5;

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    text1.textContent = texts[textIndex % texts.length];
    text2.textContent = texts[(textIndex + 1) % texts.length];

    function setMorph(fraction) {
      text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      fraction = 1 - fraction;
      text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    }

    function doCooldown() {
      morph = 0;
      text2.style.filter = "";
      text2.style.opacity = "100%";
      text1.style.filter = "";
      text1.style.opacity = "0%";
    }

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    }

    function animateGooey() {
      requestAnimationFrame(animateGooey);
      let newTime = new Date();
      let shouldIncrementIndex = cooldown > 0;
      let dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          text1.textContent = texts[textIndex % texts.length];
          text2.textContent = texts[(textIndex + 1) % texts.length];
        }
        doMorph();
      } else {
        doCooldown();
      }
    }
    animateGooey();
  }

})();
