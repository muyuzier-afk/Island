// Client-Side Routing - SPA-like navigation without full page reloads
// Mimics Astro's client:only and client:load patterns for hybrid rendering
export default function initClientRouter(element) {
  const routes = JSON.parse(element.dataset.routes || '[]');
  const basePath = element.dataset.basePath || '';
  
  // Create navigation container
  const nav = document.createElement('nav');
  nav.style.cssText = 'display: flex; gap: 16px; padding: 8px 0; border-bottom: 1px solid #eee; margin-bottom: 16px;';
  
  routes.forEach(route => {
    const link = document.createElement('a');
    link.href = `${basePath}${route.path}`;
    link.textContent = route.label;
    link.style.cssText = 'text-decoration: none; color: #0066cc; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;';
    
    link.addEventListener('mouseenter', () => {
      link.style.background = '#f0f0f0';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.background = 'transparent';
    });
    
    nav.appendChild(link);
  });
  
  // Create content area
  const content = document.createElement('div');
  content.id = 'router-content';
  content.style.cssText = 'min-height: 200px;';
  content.innerHTML = '<p style="color: #666;">Navigate to load content...</p>';
  
  // Handle navigation
  const navigate = async (path) => {
    try {
      const response = await fetch(`${basePath}${path}.json`);
      if (!response.ok) throw new Error('Not found');
      const data = await response.json();
      
      content.innerHTML = `
        <h1>${data.title}</h1>
        <p style="color: #666; margin: 8px 0 16px;">${data.description || ''}</p>
        <div>${data.content}</div>
      `;
      
      // Update URL without reload
      history.pushState({ path }, '', `${basePath}${path}`);
    } catch (err) {
      content.innerHTML = `<p style="color: red;">Error loading: ${path}</p>`;
    }
  };
  
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('href').replace(basePath, '');
      navigate(path);
    });
  });
  
  element.innerHTML = '';
  element.appendChild(nav);
  element.appendChild(content);
  
  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    if (e.state?.path) {
      navigate(e.state.path);
    }
  });
}
