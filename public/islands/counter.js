// Counter Island - Example interactive component
// This file is only loaded when the counter island is used
export default function initCounter(element) {
  let count = 0;
  const button = document.createElement('button');
  button.textContent = 'Count: 0';
  button.style.cssText = 'padding: 8px 16px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #f5f5f5;';
  
  button.addEventListener('click', () => {
    count++;
    button.textContent = `Count: ${count}`;
  });
  
  element.innerHTML = '';
  element.appendChild(button);
}
