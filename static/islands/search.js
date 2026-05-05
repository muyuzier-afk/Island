// Search Island - Client-side search functionality
// This file is only loaded when the search island is used
export default function initSearch(element) {
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Search...';
  input.style.cssText = 'padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; width: 100%; max-width: 300px;';
  
  const results = document.createElement('div');
  results.style.cssText = 'margin-top: 8px; max-height: 300px; overflow-y: auto;';
  
  input.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
      results.innerHTML = '';
      return;
    }
    
    try {
      const response = await fetch('/index.json');
      const data = await response.json();
      const filtered = data.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase())
      );
      
      if (filtered.length === 0) {
        results.innerHTML = '<p style="color: #666;">No results found</p>';
        return;
      }
      
      results.innerHTML = filtered.slice(0, 10).map(item => `
        <div style="padding: 8px; border-bottom: 1px solid #eee;">
          <a href="${item.permalink}" style="text-decoration: none; color: #0066cc;">${item.title}</a>
        </div>
      `).join('');
    } catch (err) {
      console.error('Search failed:', err);
    }
  });
  
  element.innerHTML = '';
  element.appendChild(input);
  element.appendChild(results);
}
