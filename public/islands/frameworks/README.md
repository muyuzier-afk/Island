# Framework Integrations

This directory contains framework-specific renderers for Island's framework-agnostic components.

## Supported Frameworks

- **Vanilla JS** (built-in, no extra file needed)
- React (coming soon)
- Vue (coming soon)
- Svelte (coming soon)
- Solid (coming soon)
- Alpine.js (coming soon)
- Lit (coming soon)

## Adding a Framework Renderer

Create a file named after the framework (e.g., `react.js`):

```javascript
// static/islands/frameworks/react.js
import { createElement, render } from 'https://esm.sh/react';
import { createRoot } from 'https://esm.sh/react-dom/client';

export default async function renderReact(container, componentName, props) {
  // Load the component
  const module = await import(`/islands/components/${componentName}.jsx`);
  const Component = module.default || module[componentName];
  
  // Render to container
  const root = createRoot(container);
  root.render(createElement(Component, props));
}
```

## Usage in Content

```markdown
{{< component name="Counter" framework="react" client="idle" props='{"initial": 5}' />}}
```
