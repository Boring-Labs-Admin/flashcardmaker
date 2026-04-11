'use client';

import { useEffect } from 'react';

const SELECTORS = [
  '.subject-section',
  '.library-deck-header',
  '.subject-deck-list',
  '.library-gate-inner',
  '.library-directory .library-subject-group',
  '.subject-grid .subject-card',
  '.library-card-grid .library-card',
];

export default function ScrollRevealInit() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(SELECTORS.join(', '));

    elements.forEach((el, i) => {
      el.classList.add('sr-hidden');
      // Stagger children within grids
      const parent = el.closest('.subject-grid, .library-card-grid, .library-directory');
      if (parent) {
        const siblings = Array.from(parent.children);
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${idx * 60}ms`;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('sr-hidden');
            entry.target.classList.add('sr-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
