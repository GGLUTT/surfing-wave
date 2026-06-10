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
     1. HEADER — scroll effect + hamburger
     ============================================================ */
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

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
     9. ACTIVE NAV LINK on scroll (Optimized)
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(function(link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + currentId || (currentId === 'hero' && href === '#')) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.2, rootMargin: '-100px 0px -100px 0px' });

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
     13. WEBGL LIVE BACKGROUND
     ============================================================ */
  const canvas = document.getElementById('bg-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // Set to 1 to fix lag on high-res displays
    camera.position.z = 1.2;

    const vertexShader = `
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        vec3 pos = position;
        pos.y += sin(pos.x * 10.0 + time) * 0.1 * intensity;
        pos.x += cos(pos.y * 8.0 + time * 1.5) * 0.05 * intensity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform float intensity;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vec2 uv = vUv;
        float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 15.0 + time * 0.8);
        noise += sin(uv.x * 35.0 - time * 2.0) * cos(uv.y * 25.0 + time * 1.2) * 0.5;
        vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
        color = mix(color, vec3(1.0), pow(abs(noise), 2.0) * intensity);
        float glow = 1.0 - length(uv - 0.5) * 2.0;
        glow = pow(glow, 2.0);
        gl_FragColor = vec4(color * glow, glow * 0.3); // Reduced opacity slightly for better blending
      }
    `;

    const uniforms = {
      time: { value: 0 },
      intensity: { value: 1.0 },
      color1: { value: new THREE.Color("#021D3C") },
      color2: { value: new THREE.Color("#4BDEDC") }
    };

    const geometry = new THREE.PlaneGeometry(4, 4, 16, 16); // Lowered geometry vertex count for performance
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    function animateBg() {
      requestAnimationFrame(animateBg);
      const elapsedTime = clock.getElapsedTime();
      uniforms.time.value = elapsedTime * 0.5; // Slow down time slightly for calmer waves
      uniforms.intensity.value = 1.0 + Math.sin(elapsedTime * 2) * 0.3;
      renderer.render(scene, camera);
    }
    animateBg();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

})();
