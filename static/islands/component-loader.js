// Component Loader - Framework-agnostic component hydration
// Mimics Astro's framework-agnostic components (React, Vue, Svelte, Solid, etc.)
export default function initComponentLoader(element) {
  const componentName = element.dataset.component;
  const framework = element.dataset.framework || 'vanilla';
  const propsJson = element.dataset.props || '{}';
  
  let props = {};
  try {
    props = JSON.parse(propsJson);
  } catch (e) {
    console.error('Failed to parse component props:', e);
  }
  
  const renderComponent = async () => {
    try {
      // Try to load framework-specific renderer
      const module = await import(`/islands/frameworks/${framework}.js`);
      
      if (module.default) {
        // Framework-specific renderer
        await module.default(element, componentName, props);
      } else if (module[componentName]) {
        // Named export for specific component
        await module[componentName](element, props);
      } else {
        throw new Error(`Component ${componentName} not found in ${framework} module`);
      }
    } catch (err) {
      // Fallback: try vanilla JS component
      console.warn(`Framework ${framework} not available, trying vanilla fallback`);
      renderVanillaComponent(element, componentName, props);
    }
  };
  
  const renderVanillaComponent = (container, name, props) => {
    // Built-in vanilla components
    const vanillaComponents = {
      'Counter': (el, props) => {
        const initial = props.initial || 0;
        let count = initial;
        
        el.innerHTML = `
          <div style="display: inline-flex; align-items: center; gap: 12px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <button class="decrement" style="width: 32px; height: 32px; border: none; border-radius: 4px; background: #e0e0e0; cursor: pointer; font-size: 18px;">−</button>
            <span class="count" style="font-size: 20px; font-weight: 600; min-width: 40px; text-align: center;">${count}</span>
            <button class="increment" style="width: 32px; height: 32px; border: none; border-radius: 4px; background: #4CAF50; color: white; cursor: pointer; font-size: 18px;">+</button>
          </div>
        `;
        
        el.querySelector('.decrement').addEventListener('click', () => {
          count--;
          el.querySelector('.count').textContent = count;
        });
        
        el.querySelector('.increment').addEventListener('click', () => {
          count++;
          el.querySelector('.count').textContent = count;
        });
      },
      
      'Accordion': (el, props) => {
        const items = props.items || [];
        el.innerHTML = `
          <div class="accordion" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            ${items.map((item, i) => `
              <div class="accordion-item" style="border-bottom: ${i < items.length - 1 ? '1px solid #e0e0e0' : 'none'};">
                <button class="accordion-header" style="width: 100%; padding: 16px; text-align: left; background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" data-index="${i}">
                  <span style="font-weight: 500;">${item.title}</span>
                  <span class="accordion-icon" style="transition: transform 0.3s;">▼</span>
                </button>
                <div class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; background: #fafafa;">
                  <div style="padding: 16px;">${item.content}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        
        el.querySelectorAll('.accordion-header').forEach(header => {
          header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.accordion-icon');
            const isOpen = content.style.maxHeight !== '0px';
            
            // Close all others
            el.querySelectorAll('.accordion-content').forEach(c => {
              c.style.maxHeight = '0';
            });
            el.querySelectorAll('.accordion-icon').forEach(i => {
              i.style.transform = 'rotate(0deg)';
            });
            
            // Toggle current
            if (!isOpen) {
              content.style.maxHeight = content.scrollHeight + 'px';
              icon.style.transform = 'rotate(180deg)';
            }
          });
        });
      },
      
      'Modal': (el, props) => {
        const title = props.title || 'Modal';
        const content = props.content || 'Modal content';
        const buttonText = props.buttonText || 'Open Modal';
        
        el.innerHTML = `
          <button class="modal-trigger" style="padding: 12px 24px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">${buttonText}</button>
          <div class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
            <div class="modal-content" style="background: white; padding: 24px; border-radius: 8px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
              <h3 style="margin: 0 0 16px; font-size: 20px;">${title}</h3>
              <div style="color: #666; line-height: 1.6;">${content}</div>
              <button class="modal-close" style="margin-top: 20px; padding: 10px 20px; background: #e0e0e0; border: none; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
          </div>
        `;
        
        const overlay = el.querySelector('.modal-overlay');
        el.querySelector('.modal-trigger').addEventListener('click', () => {
          overlay.style.display = 'flex';
        });
        el.querySelector('.modal-close').addEventListener('click', () => {
          overlay.style.display = 'none';
        });
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            overlay.style.display = 'none';
          }
        });
      }
    };
    
    if (vanillaComponents[name]) {
      vanillaComponents[name](el, props);
    } else {
      el.innerHTML = `<p style="color: #f44336;">Unknown component: ${name}</p>`;
    }
  };
  
  renderComponent();
}
