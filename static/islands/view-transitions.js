// View Transitions API - Smooth page transitions
// Inspired by Astro's ViewTransitions
(function() {
  'use strict';

  // Check if View Transitions API is supported
  if (!document.startViewTransition) {
    // Fallback: normal navigation
    return;
  }

  // Intercept all internal links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || 
        link.target === '_blank' || link.download) {
      return;
    }

    // Only handle same-origin links
    const linkUrl = new URL(href, window.location.origin);
    if (linkUrl.origin !== window.location.origin) {
      return;
    }

    e.preventDefault();

    document.startViewTransition(() => {
      return new Promise((resolve) => {
        window.location.href = href;
        // Resolve when page loads (won't actually happen due to navigation)
        window.addEventListener('load', () => resolve(), { once: true });
      });
    });
  });

  // Add transition classes for CSS animations
  document.documentElement.classList.add('view-transitions-enabled');
})();
