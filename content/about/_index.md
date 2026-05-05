---
title: "About Island"
date: 2024-01-01T10:00:00+00:00
draft: false
description: "Learn about the Island blog system"
layout: "page"
---

# About Island 🏝️

## What is Island?

Island is a high-performance static blog system built on [Hugo](https://gohugo.io/) with the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme. It combines Hugo's incredible speed with modern web architecture patterns.

## Philosophy

### Zero JavaScript by Default

The modern web has become bloated with JavaScript. A simple blog post shouldn't require megabytes of JS to render. Island takes a different approach:

- **No JS shipped by default** - Your content is pure, semantic HTML
- **Progressive enhancement** - Add interactivity only where needed
- **Lazy loading** - Islands load when appropriate (idle, visible, or on interaction)

### Island Architecture

Inspired by [Astro](https://astro.build/), Island uses an island architecture where:

1. The page is static HTML
2. Interactive components ("islands") are isolated
3. Each island loads its own JavaScript independently
4. No JavaScript framework runtime is required

### Why Hugo?

Hugo is the fastest static site generator available:

- Written in Go for maximum performance
- Build times measured in milliseconds
- No Node.js dependencies
- Single binary deployment

## Performance Goals

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 100ms |
| Time to Interactive | < 500ms |
| Lighthouse Score | 100 |
| Default JS Bundle | 0 KB |
| Max Runtime | < 1 KB |

## How It Works

### Static Generation

Hugo generates pure HTML at build time. No client-side rendering, no hydration, just fast HTML.

### Island Detection

When you use the `{{</* island */>}}` shortcode, Island:

1. Marks the element with `data-island` attributes
2. Detects islands during template rendering
3. Injects the minimal runtime only if islands exist

### Lazy Loading

The island runtime uses smart loading strategies:

```javascript
// idle - Load when browser is idle (default)
{{</* island name="counter" trigger="idle" */>}}

// visible - Load when scrolled into view
{{</* island name="chart" trigger="visible" */>}}

// interaction - Load on first click/touch
{{</* island name="search" trigger="interaction" */>}}
```

## Getting Started

```bash
# Create a new post
hugo new posts/my-post.md

# Add an island
{{</* island name="counter" */>}}

# Build
hugo

# Serve locally
hugo server
```

## License

MIT License - See LICENSE file for details.

---

Built with ❤️ using Hugo and PaperMod
