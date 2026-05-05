// Code Runner Island - Interactive code execution in browser
// Mimics Astro's playground/demo components with safe eval
// SECURITY: Only enabled in development mode to prevent XSS attacks
export default function initCodeRunner(element) {
  const language = element.dataset.language || 'javascript';
  const runnable = element.dataset.runnable === 'true';
  
  // Security check: Disable code execution in production environments
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1' &&
                       !window.location.hostname.endsWith('.local') &&
                       !window.location.hostname.endsWith('.test');
  
  if (isProduction) {
    console.warn('[Island] Code Runner disabled in production for security');
    const runButton = element.querySelector('.run-button');
    if (runButton) {
      runButton.disabled = true;
      runButton.textContent = '▶ Run (Dev Only)';
      runButton.style.opacity = '0.5';
      runButton.style.cursor = 'not-allowed';
    }
    return;
  }
  
  const runButton = element.querySelector('.run-button');
  const outputArea = element.querySelector('.code-output');
  const outputContent = element.querySelector('.output-content');
  const codeElement = element.querySelector('code');
  
  if (!runnable || !runButton) {
    return;
  }
  
  const extractCode = () => {
    // Get the text content from the code block
    return codeElement.textContent.trim();
  };
  
  const runJavaScript = (code) => {
    const logs = [];
    
    // Capture console.log
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
      originalLog.apply(console, args);
    };
    
    console.error = (...args) => {
      logs.push(`❌ Error: ${args.join(' ')}`);
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      logs.push(`⚠️ Warning: ${args.join(' ')}`);
      originalWarn.apply(console, args);
    };
    
    try {
      // Safe evaluation using Function constructor (limited scope)
      const result = new Function('"use strict"; return (' + code + ')')();
      
      if (result !== undefined) {
        logs.push(`Result: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`);
      }
    } catch (err) {
      logs.push(`❌ Runtime Error: ${err.message}`);
    } finally {
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }
    
    return logs.join('\n') || 'No output';
  };
  
  runButton.addEventListener('click', () => {
    const code = extractCode();
    
    // Show output area
    outputArea.style.display = 'block';
    outputArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Run based on language
    if (language === 'javascript' || language === 'js') {
      const output = runJavaScript(code);
      outputContent.textContent = output;
    } else {
      outputContent.textContent = `Language "${language}" execution not yet supported.\nOnly JavaScript is available in this demo.`;
    }
    
    // Update button state
    runButton.textContent = '↻ Re-run';
    runButton.style.background = '#45a049';
  });
  
  // Add keyboard shortcut (Ctrl/Cmd + Enter to run)
  element.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runButton.click();
    }
  });
}
