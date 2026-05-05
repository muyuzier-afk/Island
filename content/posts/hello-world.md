---
title: "Hello World"
date: 2024-01-01T12:00:00+00:00
draft: false
description: "Welcome to Island - A high-performance Hugo blog with Zero JS and Island Architecture"
tags: ["welcome", "introduction"]
cover:
  image: ""
  alt: ""
---

# Welcome to Island 🏝️

Island is a **high-performance blog system** built on Hugo with the PaperMod theme. It features:

## Key Features

### 🚀 Zero JavaScript by Default
Unlike traditional frameworks that ship megabytes of JavaScript, Island loads **zero JavaScript** by default. Your content is pure HTML, ensuring lightning-fast page loads.

### 🏝️ Island Architecture
Inspired by Astro's island architecture, Island allows you to add interactive components only where needed. Interactive "islands" are loaded lazily using one of these triggers:

- **idle**: Load when the browser is idle (default)
- **visible**: Load when the element comes into view
- **interaction**: Load on first user interaction (click, touch, focus)
- **immediate**: Load immediately

### ⚡ Faster than Astro
While Astro pioneered island architecture, Island takes it further:
- Built on Hugo's blazing-fast static site generation
- No build-time JavaScript bundling overhead
- Minimal runtime (< 1KB gzipped)
- Pure Go templating for maximum performance

## Using Islands

Add interactive components to your posts using the `island` shortcode:

```markdown
{{</* island name="counter" trigger="idle" */>}}
```

This creates an interactive counter that loads only when needed. Try it below:

{{< island name="counter" trigger="idle" />}}

## Adding a Search Island

For larger blogs, add a search feature:

```markdown
{{</* island name="search" trigger="interaction" */>}}
```

{{< island name="search" trigger="interaction" />}}

## Getting Started

1. Create a new post: `hugo new posts/my-post.md`
2. Add islands where interactivity is needed
3. Build: `hugo`
4. Deploy anywhere that serves static files

## Performance Comparison

| Framework | Default JS | Build Time | Runtime |
|-----------|-----------|------------|---------|
| Island    | 0 KB      | ~50ms      | < 1 KB  |
| Astro     | 0 KB      | ~500ms     | ~10 KB  |
| Next.js   | ~50 KB    | ~1s        | ~100 KB |
| Gatsby    | ~100 KB   | ~2s        | ~150 KB |

*Note: Times vary based on content size and hardware*

---

Enjoy building with Island! 🌴
