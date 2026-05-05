// Tabs Island - Interactive tabbed content
// Mimics Astro's UI components with minimal JavaScript
// SECURITY: CSP compliant - no inline event handlers
export default function initTabs(element) {
  const groupId = element.dataset.group;
  const defaultIndex = parseInt(element.dataset.default) || 0;

  const tabList = element.querySelector('[role="tablist"]');
  const tabs = tabList.querySelectorAll('[role="tab"]');
  const panels = element.querySelectorAll('[role="tabpanel"]');

  let activeIndex = defaultIndex;

  const activateTab = (index) => {
    // Deactivate all tabs
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', 'false');
      tab.style.borderBottomColor = 'transparent';
      tab.style.color = '#666';
      tab.style.fontWeight = 'normal';
      tab.style.background = 'transparent';

      // Hide corresponding panel
      const panel = panels[i];
      panel.style.display = 'none';
      panel.setAttribute('aria-hidden', 'true');
    });

    // Activate selected tab
    const selectedTab = tabs[index];
    selectedTab.setAttribute('aria-selected', 'true');
    selectedTab.style.borderBottomColor = '#0066cc';
    selectedTab.style.color = '#0066cc';
    selectedTab.style.fontWeight = '600';

    // Show corresponding panel
    const selectedPanel = panels[index];
    selectedPanel.style.display = 'block';
    selectedPanel.setAttribute('aria-hidden', 'false');

    activeIndex = index;

    // Store state for persistence (optional)
    if (groupId) {
      try {
        localStorage.setItem(`tabs-${groupId}`, index);
      } catch (e) {}
    }
  };

  // Add click handlers to tabs
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateTab(index);
    });

    // Add hover effects (CSP compliant replacement for onmouseover/onmouseout)
    tab.addEventListener('mouseenter', () => {
      if (tab.getAttribute('aria-selected') !== 'true') {
        tab.style.background = '#f0f0f0';
      }
    });

    tab.addEventListener('mouseleave', () => {
      if (tab.getAttribute('aria-selected') !== 'true') {
        tab.style.background = 'transparent';
      }
    });

    // Add keyboard navigation
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + tabs.length) % tabs.length;
        activateTab(prevIndex);
        tabs[prevIndex].focus();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % tabs.length;
        activateTab(nextIndex);
        tabs[nextIndex].focus();
      }
    });
  });

  // Load saved state (optional)
  if (groupId) {
    try {
      const saved = localStorage.getItem(`tabs-${groupId}`);
      if (saved !== null) {
        activateTab(parseInt(saved));
        return;
      }
    } catch (e) {}
  }

  // Activate default tab
  activateTab(defaultIndex);
}
