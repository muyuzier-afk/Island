// Hot Module Replacement Preview - Live preview during development
// Mimics Astro's HMR and preview server functionality
export default function initHMRPreview(element) {
  const wsUrl = element.dataset.wsUrl || 'ws://localhost:1313/ws';
  const previewId = element.dataset.previewId || 'default';
  
  // Create preview container
  const container = document.createElement('div');
  container.style.cssText = 'border: 2px solid #4CAF50; border-radius: 8px; padding: 16px; margin: 16px 0; background: #f9fff9;';
  
  // Header with status indicator
  const header = document.createElement('div');
  header.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 16px;';
  
  const statusDot = document.createElement('span');
  statusDot.style.cssText = 'width: 12px; height: 12px; border-radius: 50%; background: #ccc; display: inline-block;';
  statusDot.id = 'hmr-status';
  
  const statusText = document.createElement('span');
  statusText.textContent = 'Connecting...';
  statusText.style.cssText = 'color: #666; font-size: 14px;';
  statusText.id = 'hmr-status-text';
  
  header.appendChild(statusDot);
  header.appendChild(statusText);
  container.appendChild(header);
  
  // Preview content area
  const previewArea = document.createElement('div');
  previewArea.id = 'hmr-preview-content';
  previewArea.style.cssText = 'min-height: 100px; padding: 12px; background: white; border-radius: 4px; border: 1px solid #eee;';
  previewArea.innerHTML = '<p style="color: #666;">Waiting for updates...</p>';
  container.appendChild(previewArea);
  
  element.innerHTML = '';
  element.appendChild(container);
  
  // WebSocket connection for HMR
  let ws = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  
  const connect = () => {
    if (ws) ws.close();
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      statusDot.style.background = '#4CAF50';
      statusText.textContent = 'Connected - Live Preview Active';
      statusText.style.color = '#4CAF50';
      reconnectAttempts = 0;
      
      previewArea.innerHTML = '<p style="color: #4CAF50;">✓ Connected to dev server. Changes will appear here.</p>';
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'update' && data.previewId === previewId) {
          previewArea.innerHTML = data.content || '<p>No content</p>';
          
          // Flash effect to show update
          previewArea.style.transition = 'background 0.3s';
          previewArea.style.background = '#e8f5e9';
          setTimeout(() => {
            previewArea.style.background = 'white';
          }, 300);
        }
      } catch (err) {
        console.error('HMR parse error:', err);
      }
    };
    
    ws.onerror = () => {
      statusDot.style.background = '#ff9800';
      statusText.textContent = 'Connection lost';
      statusText.style.color = '#ff9800';
    };
    
    ws.onclose = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        statusText.textContent = `Reconnecting (${reconnectAttempts}/${maxReconnectAttempts})...`;
        setTimeout(connect, 2000 * reconnectAttempts);
      } else {
        statusDot.style.background = '#f44336';
        statusText.textContent = 'Disconnected - Server unavailable';
        statusText.style.color = '#f44336';
        previewArea.innerHTML = '<p style="color: #f44336;">✗ Lost connection to dev server</p>';
      }
    };
  };
  
  connect();
  
  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    if (ws) ws.close();
  });
}
