gsap.registerPlugin(ScrollTrigger);

// ============================================
// LENIS SMOOTH SCROLL
// ============================================
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1.3,
  infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) { lenis.scrollTo(value, { immediate: true }); }
    return lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
  pinType: document.body.style.transform ? 'transform' : 'fixed',
});

// ============================================
// NAV LERP SYSTEM
// ============================================
const mainNav = document.getElementById('mainNav');

if (mainNav) {
  const navInner      = mainNav.querySelector('.nav-inner');
  const NAV_H_DESKTOP = { max: 92, min: 58 };
  const NAV_H_MOBILE  = { max: 56, min: 44 };
  const isMobileNav   = () => window.innerWidth < 768;

  let currentH = isMobileNav() ? NAV_H_MOBILE.max : NAV_H_DESKTOP.max;
  let targetH  = currentH;

  mainNav.style.background = 'rgba(0, 36, 59, 1)';

  function lerpNav(a, b, t) { return a + (b - a) * t; }

  (function navTick() {
    currentH = lerpNav(currentH, targetH, 0.08);
    if (navInner) navInner.style.height = currentH.toFixed(2) + 'px';
    requestAnimationFrame(navTick);
  })();

  lenis.on('scroll', ({ scroll }) => {
    const h = isMobileNav() ? NAV_H_MOBILE : NAV_H_DESKTOP;
    targetH = scroll < 80 ? h.max : h.min;
  });

  window.addEventListener('resize', () => {
    currentH = isMobileNav() ? NAV_H_MOBILE.max : NAV_H_DESKTOP.max;
    targetH  = currentH;
  });
}

// ============================================
// MOBILE MENU — PANEL SYSTEM
// ============================================
const hamburger      = document.getElementById('hamburger');
const mobileMenu     = document.getElementById('mobileMenu');
const mobMain        = document.getElementById('mobMain');
const mobServices    = document.getElementById('mobServices');
const mobClose       = document.getElementById('mobClose');
const mobBack        = document.getElementById('mobBack');
const mobServicesBtn = document.getElementById('mobServicesBtn');
const blurOverlay    = document.getElementById('navBlurOverlay');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  mobMain.classList.add('active');
  mobServices.classList.remove('active');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobMain.classList.remove('active');
  mobServices.classList.remove('active');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
}

if (mobClose) {
  mobClose.addEventListener('click', closeMobileMenu);
}

document.querySelectorAll('.mob-close-sub').forEach(btn => {
  btn.addEventListener('click', closeMobileMenu);
});

if (mobServicesBtn) {
  mobServicesBtn.addEventListener('click', () => {
    mobMain.classList.remove('active');
    mobServices.classList.add('active');
  });
}

if (mobBack) {
  mobBack.addEventListener('click', () => {
    mobServices.classList.remove('active');
    mobMain.classList.add('active');
  });
}

// ============================================
// DESKTOP DROPDOWN — BLUR OVERLAY
// ============================================
const dropdownItems = document.querySelectorAll('.nav-menu > li.has-dropdown');

dropdownItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    blurOverlay.classList.add('active');
  });
  item.addEventListener('mouseleave', () => {
    blurOverlay.classList.remove('active');
  });
});




// ============================================
// ACTIVE NAV LINK — CURRENT PAGE DETECTION
// ============================================
(function () {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Desktop nav
  document.querySelectorAll('.nav-menu > li > a').forEach(link => {
    link.classList.remove('active');
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // Mobile nav
  document.querySelectorAll('.mob-nav-list > li').forEach(item => {
    item.classList.remove('mob-active');
    const link = item.querySelector('a');
    if (link) {
      const linkPath = link.getAttribute('href').split('/').pop();
      if (linkPath === currentPath) {
        item.classList.add('mob-active');
      }
    }
  });
})();


// ============================================
// BANNER 
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  function lerp(a, b, t) { return a + (b - a) * t; }

  // Rain drops
  document.querySelectorAll('.rain-drop').forEach((drop, i) => {
    gsap.set(drop, {
      y: '-100%', opacity: 0,
      background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)',
    });
    setTimeout(() => rainLoop(drop), i * 600 + Math.random() * 1500);
  });

  function rainLoop(drop) {
    const duration  = 3.2 + Math.random() * 1.6;
    const nextDelay = 1.0 + Math.random() * 1.4;
    gsap.fromTo(drop,
      { y: '-100%', opacity: 0 },
      {
        y: '200%', duration, ease: 'none',
        onStart() {
          gsap.to(drop, { opacity: 1, duration: 0.3, ease: 'power1.out' });
          gsap.to(drop, { opacity: 0, duration: duration * 0.28, delay: duration * 0.72, ease: 'power1.in', overwrite: false });
        },
        onComplete() {
          gsap.set(drop, { opacity: 0, y: '-100%' });
          setTimeout(() => rainLoop(drop), nextDelay * 1000);
        }
      }
    );
  }



  
  // Magnetic Glow 
  document.querySelectorAll('[data-glow-section]').forEach(section => {
    const glow = section.querySelector('[data-glow-el]');
    if (!glow) return;

    const HOME_X = parseFloat(section.dataset.homeX ?? 70);
    const HOME_Y = parseFloat(section.dataset.homeY ?? 50);
    const MAGNETIC_RADIUS = 0.38;

    let curX = HOME_X, curY = HOME_Y;
    let mouseInside = false;
    let satX = 0, satY = 0, targetSatX = 0, targetSatY = 0;

    const sat = document.createElement('div');
    sat.style.cssText = `
      position:absolute; pointer-events:none; z-index:1;
      width:220px; height:220px; border-radius:50%;
      transform:translate(-50%,-50%);
      background:radial-gradient(circle,rgba(7,106,171,0.55) 0%,rgba(7,106,171,0.15) 40%,transparent 70%);
      filter:blur(18px); opacity:0; transition:opacity 0.3s ease; left:0; top:0;
    `;
    section.insertBefore(sat, section.firstChild);

    gsap.to(glow, { opacity: 1, duration: 1.5, ease: 'power2.inOut', delay: 0.3 });

    section.addEventListener('mousemove', (e) => {
      mouseInside = true;
      sat.style.opacity = '0.85';
      const rect = section.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top)  / rect.height;
      targetSatX = e.clientX - rect.left;
      targetSatY = e.clientY - rect.top;
      const dist = Math.sqrt((mx - HOME_X / 100) ** 2 + (my - HOME_Y / 100) ** 2);
      if (dist < MAGNETIC_RADIUS) {
        const pull = 1 - dist / MAGNETIC_RADIUS;
        curX = lerp(curX, HOME_X + (mx * 100 - HOME_X) * 0.18 * (1 - pull), 0.07);
        curY = lerp(curY, HOME_Y + (my * 100 - HOME_Y) * 0.18 * (1 - pull), 0.07);
      } else {
        curX = lerp(curX, HOME_X + (mx * 100 - HOME_X) * 0.32, 0.06);
        curY = lerp(curY, HOME_Y + (my * 100 - HOME_Y) * 0.32, 0.06);
      }
    });

    section.addEventListener('mouseleave', () => {
      mouseInside = false;
      gsap.to(sat, { opacity: 0, duration: 0.6, ease: 'power2.out' });
    });

    (function tick() {
      const rect = section.getBoundingClientRect();
      if (mouseInside) {
        satX = lerp(satX, targetSatX, 0.09);
        satY = lerp(satY, targetSatY, 0.09);
        const dPx = Math.sqrt(
          (satX - (curX / 100) * rect.width)  ** 2 +
          (satY - (curY / 100) * rect.height) ** 2
        );
        const threshold = rect.width * MAGNETIC_RADIUS * 0.5;
        if (dPx < threshold) {
          const fade = dPx / threshold;
          sat.style.opacity = (fade * 0.85).toFixed(3);
          const size = 160 + (1 - fade) * 60;
          sat.style.width = sat.style.height = size + 'px';
        } else {
          sat.style.opacity = '0.85';
          sat.style.width = sat.style.height = '220px';
        }
        sat.style.left = satX + 'px';
        sat.style.top  = satY + 'px';
      } else {
        curX = lerp(curX, HOME_X, 0.04);
        curY = lerp(curY, HOME_Y, 0.04);
      }
      glow.style.background = `radial-gradient(40% 55% at ${curX.toFixed(2)}% ${curY.toFixed(2)}%, #076AAB 0%, transparent 100%)`;
      requestAnimationFrame(tick);
    })();
  });

});






// NICHE CARDS
gsap.utils.toArray('.niche-item').forEach((card) => {
  const img      = card.querySelector('.niche-item-image img');
  const iconWrap = card.querySelector('.niche-item-image > div');
  if (!img || !iconWrap) return;

  gsap.fromTo(img,
    { clipPath: 'inset(0 100% 0 0 round 24px)' },
    { clipPath: 'inset(0 0% 0 0 round 24px)', duration: 1, ease: 'power3.inOut',
      scrollTrigger: { trigger: card, scroller: document.body, start: 'top 85%', once: true } }
  );

  gsap.set(iconWrap, { y: -16, opacity: 0, scale: 0.8 });

  ScrollTrigger.create({
    trigger: card, scroller: document.body, start: 'top 85%', once: true,
    onEnter: () => {
      gsap.to(iconWrap, { y: 0, opacity: 1, scale: 1, duration: 0.55, delay: 0.5, ease: 'back.out(1.7)' });
    },
  });

  card.addEventListener('mousemove', (e) => {
    const rect  = iconWrap.getBoundingClientRect();
    const dx    = e.clientX - (rect.left + rect.width  / 2);
    const dy    = e.clientY - (rect.top  + rect.height / 2);
    const dist  = Math.sqrt(dx * dx + dy * dy);
    if (dist < 130) {
      const pull  = (1 - dist / 130) * 16;
      const angle = Math.atan2(dy, dx);
      gsap.to(iconWrap, { x: Math.cos(angle) * pull, y: Math.sin(angle) * pull, scale: 1.1, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.to(iconWrap, { x: 0, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    }
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(iconWrap, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});



// GAME CHANGER — CIRCLE REVEAL
window.addEventListener('load', () => {
  const gcSection = document.querySelector('.game-changer');
  const gcWrapper = document.querySelector('.game-changer-wrapper');
  if (!gcSection || !gcWrapper) return;

  gsap.set(gcSection, {
    scale: 0.85,
    transformOrigin: '50% 50%'
  });

  ScrollTrigger.create({
    trigger: gcWrapper,
    start: 'top bottom',
    end: 'top 30%',
    scrub: 2,
    invalidateOnRefresh: true,
    onUpdate(self) {
      gsap.set(gcSection, {
        scale: 0.85 + self.progress * 0.15
      });
    }
  });
});


// PROVEN RESULTS 
(function initProvenStack() {
  const cards = gsap.utils.toArray('.proven-result-wrap');
  if (cards.length === 0) return;

  function getStackConfig() {
    const w = window.innerWidth;
    if (w < 640)  return { base: 80,  step: 0 };
    if (w < 1024) return { base: 120, step: 0 };
    return                { base: 160, step: 0 };
  }

  function setCardTops() {
    const { base, step } = getStackConfig();
    cards.forEach((card, i) => { card.style.top = (base + i * step) + 'px'; });
  }

  setCardTops();
  window.addEventListener('resize', () => { setCardTops(); ScrollTrigger.refresh(); });

  gsap.set(cards, { y: 60, opacity: 0, scale: 0.97, transformOrigin: 'top center', transformPerspective: 1200 });

  // Common title pin
  const commonTitle = document.querySelector('.proven-result .common-title');
  if (commonTitle) {
    ScrollTrigger.create({
      trigger: '.proven-section',
      scroller: document.body,
      start: 'top top',
      end: 'bottom bottom',
      pin: commonTitle,
      pinSpacing: false,
    });
  }

cards.forEach((card, i) => {
    gsap.to(card, {
      y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.3)', delay: i * 0.06,
      scrollTrigger: { trigger: card, scroller: document.body, start: 'top 85%', once: true },
    });

if (i > 0) {
  ScrollTrigger.create({
    trigger: card, scroller: document.body, start: 'top 60%', once: true,
    onEnter: () => {}
  });
}
  });
})();



// blog img start
(function initBlogReveal() {
    const section = document.querySelector('.article');
    if (!section) return;

    const cards = gsap.utils.toArray('.article .grid > div');
    if (!cards.length) return;

  
    cards.forEach((card) => {
        const img = card.querySelector('.blog-reveal-img');
        const wrap = card.querySelector('.blog-img');
        if (wrap) wrap.style.overflow = 'hidden';
        if (img) gsap.set(img, { xPercent: -105 });
    });

    let hasRevealed = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasRevealed) {
                    hasRevealed = true;

                    cards.forEach((card, i) => {
                        const img = card.querySelector('.blog-reveal-img');
                        if (!img) return;

                        gsap.to(img, {
                            xPercent: 0,
                            duration: 0.85,
                            delay: i * 0.2,
                            ease: 'power3.inOut',
                        });
                    });
                }
            });
        },
        {
            threshold: 0.25, 
        }
    );

    observer.observe(section);
})();
// blog img end



// select start

document.querySelectorAll('select').forEach(select => {
    
    if (select.hasAttribute('data-toc-select')) return;

    if (select.value === '') {
        select.style.color = '#92B9D2';
    }
    select.addEventListener('change', function () {
        this.style.color = this.value === '' ? '#92B9D2' : '#ffffff';
    });
});


//select end



// COMMON SHAPE RIPPLE 
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.common-shape').forEach(function (shapeEl, index) {

    var filterId = 'ripple-filter-' + index;
    var turbId   = 'ripple-turb-'   + index;
    var dispId   = 'ripple-disp-'   + index;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    svg.innerHTML =
      '<defs>' +
        '<filter id="' + filterId + '" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feTurbulence' +
            ' id="' + turbId + '"' +
            ' type="turbulence"' +
            ' baseFrequency="0.015 0.015"' +
            ' numOctaves="2"' +
            ' seed="' + (index * 7 + 2) + '"' +
            ' result="turbulence"' +
          '/>' +
          '<feDisplacementMap' +
            ' id="' + dispId + '"' +
            ' in="SourceGraphic"' +
            ' in2="turbulence"' +
            ' scale="0"' +
            ' xChannelSelector="R"' +
            ' yChannelSelector="G"' +
          '/>' +
        '</filter>' +
      '</defs>';
    document.body.appendChild(svg);

    var bg = shapeEl.querySelector('.common-shape-bg');
    if (bg) bg.style.filter = 'url(#' + filterId + ')';

    var turb = document.getElementById(turbId);
    var disp = document.getElementById(dispId);
    if (!turb || !disp) return;

    var phase      = index * 1.2;
    var dropScale  = 0;
    var isDropping = false;

    function animate() {
      phase += 0.008;
      if (isDropping) {
        dropScale += 1.8;
        if (dropScale >= 18) isDropping = false;
      } else {
        dropScale *= 0.92;
      }
      var freqX = 0.012 + Math.sin(phase)       * 0.006;
      var freqY = 0.012 + Math.cos(phase * 0.8) * 0.006;
      turb.setAttribute('baseFrequency', freqX.toFixed(4) + ' ' + freqY.toFixed(4));
      turb.setAttribute('seed', Math.floor(phase * 30) % 999);
      var scale = dropScale + Math.sin(phase * 2) * 2 + 2;
      disp.setAttribute('scale', scale.toFixed(2));
      requestAnimationFrame(animate);
    }

    animate();

    function triggerDrop() { isDropping = true; dropScale = 0; }

    setTimeout(triggerDrop, 300 + index * 300);
    setInterval(triggerDrop, 1500);
    shapeEl.addEventListener('mouseenter', triggerDrop);
  });
});



// TESTIMONIAL SLIDER
// ============================================
function initContentTestimonialSlider() {
  if (!document.getElementById('testimonialSlider')) return;

  const arrowSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.1716 6.77822L6.8076 1.41421L8.2218 0L16 7.77822L8.2218 15.5563L6.8076 14.1421L12.1716 8.77822H0V6.77822H12.1716Z"/>
  </svg>`;

  const testimonialSplide = new Splide('#testimonialSlider', {
    type: 'loop', perPage: 2, perMove: 1, gap: '2rem',
    autoplay: true, interval: 4000, pauseOnHover: true,
    arrows: true, pagination: false,
    breakpoints: { 1024: { perPage: 1, gap: '1.5rem' } }
  });

  testimonialSplide.mount();

  const testimonialWrapper = document.getElementById('testimonialSlider').closest('.content-our-testimonial');
  if (!testimonialWrapper) return;

  const originalArrows           = testimonialWrapper.querySelector('.splide__arrows');
  const testimonialArrowsDesktop = testimonialWrapper.querySelector('.testimonial-real-content-slider-arrows-desktop');
  const testimonialArrowsMobile  = testimonialWrapper.querySelector('.testimonial-real-content-slider-arrows-mobile');

  if (!originalArrows || !testimonialArrowsDesktop || !testimonialArrowsMobile) return;

  testimonialArrowsDesktop.innerHTML = originalArrows.innerHTML;
  testimonialArrowsMobile.innerHTML  = originalArrows.innerHTML;

  [testimonialArrowsDesktop, testimonialArrowsMobile].forEach(container => {
    container.querySelectorAll('.splide__arrow').forEach(arrow => { arrow.innerHTML = arrowSVG; });
    const prevBtn = container.querySelector('.splide__arrow--prev');
    const nextBtn = container.querySelector('.splide__arrow--next');
    if (prevBtn) prevBtn.addEventListener('click', () => testimonialSplide.go('<'));
    if (nextBtn) nextBtn.addEventListener('click', () => testimonialSplide.go('>'));
  });

  originalArrows.style.display = 'none';
}

initContentTestimonialSlider();


// ============================================
// FAQ
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const trigger   = item.querySelector('.faq-trigger');
    const content   = item.querySelector('.faq-content');
    const border    = item.querySelector('.faq-border');
    const iconClose = item.querySelector('.icon-close');
    if (!trigger) return;

    if (iconClose) {
      iconClose.style.transition = 'transform 0.5s ease-in-out';
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const oc = other.querySelector('.faq-content');
          const ob = other.querySelector('.faq-border');
          const oC = other.querySelector('.icon-close');
          if (oc) oc.style.maxHeight = '0';
          if (ob) ob.classList.add('hidden');
          if (oC) oC.style.transform = 'rotate(0deg)';
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        if (content)   content.style.maxHeight = '0';
        if (border)    border.classList.add('hidden');
        if (iconClose) iconClose.style.transform = 'rotate(0deg)';
      } else {
        item.classList.add('active');
        if (content)   content.style.maxHeight = content.scrollHeight + 'px';
        if (border)    border.classList.remove('hidden');
        if (iconClose) iconClose.style.transform = 'rotate(45deg)';
      }
    });
  });
}

function initFAQGrid() {
  const wrap = document.getElementById('faqGridWrap');
  if (!wrap) return;

  const items = Array.from(wrap.querySelectorAll('.faq-item'));
  if (items.length === 0) return;

  const leftCol  = document.createElement('div');
  const rightCol = document.createElement('div');
  leftCol.className  = 'flex flex-col gap-0 w-full md:w-1/2';
  rightCol.className = 'flex flex-col gap-0 w-full md:w-1/2';

  items.forEach((item, i) => {
    if (i % 2 === 0) leftCol.appendChild(item);
    else             rightCol.appendChild(item);
  });

  wrap.innerHTML = '';
  wrap.className = 'flex flex-col md:flex-row md:gap-8 items-start';
  wrap.appendChild(leftCol);
  wrap.appendChild(rightCol);
}

document.addEventListener('DOMContentLoaded', () => {
  initFAQGrid();
  initFAQ();
});




// PARTNER SLIDER
document.addEventListener('DOMContentLoaded', () => {
  const partnerSliderEl = document.getElementById('partner-slider');
  if (!partnerSliderEl || typeof Splide === 'undefined') return;

  const partnerSplide = new Splide('#partner-slider', {
    type: 'loop', drag: 'free', focus: 'center',
    perPage: 6, gap: '0px', arrows: false, pagination: false,
    autoScroll: { speed: 1, pauseOnHover: true, pauseOnFocus: false },
    breakpoints: {
      1280: { perPage: 5 }, 1024: { perPage: 4 },
      768: { perPage: 3 },  640: { perPage: 2, gap: '8px' }
    }
  });

  if (window.splide && window.splide.Extensions) {
    partnerSplide.mount(window.splide.Extensions);
  } else {
    partnerSplide.mount();
  }
});





const lottieMap = new Map();

document.querySelectorAll('.logo-lottie-hover').forEach((el) => {
    const animPath = el.getAttribute('data-animation');
    if (!animPath) return;

    const anim = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: animPath
    });

    anim.addEventListener('DOMLoaded', () => {
        anim.goToAndStop(anim.totalFrames - 1, true);
    });

    anim.addEventListener('complete', () => {
        anim.goToAndStop(anim.totalFrames - 1, true);
    });

    lottieMap.set(el, anim);
});





// icon global animation
const iconGroups = new Map();

document.querySelectorAll('.anim-icon').forEach((icon) => {
    if (icon.querySelector('.lottie-hover')) return;

    const lottieEl = icon.querySelector('.logo-lottie-hover');
    const img      = lottieEl ? null : icon.querySelector('img');

    if (!img && !lottieEl) return;

    const target = lottieEl || img;

  
    gsap.set(target, {
        clipPath: 'circle(0% at 50% 50%)',
        scale: 0.6,
        transformOrigin: 'center center',
    });

    if (lottieEl) {
        gsap.set(lottieEl.querySelectorAll('svg'), {
            clearProps: 'all'
        });
    }

    const parent = icon.closest('.grid, [class*="grid"]') || icon.parentElement;

    if (!iconGroups.has(parent)) {
        iconGroups.set(parent, []);
    }
    iconGroups.get(parent).push({ icon, target, lottieEl });
});


iconGroups.forEach((items, parent) => {
    const targets = items.map(item => item.target);

    const animateIn = () => {
        gsap.to(targets, {
            clipPath: 'circle(75% at 50% 50%)',
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.4)',
            stagger: 0.1,
        });
    };

    const animateOut = () => {
        gsap.to(targets, {
            clipPath: 'circle(0% at 50% 50%)',
            scale: 0.6,
            duration: 0.4,
            ease: 'power2.in',
            stagger: 0.05,
        });
    };

    ScrollTrigger.create({
        trigger: parent,
        start: 'top 85%',
        end: 'bottom 15%',
        once: false,
        onEnter:     animateIn,
        onEnterBack: animateIn,
        onLeave:     animateOut,
        onLeaveBack: animateOut,
    });

    items.forEach(({ icon, target, lottieEl }) => {
        const logoItem = icon.closest('.logo-item') || icon;

        logoItem.addEventListener('mouseenter', () => {
            if (lottieEl && lottieMap.has(lottieEl)) {
                lottieMap.get(lottieEl).goToAndPlay(0, true);
            }
        });
    });
});





//single service rolling animation
(function () {
    // Count items dynamically instead of hardcoding
    const TOTAL = document.querySelectorAll('.strategy-item').length;

    // Responsive BOX_H
    function getBoxH() {
        if (window.innerWidth <= 776) return 56;
        if (window.innerWidth <= 1024) return 62;
        return 90;
    }

    let BOX_H = getBoxH();

    const roller = document.getElementById('numRoller');
    if (!roller) return;
    const numBox = roller.closest('.sticky');
    if (!numBox) return;
    let currentNum = 0;
    let isHovering = false;

    // CSS inject
    const style = document.createElement('style');
    style.textContent = `
        .strategy-item {
            transition: background 0.4s ease, padding-left 0.3s ease;
            
            padding-left: 5px;
            cursor: default;
        }
        .strategy-item:hover {
            // background: radial-gradient(50% 50% at 50% 50%, rgba(42,143,210,0.08) 0%, rgba(7,106,171,0.08) 100%);
            padding-left: 5px;
        }
        .strategy-item h3,
        .strategy-item p {
            transition: color 0.3s ease;
        }
        .num-box-inner {
            transition: background 0.5s ease, border-color 0.5s ease;
        }
        .num-box-inner.hovered {
            background: radial-gradient(50% 50% at 50% 50%, #2A8FD2 0%, #076AAB 100%);
            border-color: transparent;
        }
        .num-digit-el {
            transition: color 0.4s ease;
        }
        .num-digit-el.white {
            color: #fff !important;
        }
    `;
    document.head.appendChild(style);

    numBox.classList.add('num-box-inner');

    function buildRoller() {
        roller.innerHTML = '';
        for (let i = 1; i <= TOTAL; i++) {
            const div = document.createElement('div');
            div.className = 'num-digit-el';

            let fontSize = '52px';
            if (BOX_H <= 56) fontSize = '32px';
            else if (BOX_H <= 62) fontSize = '42px';

            div.style.cssText = `
                width: ${BOX_H}px;
                height: ${BOX_H}px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${fontSize};
                font-weight: 700;
                color: #fff;
                flex-shrink: 0;
            `;
            div.textContent = i;
            roller.appendChild(div);
        }
    }

    function setDigitColors(white) {
        document.querySelectorAll('.num-digit-el').forEach(d => {
            d.style.color = white ? '#fff' : '#fff';
        });
    }

    function rollTo(num) {
        if (num === currentNum) return;
        currentNum = num;
        roller.style.transform = `translateY(-${(num - 1) * BOX_H}px)`;
    }

    function getActiveNum() {
        const items = document.querySelectorAll('.strategy-item');
        let activeNum = 1;
        let bestRatio = 0;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const visiblePx = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const ratio = visiblePx / rect.height;
            if (ratio > bestRatio) {
                bestRatio = ratio;
                activeNum = parseInt(item.dataset.num, 10);
            }
        });

        return activeNum;
    }

    function onScroll() {
        if (!isHovering) {
            rollTo(getActiveNum());
        }
    }

    // Hover interaction
    const items = document.querySelectorAll('.strategy-item');
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            isHovering = true;
            const num = parseInt(item.dataset.num, 10);
            numBox.classList.add('hovered');
            setDigitColors(true);
            roller.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
            rollTo(num);
        });

        item.addEventListener('mouseleave', () => {
            isHovering = false;
            numBox.classList.remove('hovered');
            setDigitColors(false);
            roller.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            rollTo(getActiveNum());
        });
    });

    // Rebuild on resize
    window.addEventListener('resize', () => {
        const newBoxH = getBoxH();
        if (newBoxH === BOX_H) return;
        BOX_H = newBoxH;
        buildRoller();
        roller.style.transition = 'none';
        roller.style.transform = `translateY(-${(currentNum - 1) * BOX_H}px)`;
        setTimeout(() => {
            roller.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 100);
    });

    // Init
    buildRoller();
    roller.style.transition = 'none';
    roller.style.transform = 'translateY(0)';
    currentNum = 1;

    setTimeout(() => {
        roller.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 100);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();





//footer animation

(function () {
    const footer = document.getElementById('animatedFooter');
    const gradientBg = document.getElementById('footerGradientBg');

    if (!footer || !gradientBg) return;

    function updateScrollGradient() {
        const rect = footer.getBoundingClientRect();
        const windowH = window.innerHeight;
        const footerH = footer.offsetHeight;

        const progress = Math.min(
            Math.max((windowH - rect.top) / (windowH + footerH), 0),
            1
        );

        const yPos = -10 + progress * 60;
        const size = 40 + progress * 30;
        const opacity = Math.min(progress * 2, 1);

        gradientBg.style.background = `radial-gradient(
            ${size}% ${size}% at 50% ${yPos}%,
            rgba(7, 106, 171, ${opacity}) 0%,
            transparent 70%
        )`;
    }

    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let rafId = null;
    let isMouseInFooter = false;

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function animateMouseGradient() {
        currentX = lerp(currentX, targetX, 0.03);
        currentY = lerp(currentY, targetY, 0.03);

        const rect = footer.getBoundingClientRect();
        const windowH = window.innerHeight;
        const footerH = footer.offsetHeight;
        const scrollProgress = Math.min(
            Math.max((windowH - rect.top) / (windowH + footerH), 0),
            1
        );

        const size = 40 + scrollProgress * 30;
        const opacity = Math.min(scrollProgress * 2, 1);

        gradientBg.style.background = `radial-gradient(
            ${size}% ${size}% at ${currentX}% ${currentY}%,
            rgba(7, 106, 171, ${opacity}) 0%,
            transparent 70%
        )`;

        rafId = requestAnimationFrame(animateMouseGradient);
    }

    // ✅ FIXED mouseenter — mouse এর exact position থেকে শুরু করবে
    footer.addEventListener('mouseenter', (e) => {
        isMouseInFooter = true;

        const rect = footer.getBoundingClientRect();
        currentX = ((e.clientX - rect.left) / rect.width) * 100;
        currentY = ((e.clientY - rect.top) / rect.height) * 100;
        targetX = currentX;
        targetY = currentY;

        if (rafId) cancelAnimationFrame(rafId);
        animateMouseGradient();
    });

    footer.addEventListener('mousemove', (e) => {
        const rect = footer.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width) * 100;
        targetY = ((e.clientY - rect.top) / rect.height) * 100;
    });

    // ✅ FIXED mouseleave — cleanly center এ ফিরে যাবে
    footer.addEventListener('mouseleave', () => {
        isMouseInFooter = false;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;

        targetX = 50;
        targetY = 50;

        function returnToCenter() {
            currentX = lerp(currentX, 50, 0.025);
            currentY = lerp(currentY, 50, 0.025);

            updateScrollGradient();

            if (Math.abs(currentX - 50) > 0.1 || Math.abs(currentY - 50) > 0.1) {
                rafId = requestAnimationFrame(returnToCenter);
            } else {
                rafId = null;
            }
        }
        returnToCenter();
    });

    window.addEventListener('scroll', () => {
        if (!isMouseInFooter) {
            updateScrollGradient();
        }
    }, { passive: true });

    updateScrollGradient();
})();








// json animation
// json animation
// json animation
// json animation — lottie-hover (why-need-card + servicecommon-item)
const lottieItems = document.querySelectorAll(".lottie-hover");

lottieItems.forEach((item) => {
  const animation = lottie.loadAnimation({
    container: item,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: item.dataset.animation
  });

  animation.addEventListener("DOMLoaded", () => {
    animation.goToAndStop(animation.totalFrames - 1, true);
  });

  const card = item.closest(".why-need-card") || item.closest(".servicecommon-item");
  if (!card) return;

  card.addEventListener("mouseenter", () => {
    animation.goToAndStop(0, true);
    animation.setDirection(1);
    animation.play();
  });
});
//logo animation on hover


//logo animation atuo

document.querySelectorAll('.logo-lottie-auto').forEach((el) => {
    const animPath = el.getAttribute('data-animation');
    if (!animPath) return;

    const anim = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animPath
    });
});


// ============================================
// SERVICE CARD ICON ANIMATION
// ============================================
// ============================================
// SERVICE CARD ICON ANIMATION
// ============================================
(function () {
  const cards = document.querySelectorAll('.servicecommon-item');
  if (!cards.length) return;

  const style = document.createElement('style');
  style.textContent = `
    .comon-service-box-icon {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      will-change: transform;
    }
    .comon-service-box-icon img {
      display: block;
      transition: transform 0.15s ease;
      will-change: transform;
    }
    .svc-icon-ring {
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 1.5px solid rgba(42, 143, 210, 0);
      pointer-events: none;
      transform: scale(0.6);
      transition: none;
    }
    .svc-icon-glow {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(42,143,210,0.25) 0%, transparent 70%);
      opacity: 0;
      pointer-events: none;
      transform: scale(0.5);
      transition: none;
    }
  `;
  document.head.appendChild(style);

  cards.forEach(card => {
    const iconWrap = card.querySelector('.comon-service-box-icon');
    if (!iconWrap) return;

    const img      = iconWrap.querySelector('img');
    const lottieEl = iconWrap.querySelector('.lottie-hover');
    if (!img && !lottieEl) return;

    // ring + glow inject
    const ring = document.createElement('span');
    ring.className = 'svc-icon-ring';
    const glow = document.createElement('span');
    glow.className = 'svc-icon-glow';
    iconWrap.appendChild(ring);
    iconWrap.appendChild(glow);

    let rafId = null, mouseX = 0, mouseY = 0, curX = 0, curY = 0, inside = false;

    // img clipPath reveal
    if (img) {
      gsap.set(img, { clipPath: 'inset(0 100% 0 0 round 8px)', opacity: 0 });
    }

    ScrollTrigger.create({
      trigger: card,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        if (img) {
          gsap.to(img, {
            clipPath: 'inset(0 0% 0 0 round 8px)', opacity: 1,
            duration: 0.7, ease: 'power3.inOut',
            onComplete: () => gsap.set(img, { clearProps: 'clipPath,opacity' })
          });
        }
        gsap.fromTo(ring,
          { scale: 0.6, opacity: 0, borderColor: 'rgba(42,143,210,0.8)' },
          { scale: 1.6, opacity: 0, borderColor: 'rgba(42,143,210,0)', duration: 0.8, ease: 'power2.out' }
        );
      }
    });

    // lerp tick — img only
    function tick() {
      if (!inside || !img) return;
      curX += (mouseX - curX) * 0.08;
      curY += (mouseY - curY) * 0.08;
      const rect = iconWrap.getBoundingClientRect();
      const cx = rect.width / 2, cy = rect.height / 2;
      const dx = curX - cx, dy = curY - cy;
      const maxR = Math.max(rect.width, rect.height) * 0.7;
      const pull = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / maxR);
      gsap.set(img, {
        x: (dx / maxR) * 6 * pull,
        y: (dy / maxR) * 6 * pull,
        scale: 1 + pull * 0.08,
        transformOrigin: 'center center',
      });
      rafId = requestAnimationFrame(tick);
    }

    card.addEventListener('mousemove', e => {
      const rect = iconWrap.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      if (!inside) {
        inside = true;
        curX = mouseX;
        curY = mouseY;
        if (img) rafId = requestAnimationFrame(tick);

        gsap.to(glow, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });

        gsap.killTweensOf(iconWrap);
        gsap.timeline()
          .to(iconWrap, { y: -10, duration: 0.25, ease: 'power2.out' })
          .to(iconWrap, { y: 2,   duration: 0.2,  ease: 'power1.inOut' })
          .to(iconWrap, { y: -4,  duration: 0.15, ease: 'power1.inOut' })
          .to(iconWrap, { y: 0,   duration: 0.4,  ease: 'power2.out' });

        gsap.set(ring, { scale: 0.8, opacity: 1, borderColor: 'rgba(42,143,210,0.9)', borderWidth: '2px' });
        gsap.to(ring, { scale: 1.6, opacity: 0, duration: 1.8, ease: 'power1.out', borderColor: 'rgba(42,143,210,0)' });
      }
    });

    card.addEventListener('mouseleave', () => {
      inside = false;
      cancelAnimationFrame(rafId);
      gsap.killTweensOf(iconWrap);
      gsap.to(iconWrap, { y: 0, duration: 0.3, ease: 'power2.out' });
      if (img) {
        gsap.to(img, { x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.55)' });
      }
      gsap.to(glow, { opacity: 0, scale: 0.5, duration: 0.4, ease: 'power2.in' });
    });
  });
})();




//audit on scroll
window.addEventListener('load', () => {
  document.querySelectorAll('.audit-lottie-hover').forEach(function(el) {
    const animPath = el.getAttribute('data-animation');
    if (!animPath) return;

    const anim = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: animPath
    });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter:     () => { anim.goToAndPlay(0, true); },
      onEnterBack: () => { anim.goToAndPlay(0, true); }  
    });
  });
});


//whatsapp button

(function() {
  'use strict';
 
  var btn = document.getElementById('waBtn');
  var btnContainer = document.getElementById('waBtnContainer');
  var glow = document.getElementById('waGlow');
  var icon = document.getElementById('waIcon');
  var particlesEl = document.getElementById('waParticles');

  if (!btn || !btnContainer || !glow || !icon || !particlesEl) return;
 
  // ─── Entrance Animation ───
  var enterTl = gsap.timeline({ delay: 1.2 });
  enterTl
    .from(btnContainer, { scale: 0, rotation: -180, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' })
    .to(btnContainer, { y: -8, duration: 0.3, ease: 'power2.out' })
    .to(btnContainer, { y: 0, duration: 0.5, ease: 'bounce.out' });
 
  // ─── Idle floating ───
  gsap.to(btnContainer, { y: -6, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.5 });
 
  // ─── Particles ───
  var particles = [];
  for (var i = 0; i < 8; i++) {
    var p = document.createElement('div');
    p.className = 'wa-particle';
    particlesEl.appendChild(p);
    particles.push(p);
  }
 
  // ─── 3D Hover ───
  function handleMouseMove(e) {
    var rect = btn.getBoundingClientRect();
    var dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    var dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    gsap.to(btn, { rotateY: dx * 20, rotateX: -dy * 20, duration: 0.4, ease: 'power2.out' });
    gsap.to(icon, { x: dx * 4, y: dy * 4, duration: 0.3, ease: 'power2.out' });
  }
 
  btn.addEventListener('mouseenter', function() {
    gsap.to(btn, { scale: 1.12, duration: 0.35, ease: 'back.out(2)' });
    gsap.to(glow, { opacity: 0.6, scale: 1.3, duration: 0.4, ease: 'power2.out' });
 
    particles.forEach(function(p, i) {
      var angle = (i / particles.length) * Math.PI * 2;
      var dist = 38 + Math.random() * 16;
      gsap.fromTo(p, { x: 0, y: 0, opacity: 0, scale: 0 }, {
        x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
        opacity: 0.8, scale: 1 + Math.random() * 0.5,
        duration: 0.5, ease: 'power2.out', delay: i * 0.03
      });
      gsap.to(p, { opacity: 0, scale: 0, duration: 0.4, delay: 0.35 + i * 0.03, ease: 'power2.in' });
    });
 
    btn.addEventListener('mousemove', handleMouseMove);
  });
 
  btn.addEventListener('mouseleave', function() {
    gsap.to(btn, { scale: 1, rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    gsap.to(icon, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    gsap.to(glow, { opacity: 0.3, scale: 1, duration: 0.4, ease: 'power2.out' });
    btn.removeEventListener('mousemove', handleMouseMove);
  });
 
  // ─── Click → Open WhatsApp popup (stays on same page) ───
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    var screenW = window.screen.width;
    var screenH = window.screen.height;
    var popW = 900;
    var popH = 600;
    var left = Math.round((screenW - popW) / 2);
    var top = Math.round((screenH - popH) / 2);
    window.open(
      'https://wa.me/447832716848',
      'whatsapp_popup',
      'width=' + popW + ',height=' + popH + ',left=' + left + ',top=' + top + ',resizable=yes,scrollbars=yes'
    );
  });
 
  // Touch support
  btn.addEventListener('touchstart', function() {
    gsap.to(btn, { scale: 0.92, duration: 0.15, ease: 'power2.out' });
  }, { passive: true });
 
  btn.addEventListener('touchend', function() {
    gsap.to(btn, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
  }, { passive: true });
 
})();



// How to find us online

// How to find us online
try {
(function () {
    var PANEL_SHOW = ['opacity-100', 'translate-y-0', 'pointer-events-auto'];
    var PANEL_HIDE = ['opacity-0', 'translate-y-3', 'pointer-events-none'];
    var NUM_ON  = ['bg-[#88D1FF]', 'text-[#002F4D]'];
    var NUM_OFF = ['bg-[radial-gradient(50%_50%_at_50%_50%,_#2A8FD2_0%,_#076AAB_100%)]', 'text-[#fff]'];
    var BAR_SHOW = ['opacity-100'];
    var BAR_HIDE = ['opacity-0'];

    function swap(el, addList, removeList) {
      if (!el) return;
      removeList.forEach(function (c) { el.classList.remove(c); });
      addList.forEach(function (c) { el.classList.add(c); });
    }

    document.querySelectorAll('[data-journey]').forEach(function (root) {
      var steps  = [].slice.call(root.querySelectorAll('[data-step]'));
      var panels = [].slice.call(root.querySelectorAll('[data-panel]'));
      var prog   = root.querySelector('[data-journey-progress]');
      var n = Math.min(steps.length, panels.length);
      if (!n) return;

      var STEP_MS = 2800;
      var i = 0, started = false, typeTimer = null;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

      var bar     = root.querySelector('[data-journey-searchbar]');
      var typeEl  = root.querySelector('[data-journey-type]');
      var caretEl = root.querySelector('[data-journey-caret]');
      var clearEl = root.querySelector('[data-journey-clear]');

      function typeInto(el) {
        clearInterval(typeTimer);
        var full = el.getAttribute('data-text') || '';
        el.textContent = '';
        var c = 0;
        typeTimer = setInterval(function () {
          c++;
          el.textContent = full.slice(0, c);
          if (c >= full.length) clearInterval(typeTimer);
        }, 65);
      }

      // ---- render: swaps panel/step visuals only, never touches the progress bar ----
      function render(idx) {
        panels.forEach(function (p, k) {
          swap(p, k === idx ? PANEL_SHOW : PANEL_HIDE, k === idx ? PANEL_HIDE : PANEL_SHOW);
        });
        steps.forEach(function (s, k) {
          var numEl = s.querySelector('[data-journey-num]');
          swap(numEl, k === idx ? NUM_ON : NUM_OFF, k === idx ? NUM_OFF : NUM_ON);
        });

        clearInterval(typeTimer);

        if (bar) {
          var showBar = idx >= 1 && idx <= 4;
          swap(bar, showBar ? BAR_SHOW : BAR_HIDE, showBar ? BAR_HIDE : BAR_SHOW);

          if (showBar && typeEl) {
            if (idx === 1) {
              if (caretEl) caretEl.classList.remove('hidden');
              if (clearEl) clearEl.classList.add('hidden');
              typeInto(typeEl);
            } else {
              if (caretEl) caretEl.classList.add('hidden');
              if (clearEl) clearEl.classList.remove('hidden');
              typeEl.textContent = typeEl.getAttribute('data-text') || '';
            }
          }
        }
      }

      // ---- progress bar, driven entirely by rAF so it can be paused/resumed exactly ----
      var rafId   = null;
      var elapsed = 0;       // ms already progressed on the CURRENT step
      var lastTs  = null;
      var isPaused = true;

      function setProgWidth(pct) {
        if (!prog) return;
        prog.style.transition = 'none';   // no CSS transition — we drive the width every frame ourselves
        prog.style.width = pct + '%';
      }

      function progFrame(ts) {
        if (isPaused) return;
        if (lastTs === null) lastTs = ts;
        elapsed += ts - lastTs;
        lastTs = ts;

        if (elapsed >= STEP_MS) {
          setProgWidth(100);
          advance();               // moves to next step and restarts progress at 0
          return;
        }
        setProgWidth((elapsed / STEP_MS) * 100);
        rafId = requestAnimationFrame(progFrame);
      }

      function runProgress() {
        if (reduce) return;
        isPaused = false;
        lastTs = null;                       // resume counting from `elapsed`, not from 0
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(progFrame);
      }

      function pauseProgress() {
        isPaused = true;                     // freezes exactly where it is — no more width changes
        cancelAnimationFrame(rafId);
        lastTs = null;
      }

      function resetProgress() {
        elapsed = 0;
        setProgWidth(0);
      }

      // ---- sequencing ----
      function goTo(idx) {
        i = idx;
        render(i);
        resetProgress();
      }

      function advance() {
        goTo((i + 1) % n);
        runProgress();
      }

      function start() {
        if (started) return;
        started = true;
        goTo(0);
        runProgress();
      }

      // ---- hover = pause (freeze bar in place) + jump to that panel ----
      // ---- mouseleave = resume (bar continues from where it was) ----
      // ---- click (touch) = jump + resume immediately ----
      function jumpTo(idx) {
        goTo(idx);
      }

      steps.forEach(function (s, idx) {
        s.style.cursor = 'pointer';
        s.addEventListener('mouseenter', function () {
          pauseProgress();
          jumpTo(idx);
        });
        s.addEventListener('mouseleave', function () {
          runProgress();
        });
        s.addEventListener('click', function () {
          jumpTo(idx);
          runProgress();
        });
      });

      if (reduce) { render(0); return; }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) start(); });
      }, { threshold: 0.3 });
      io.observe(root);
    });
  })();
} catch (err) {
  console.error('Journey widget failed to init:', err);
}




// WHY SEO NEEDED CARDS

document.querySelectorAll('.cardhoveranimation .why-outer').forEach(card => {
  const img = card.querySelector('.why-card-img img');

  let isAnimating = false;

  function createRipple(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const distX = Math.max(x, rect.width - x);
    const distY = Math.max(y, rect.height - y);
    const radius = Math.sqrt(distX * distX + distY * distY) * 2;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      background: linear-gradient(180deg, rgba(136,209,255,0.35) 0%, rgba(212,238,255,0.18) 100%);
      box-shadow: 0 6px 0 0 #DEF2FF;
      opacity: 0.45;
      width: ${radius}px;
      height: ${radius}px;
      left: ${x - radius / 2}px;
      top: ${y - radius / 2}px;
      z-index: 0;
    `;

    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(ripple);

    gsap.timeline({ onComplete: () => ripple.remove() })
      .to(ripple, { scale: 1, opacity: 0.3, duration: 0.7, ease: 'power1.out' })
      .to(ripple, { opacity: 0, duration: 0.45, ease: 'power1.in' }, '-=0.15');
  }

  card.addEventListener('mouseenter', (e) => {
    createRipple(e);

    gsap.to(card, { y: -4, duration: 0.2, ease: 'power2.out' });

 
    if (img && !isAnimating) {
      isAnimating = true;
      gsap.timeline({ onComplete: () => { isAnimating = false; } })
        .to(img, { y: -12, skewX: -5, scaleX: 1.03, duration: 0.13, ease: 'linear' })
        .to(img, { y:   6, skewX:  4, scaleX: 0.98, duration: 0.13, ease: 'linear' })
        .to(img, { y:  -4, skewX: -2, scaleX: 1.01, duration: 0.11, ease: 'linear' })
        .to(img, { y:   0, skewX:  0, scaleX: 1,    duration: 0.22, ease: 'elastic.out(1, 0.5)' });
    }
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, { y: 0, duration: 0.25, ease: 'power2.out' });

  
    if (img && isAnimating) {
      gsap.to(img, {
        y: 0, skewX: 0, scaleX: 1,
        duration: 0.2, ease: 'power2.out', overwrite: true,
        onComplete: () => { isAnimating = false; }
      });
    }
  });
});
