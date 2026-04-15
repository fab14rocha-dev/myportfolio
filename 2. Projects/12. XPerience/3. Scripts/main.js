// main.js — GSAP page animations

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {


  // ─── 1. Hero entrance ─────────────────────────────────────────
  // Orbs fade in. Hero tag slides up. Headline reveals word by word
  // (each word clips upward from behind its overflow:hidden wrapper).
  // Subline and CTA follow.

  gsap.to('.orb', {
    opacity: 0.13,
    duration: 2.5,
    stagger: 0.4,
    ease: 'power2.out'
  });

  // Words start below the clip boundary
  gsap.set('.hero-headline .word', { y: '115%' });
  gsap.set('.hero-tag, .hero-sub, .cta-btn', { y: 36, opacity: 0 });

  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .to('.hero-tag', {
      opacity: 1, y: 0,
      duration: 0.9, ease: 'power3.out'
    })
    .to('.hero-headline .word', {
      y: '0%',
      duration: 1.0,
      stagger: 0.09,
      ease: 'power3.out'
    }, '-=0.5')
    .to('.hero-sub', {
      opacity: 1, y: 0,
      duration: 0.9, ease: 'power3.out'
    }, '-=0.55')
    .to('.cta-btn', {
      opacity: 1, y: 0,
      duration: 0.8, ease: 'power3.out'
    }, '-=0.5');


  // ─── 2. Orb parallax scrub ────────────────────────────────────
  // Each orb moves at a different speed and direction as you scroll
  // past the hero. Combined with the CSS drift animation, gives depth.

  gsap.to('.orb-1', {
    y: -150,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  gsap.to('.orb-2', {
    y: 100, x: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2
    }
  });

  gsap.to('.orb-3', {
    y: -80, x: 40,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });


  // ─── 3. Pinned experience showcase ────────────────────────────
  // The section pins in place while the three panels slide horizontally.
  // Scroll distance equals the total horizontal travel needed.

  const expTrack = document.getElementById('expTrack');

  if (expTrack && window.matchMedia('(min-width: 769px)').matches) {

    // Fade out the scroll hint as the user starts scrolling
    gsap.to('.exp-scroll-hint', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.exp-showcase',
        start: 'top top',
        end: '+=250',
        scrub: true
      }
    });

    // Pin and slide
    gsap.to(expTrack, {
      x: () => -(expTrack.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: '.exp-showcase',
        pin: true,
        scrub: 1,
        end: () => '+=' + (expTrack.scrollWidth - window.innerWidth),
        invalidateOnRefresh: true
      }
    });
  }


  // ─── 4. Magnetic CTA buttons ──────────────────────────────────
  // Buttons gently pull toward the cursor while hovered.
  // On mouse leave they snap back with an elastic bounce.

  document.querySelectorAll('.cta-btn, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.3;
      const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.3;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });


  // ─── Scroll animations ────────────────────────────────────────
  // Existing section reveals — fade + slide as each section enters view.

  // What section
  gsap.from('.what .section-tag, .what .section-headline', {
    scrollTrigger: { trigger: '.what', start: 'top 78%' },
    opacity: 0, y: 40,
    duration: 0.9, stagger: 0.1, ease: 'power3.out'
  });

  gsap.from('.what-text', {
    scrollTrigger: { trigger: '.what-text', start: 'top 80%' },
    opacity: 0, y: 30,
    duration: 0.9, ease: 'power3.out'
  });

  gsap.from('.exp-type', {
    scrollTrigger: { trigger: '.experience-types', start: 'top 82%' },
    opacity: 0, x: -16,
    duration: 0.6, stagger: 0.15, ease: 'power2.out'
  });

  // How it works
  gsap.from('.how .section-tag, .how .section-headline', {
    scrollTrigger: { trigger: '.how', start: 'top 78%' },
    opacity: 0, y: 40,
    duration: 0.9, stagger: 0.1, ease: 'power3.out'
  });

  gsap.from('.step', {
    scrollTrigger: { trigger: '.steps', start: 'top 78%' },
    opacity: 0, y: 48,
    duration: 0.9, stagger: 0.18, ease: 'power3.out'
  });

  // Tiers
  gsap.from('.tiers .section-tag, .tiers .section-headline', {
    scrollTrigger: { trigger: '.tiers', start: 'top 78%' },
    opacity: 0, y: 40,
    duration: 0.9, stagger: 0.1, ease: 'power3.out'
  });

  gsap.from('.tier-card', {
    scrollTrigger: { trigger: '.tier-cards', start: 'top 80%' },
    opacity: 0, y: 48,
    duration: 0.9, stagger: 0.14, ease: 'power3.out'
  });

});
