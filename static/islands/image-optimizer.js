// Image Optimizer Island - Lazy loading with blur-up placeholder
// Mimics Astro's Image component with responsive images
export default function initImageOptimizer(element) {
  const src = element.dataset.src;
  const alt = element.dataset.alt || '';
  const width = parseInt(element.dataset.width) || 800;
  const height = parseInt(element.dataset.height) || 600;
  
  // Create container with aspect ratio
  const container = document.createElement('div');
  container.style.cssText = `position: relative; width: 100%; max-width: ${width}px; aspect-ratio: ${width}/${height}; overflow: hidden; border-radius: 8px; background: #f0f0f0;`;
  
  // Low-quality placeholder (blurry version)
  const placeholder = document.createElement('img');
  placeholder.src = `${src}?q=20&w=${Math.floor(width/4)}`;
  placeholder.alt = alt;
  placeholder.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; filter: blur(20px); transition: opacity 0.3s;';
  
  // High-quality image (loaded lazily)
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.style.cssText = 'position: relative; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s;';
  
  img.onload = () => {
    img.style.opacity = '1';
    setTimeout(() => {
      placeholder.remove();
    }, 500);
  };
  
  container.appendChild(placeholder);
  container.appendChild(img);
  
  element.innerHTML = '';
  element.appendChild(container);
}
