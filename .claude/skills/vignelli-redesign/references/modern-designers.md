# Modern Designer References

Specific patterns and techniques learned from contemporary minimalist designers.

---

## Emil Kowalski (emilkowal.ski)

Design engineer at Linear. Known for purposeful motion and restraint.

### Layout Patterns

```css
/* Constrained content width */
.content {
  max-width: 692px;  /* Emil's signature content width */
  margin: 0 auto;
  padding: 0 24px;
}

/* Generous vertical rhythm */
.section {
  margin-top: 4rem;   /* mt-16 */
}
@media (min-width: 640px) {
  .section {
    margin-top: 8rem; /* sm:mt-32 */
  }
}

/* Content gaps */
.stack {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;       /* gap-7 */
}
@media (min-width: 640px) {
  .stack {
    gap: 1rem;        /* sm:gap-4 */
  }
}
```

### Hover States

Emil uses subtle background shifts, never dramatic color changes:

```css
/* Subtle background hover */
.interactive {
  background: transparent;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 150ms ease;
}

.interactive:hover {
  background: #F5F4F4;  /* Very subtle gray */
}

/* Link with subtle opacity */
.link {
  color: inherit;
  opacity: 0.7;
  transition: opacity 150ms ease;
}

.link:hover {
  opacity: 1;
}
```

### Animation Timing

From Emil's drawer component and animations course:

```css
/* iOS-style spring timing */
--ease-spring: cubic-bezier(0.32, 0.72, 0, 1);

/* Standard transitions */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 500ms;

/* Apply to interactions */
.element {
  transition: transform var(--duration-slow) var(--ease-spring);
}
```

### Clip-Path Techniques

Emil considers clip-path "the most underrated CSS property":

```css
/* Reveal animation with clip-path */
@keyframes reveal {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

.reveal {
  animation: reveal 600ms var(--ease-spring) forwards;
}

/* Circular reveal from center */
@keyframes reveal-circle {
  from {
    clip-path: circle(0% at 50% 50%);
  }
  to {
    clip-path: circle(100% at 50% 50%);
  }
}
```

### Key Principles

- **Purposeful motion** — Animation should communicate, not decorate
- **Speed matters** — Fast transitions (150-200ms) feel more responsive
- **Restraint** — Limit animations to key moments
- **Direct manipulation** — Use `transform` over CSS variables for performance

---

## Jakub Krehel (jakub.kr)

Founding design engineer at Interfere. Former design lead at OpenSea.

### Shadows Instead of Borders

Jakub's signature: use subtle shadows to create separation, not borders:

```css
/* Instead of borders */
.card-old {
  border: 1px solid #e5e5e5;
}

/* Use subtle shadows */
.card {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Elevated on hover */
.card:hover {
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 4px 8px rgba(0, 0, 0, 0.08),
    0 12px 24px rgba(0, 0, 0, 0.08);
}
```

### Shadow Hierarchy

```css
/* Level 0 - Subtle definition */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Level 1 - Slight elevation */
--shadow-sm:
  0 0 0 1px rgba(0, 0, 0, 0.03),
  0 1px 3px rgba(0, 0, 0, 0.06);

/* Level 2 - Card level */
--shadow-md:
  0 0 0 1px rgba(0, 0, 0, 0.02),
  0 4px 6px rgba(0, 0, 0, 0.04),
  0 8px 16px rgba(0, 0, 0, 0.06);

/* Level 3 - Modal/overlay */
--shadow-lg:
  0 0 0 1px rgba(0, 0, 0, 0.02),
  0 8px 16px rgba(0, 0, 0, 0.06),
  0 24px 48px rgba(0, 0, 0, 0.12);
```

### Concentric Border Radius

When nesting rounded elements, inner radius must be smaller:

```css
/* Outer container */
.outer {
  border-radius: 16px;
  padding: 8px;
}

/* Inner element: outer-radius minus padding */
.inner {
  border-radius: 8px; /* 16px - 8px = 8px */
}

/* Formula: inner-radius = outer-radius - padding */
```

### Enter Animations

Jakub's approach to entrance animations:

```css
/* Scale + fade from below */
@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.enter {
  animation: enter 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Stagger with custom property */
.stagger {
  animation-delay: calc(var(--index, 0) * 50ms);
}
```

### Optical Alignment

Jakub emphasizes optical over mathematical alignment:

```css
/* Icons often need optical adjustment */
.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

/* Play icon needs right nudge */
.icon-button--play svg {
  transform: translateX(1px);
}

/* Chevron down needs bottom nudge */
.icon-button--chevron svg {
  transform: translateY(0.5px);
}
```

### Key Principles

- **Shadows over borders** — Creates softer, more natural hierarchy
- **Production polish** — Details matter at the pixel level
- **Concentric radii** — Nested corners must be mathematically related
- **Optical alignment** — Trust your eyes over the numbers

---

## Jhey Tompkins (jh3y / @jh3yy)

Creative developer specializing in CSS animations and scroll-driven interactions.

### Scroll-Driven Animations

Modern CSS scroll animations without JavaScript:

```css
/* Basic scroll-linked animation */
.element {
  animation: fade-in linear;
  animation-timeline: scroll();
  animation-range: 0 100vh;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* View-based animation (when element enters viewport) */
.element {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

### View Timeline for List Items

Highlighting items as they scroll into view:

```css
li {
  animation-name: brighten;
  animation-fill-mode: both;
  animation-timing-function: linear;
  animation-timeline: view();
  animation-range: cover calc(50% - 1lh) calc(50% + 1lh);
}

@keyframes brighten {
  0%, 100% {
    opacity: 0.3;
    color: var(--text-muted);
  }
  50% {
    opacity: 1;
    color: var(--text-primary);
  }
}
```

### Scroll Snap with Animation

Combine scroll-snap with animations:

```css
.scroll-container {
  overflow-y: auto;
  scroll-snap-type: y proximity; /* proximity, not mandatory */
  overscroll-behavior: contain;
}

.scroll-item {
  scroll-snap-align: center;
  scroll-snap-stop: normal;
}
```

### Scroll Masking

Progressive reveal with scroll:

```css
.scroller {
  animation: mask-up;
  animation-timeline: scroll(self);
  animation-range: 0 1rem;
  mask-composite: exclude;
}

@keyframes mask-up {
  to {
    mask-size: 100% 120px, 100% 100%;
  }
}
```

### Custom Properties for Dynamic Animation

Using CSS variables in keyframes:

```css
:root {
  --hue: 220;
}

.element {
  animation: shift-hue linear;
  animation-timeline: scroll();
}

@keyframes shift-hue {
  from { --hue: 220; }
  to { --hue: 360; }
}

/* Use the variable */
.colored {
  background: oklch(70% 0.15 var(--hue));
}
```

### Progressive Enhancement

Always provide fallbacks:

```css
/* Base state (no animation support) */
.element {
  opacity: 1;
}

/* Enhanced with scroll animation */
@supports (animation-timeline: scroll()) {
  .element {
    animation: fade-in linear;
    animation-timeline: scroll();
  }
}
```

### Key Principles

- **Progressive enhancement** — Features degrade gracefully
- **CSS-first** — Avoid JavaScript when CSS can do it
- **Scroll-aware** — Use `scroll()` and `view()` timelines
- **Proximity over mandatory** — Scroll-snap should feel natural

---

## Rauno Freiberg (rauno.me)

Design engineer. Known for clarity and typographic precision.

### Typography First

```css
/* Generous line height for readability */
.prose {
  font-size: 1rem;
  line-height: 1.7;
  letter-spacing: -0.01em;
}

/* Tight headlines */
.headline {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
}
```

### Monospace Accents

```css
/* Use monospace for labels and metadata */
.label {
  font-family: 'Berkeley Mono', 'SF Mono', monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
}
```

---

## Derek Briggs (wking.dev)

Design engineer focused on content-first design.

### Content-First Layout

```css
/* Let content dictate width */
.container {
  width: min(100% - 3rem, 65ch);
  margin-inline: auto;
}

/* Responsive without media queries */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 1.5rem;
}
```

### Theme Preference Detection

```css
/* System preference with override capability */
:root {
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --text: #fafafa;
  }
}

/* User override via data attribute */
[data-theme="light"] {
  --bg: #fafafa;
  --text: #0a0a0a;
}
```

---

## Combined Techniques

### The Modern Minimalist Stack

```css
/* Variables combining all approaches */
:root {
  /* Emil's timing */
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;

  /* Jakub's shadows */
  --shadow-subtle:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-elevated:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 8px 16px rgba(0, 0, 0, 0.08);

  /* Content constraints */
  --content-width: 692px;
  --wide-width: 1200px;
}

/* Modern card */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-subtle);
  transition: box-shadow var(--duration-normal) var(--ease-spring);
}

.card:hover {
  box-shadow: var(--shadow-elevated);
}

/* Scroll-enhanced section */
@supports (animation-timeline: scroll()) {
  .section {
    animation: fade-up linear;
    animation-timeline: view();
    animation-range: entry 0% entry 50%;
  }
}
```

### Anti-Pattern Comparison

| Avoid | Use Instead | Source |
|-------|-------------|--------|
| `border: 1px solid #ddd` | Subtle box-shadow | Jakub |
| CSS variable animations | Direct transform | Emil |
| `scroll-snap-type: mandatory` | `proximity` | Jhey |
| Mathematical centering | Optical alignment | Jakub |
| Heavy shadows | Layered subtle shadows | Jakub |
| Instant state changes | 150-200ms transitions | Emil |
| JavaScript scroll events | `animation-timeline: scroll()` | Jhey |

---

## Resources

- [Emil Kowalski's Animations Course](https://animations.dev/)
- [Jakub Krehel's Portfolio](https://jakub.kr/)
- [Jhey's Substack - Craft of UI](https://craftofui.substack.com/)
- [Jhey's CodePen Collection](https://codepen.io/jh3y)
- [Move Things With CSS (ebook)](https://github.com/jh3y/move-things-with-css)
