---
title: "Island Architecture Guide"
date: 2024-01-02T10:00:00+00:00
draft: false
description: "A comprehensive guide to using Island Architecture in your Hugo blog"
tags: ["guide", "islands", "performance"]
cover:
  image: ""
  alt: ""
---

# Island Architecture Guide 🏝️

This guide explains how to use Island Architecture effectively in your Hugo blog.

## What are Islands?

Islands are interactive components that exist within otherwise static HTML pages. Think of them as small pockets of interactivity in a sea of static content.

## Creating Your First Island

### Step 1: Create the JavaScript Module

Create a new file in `static/islands/`:

```javascript
// static/islands/like-button.js
export default function initLikeButton(element) {
  let liked = false;
  const button = document.createElement('button');
  button.textContent = '👍 Like';
  
  button.addEventListener('click', () => {
    liked = !liked;
    button.textContent = liked ? '❤️ Liked' : '👍 Like';
  });
  
  element.innerHTML = '';
  element.appendChild(button);
}
```

### Step 2: Use the Shortcode in Your Content

```markdown
{{</* island name="like-button" trigger="interaction" */>}}
```

### Step 3: Build and Deploy

```bash
hugo
```

That's it! The JavaScript will only load when a user interacts with the button.

## Trigger Strategies

Choose the right trigger for your use case:

### `idle` (Default)

Loads when the browser is idle. Best for:
- Non-critical enhancements
- Analytics widgets
- Social share buttons

```markdown
{{</* island name="analytics" trigger="idle" */>}}
```

### `visible`

Loads when the element scrolls into view. Best for:
- Charts and graphs
- Image galleries
- Comments sections

```markdown
{{</* island name="chart" trigger="visible" */>}}
```

### `interaction`

Loads on first user interaction. Best for:
- Search boxes
- Contact forms
- Buttons and CTAs

```markdown
{{</* island name="search" trigger="interaction" */>}}
```

### `immediate`

Loads immediately. Use sparingly for:
- Critical above-the-fold interactions
- Time-sensitive features

```markdown
{{</* island name="critical-widget" trigger="immediate" */>}}
```

## Example Islands

### Search Box

```markdown
{{</* island name="search" trigger="interaction" */>}}
```

### Interactive Counter

```markdown
{{</* island name="counter" trigger="idle" */>}}
```

### Code Runner

```markdown
{{</* island name="code-runner" trigger="visible" */>}}
```

## Performance Tips

1. **Minimize islands**: Only add interactivity where truly needed
2. **Use appropriate triggers**: Don't load immediately unless necessary
3. **Keep islands small**: Each island should do one thing well
4. **Lazy load dependencies**: If an island needs libraries, load them lazily
5. **Test performance**: Use Lighthouse to verify zero-JS baseline

## Advanced Usage

### Passing Props to Islands

```markdown
{{</* island name="counter" attrs='data-initial="5"' */>}}
```

```javascript
export default function initCounter(element) {
  const initial = parseInt(element.dataset.initial) || 0;
  // Use initial value...
}
```

### Nested Content

```markdown
{{</* island name="tabs" */>}}
- Tab 1 Content
- Tab 2 Content
{{</* /island */>}}
```

## Migration from Other Frameworks

### From Astro

Astro islands → Island shortcodes:

```astro
<!-- Astro -->
<Counter client:idle />
```

```markdown
<!-- Island -->
{{</* island name="counter" trigger="idle" */>}}
```

### From React/Next.js

Server Components + Islands pattern:

```jsx
// Before: Client Component
'use client'
export function Counter() { ... }
```

```javascript
// After: Island module
export default function initCounter(element) { ... }
```

## Troubleshooting

### Island not loading?

1. Check the filename matches the `name` attribute
2. Verify the file is in `static/islands/`
3. Check browser console for errors
4. Ensure the shortcode syntax is correct

### Performance issues?

1. Audit which islands are loaded
2. Consider changing trigger strategies
3. Profile island JavaScript size
4. Check for unnecessary re-renders

---

Happy building with Islands! 🌴
