---
name: vignelli-redesign
description: Redesign sections with elevated minimalist aesthetics inspired by Massimo Vignelli. Use when the user wants to redesign, elevate, or refine a section with clean, intellectual, grid-based design. Triggers on "redesign section", "vignelli style", "minimalist redesign", "elevate design", "clean modern design", or "refined aesthetic".
---

# Vignelli-Inspired Section Redesign

Transform sections into intellectually elegant, timeless designs following principles from Massimo Vignelli and modern minimalist web designers like Emil Kowalski, Jakub Krehel, and jh3y.

## Before Starting: Discover Brand Assets

**CRITICAL:** Before redesigning any section, ALWAYS read the project's design system:

1. **Read `globals.css`** — Find color variables, fonts, and existing animations
2. **Check existing components** — Understand the visual language already in use
3. **Use brand colors only** — Never introduce new colors; work within the palette
4. **Use brand fonts only** — Reference font variables, don't hardcode font families

```bash
# Run these first
cat src/app/globals.css
grep -r "@theme" src/app/globals.css
```

## Core Philosophy

**"If you can design one thing, you can design everything."** — Massimo Vignelli

The goal is intellectual elegance through restraint. Every element must serve a function. Remove the unnecessary until only the essential remains.

### The Vignelli Canon Principles

1. **Semantics** — The meaning behind the design
2. **Syntactics** — The structure and relationships
3. **Pragmatics** — The practical execution

## Design DNA

### No Gradients. No Gimmicks.

This aesthetic rejects:
- Gradient backgrounds (especially purple/blue fades)
- Glassmorphism and blur effects
- Heavy drop shadows (use subtle layered shadows instead)
- Hard borders (use subtle shadows for separation — Jakub Krehel)
- Decorative elements without function
- Busy patterns and textures
- Rounded corners everywhere (be intentional)
- Generic AI aesthetics

This aesthetic embraces:
- Solid, intentional colors
- Subtle layered shadows for depth (not borders)
- Sharp edges OR intentional consistent radii
- Generous negative space
- Strong typographic hierarchy
- Grid-based precision
- Purposeful restraint
- Timeless over trendy
- Fast, responsive micro-interactions (150-200ms)

## Typography

### Use the Project's Font Stack

**IMPORTANT:** Always use the fonts defined in the project's `globals.css`. Read the font variables before redesigning.

### Discovering Brand Fonts

Before redesigning, check the project's typography:

```bash
# Look for font definitions
grep -r "font-family" src/app/globals.css
```

### Example: This Project's Fonts

```css
/* Headings - Owners Narrow Bold */
--font-heading: "Owners Narrow Bold", "Arial Narrow", sans-serif;

/* Script/Display - Owners Medium */
--font-script: "Owners Medium", "Georgia", serif;

/* Body - Neue Haas Grotesk Display Pro */
--font-body: "Neue Haas Grotesk Display Pro", "Helvetica Neue", sans-serif;
--font-body-medium: "Neue Haas Grotesk Display Pro Medium", "Helvetica Neue", sans-serif;
--font-body-bold: "Neue Haas Grotesk Display Pro Bold", "Helvetica Neue", sans-serif;
```

Note: Neue Haas Grotesk is the original name of Helvetica — this project already uses a Vignelli-approved typeface.

### Typographic Hierarchy

Establish hierarchy through **scale alone**, not weight or style:
- Avoid bold for emphasis within body text
- Avoid italics except for proper typographic conventions
- Use size differences of at least 1.25x between levels
- Limit to 3-4 type sizes per section

```css
/* Vignelli-inspired type scale */
--text-xs: 0.75rem;      /* 12px - Labels, meta */
--text-sm: 0.875rem;     /* 14px - Secondary */
--text-base: 1rem;       /* 16px - Body */
--text-lg: 1.25rem;      /* 20px - Lead */
--text-xl: 1.5rem;       /* 24px - Subhead */
--text-2xl: 2rem;        /* 32px - Section */
--text-3xl: 2.5rem;      /* 40px - Major */
--text-4xl: 3.5rem;      /* 56px - Hero */
--text-5xl: 4.5rem;      /* 72px - Display */
```

### Text Treatment

- **Line height**: 1.4-1.5 for body, 1.1-1.2 for headlines
- **Letter spacing**: Slight tracking on uppercase (0.05em)
- **Measure**: 45-75 characters per line max
- **Alignment**: Left-aligned or justified, never centered for body

## Color Palette

### Use the Project's Brand Colors

**IMPORTANT:** Always use the colors defined in the project's `globals.css`. Read the theme variables before redesigning. The colors are accessed via CSS variables or Tailwind classes.

### Discovering Brand Colors

Before redesigning, check the project's color system:

```bash
# Look for color definitions in globals.css or tailwind config
grep -r "color" src/app/globals.css
```

### Example: This Project's Palette

```css
/* Brand foundations */
--color-cream: #f6f3ec;           /* Primary background */
--color-dark-brown: #2a1a0e;      /* Deep text */

/* Red spectrum - brand accent */
--color-dark-red: #6b1517;        /* Deep accent */
--color-hero-red: #7a1a1c;        /* Hero sections */
--color-red: #e01a1a;             /* Primary accent */
--color-bright-red: #e52020;      /* CTAs, emphasis */
--color-footer-red: #c91a1a;      /* Footer accent */
--color-badge-red: #cc0000;       /* Badges */

/* Gold & neutral tones */
--color-gold: #c9a96e;            /* Premium accent */
--color-text-cream: #f0e8d8;      /* Light text on dark */
--color-text-light: #d4c4a8;      /* Secondary text */

/* Derived grays from brand */
#1a1a1a                           /* Primary text */
#5a5a5a                           /* Secondary text */
#8a8a8a                           /* Tertiary text */
```

### Color Application Rules

1. **Use brand colors only** — Pull from the project's CSS variables
2. **90/10 rule** — 90% neutral (cream, brown, gray), 10% accent (red, gold)
3. **No gradients** — Solid fills only
4. **High contrast** — Text must be clearly readable against backgrounds
5. **Consistent accent** — Same accent color throughout the section
6. **Read globals.css first** — Always check for existing color definitions

## Layout & Grid

### Grid System

Use a strict grid system as the structural backbone:

```css
/* 12-column grid with generous gutters */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 48px;
    gap: 32px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 64px;
    gap: 48px;
  }
}
```

### Spacing Scale

Use a consistent spacing system based on 4px or 8px:

```css
/* 8px base unit */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
--space-8: 3rem;      /* 48px */
--space-10: 4rem;     /* 64px */
--space-12: 6rem;     /* 96px */
--space-16: 8rem;     /* 128px */
```

### Section Rhythm

- **Generous vertical padding**: py-16 to py-32 (128px-256px)
- **Clear visual separation**: through space, not lines
- **Asymmetric layouts**: break symmetry intentionally
- **Content containers**: max-w-[680px] for text, max-w-[1200px] for full layouts

## Interaction Design

### Hover States

Subtle, purposeful transitions:

```css
/* Minimal hover - opacity shift */
.link {
  opacity: 0.6;
  transition: opacity 200ms ease;
}
.link:hover {
  opacity: 1;
}

/* Underline reveal */
.link-underline {
  position: relative;
}
.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 300ms ease;
}
.link-underline:hover::after {
  width: 100%;
}

/* Background shift */
.card {
  background: transparent;
  transition: background 200ms ease;
}
.card:hover {
  background: var(--gray-100);
}
```

### Animations

Keep animations purposeful and restrained:

```css
/* Entry animation - simple fade up */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeUp 600ms ease-out forwards;
}

/* Stagger children */
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 50ms; }
.stagger > *:nth-child(3) { animation-delay: 100ms; }
.stagger > *:nth-child(4) { animation-delay: 150ms; }
```

### Motion Principles

- **Duration**: 200-400ms for micro-interactions, 600-800ms for reveals
- **Easing**: ease-out for entrances, ease-in-out for transforms
- **Purpose**: Animation should communicate, not decorate
- **Restraint**: When in doubt, don't animate

## Component Patterns

### Section Header

```tsx
function SectionHeader({
  title,
  subtitle,
  alignment = 'left'
}: {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
}) {
  return (
    <header className={cn(
      "mb-16 lg:mb-24",
      alignment === 'center' && "text-center"
    )}>
      <h2 className="font-normal text-gray-900 tracking-tight"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-gray-500 max-w-lg text-lg leading-relaxed"
          style={alignment === 'center' ? { margin: '1rem auto 0' } : undefined}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
```

### Feature List

```tsx
function FeatureList({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-px bg-gray-200">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white p-8 lg:p-12 group"
        >
          <span className="text-gray-400 text-sm font-mono mb-4 block">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-xl text-gray-900 mb-3">
            {feature.title}
          </h3>
          <p className="text-gray-500 leading-relaxed max-w-md">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Stat Display

```tsx
function Stats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-900">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-8 lg:p-12">
          <span className="text-4xl lg:text-5xl text-gray-900 font-light tracking-tight block">
            {stat.value}
          </span>
          <span className="text-gray-500 text-sm mt-2 block">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
```

### Minimal Card (Jakub-style shadows)

```tsx
function Card({ title, description, href }: CardProps) {
  return (
    <a
      href={href}
      className="block p-6 bg-white rounded-lg transition-shadow duration-200"
      style={{
        boxShadow: `
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 2px 4px rgba(0, 0, 0, 0.05)
        `
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 8px 16px rgba(0, 0, 0, 0.08)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 2px 4px rgba(0, 0, 0, 0.05)
        `;
      }}
    >
      <h3 className="text-lg text-[#1a1a1a] mb-2">{title}</h3>
      <p className="text-[#5a5a5a] text-sm leading-relaxed">{description}</p>
      <span className="text-[#8a8a8a] text-sm mt-4 inline-block">
        Read more →
      </span>
    </a>
  );
}

/* Or with Tailwind classes */
function CardTailwind({ title, description, href }: CardProps) {
  return (
    <a
      href={href}
      className="block p-6 bg-white rounded-lg
        shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05)]
        hover:shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_8px_16px_rgba(0,0,0,0.08)]
        transition-shadow duration-200"
    >
      {/* ... */}
    </a>
  );
}
```

## Redesign Process

When redesigning a section:

### 1. Audit

- What is the section's purpose?
- What content is essential?
- What can be removed?

### 2. Simplify

- Remove decorative elements
- Eliminate gradients and shadows
- Strip to essential content
- Question every element: "Does this serve the message?"

### 3. Structure

- Apply grid system
- Establish clear hierarchy
- Create breathing room with space
- Align elements to baseline

### 4. Refine

- Select appropriate typeface
- Apply minimal color palette
- Add purposeful hover states
- Implement subtle entrance animations

### 5. Polish

- Check text contrast (WCAG AA minimum)
- Verify responsive behavior
- Test animations at 0.5x speed
- Remove any remaining decoration

## Examples: Before & After

### Feature Cards

**Before (Generic):**
- Gradient backgrounds
- Heavy shadows
- Rounded corners
- Icon in colored circle
- Multiple colors

**After (Vignelli):**
- Solid white background
- Single pixel border
- Sharp corners
- Icon as simple line art
- Black text, one accent color

### Headers

**Before (Generic):**
- Centered text
- Decorative underline with gradient
- Subtitle in different color
- Badge or label above

**After (Vignelli):**
- Left-aligned
- No decorative elements
- Hierarchy through size only
- Clean, single color

### Stats

**Before (Generic):**
- Cards with shadows
- Icons next to numbers
- Multiple background colors
- Rounded corners

**After (Vignelli):**
- Simple grid with 1px dividers
- Numbers only, large scale
- White background
- Labels in muted gray

## Modern Designer Patterns

See `references/modern-designers.md` for detailed code examples.

### Emil Kowalski (emilkowal.ski)

Design engineer at Linear. Master of purposeful motion.

**Key patterns:**
- **Constrained width**: `max-width: 692px` for content
- **iOS-style easing**: `cubic-bezier(0.32, 0.72, 0, 1)`
- **Fast transitions**: 150-200ms for micro-interactions
- **Subtle hovers**: Background shifts to `#F5F4F4`, not color changes
- **Clip-path reveals**: Use `clip-path` for elegant entrance animations

```css
/* Emil's signature hover */
.interactive:hover {
  background: #F5F4F4;
}

/* Emil's spring easing */
transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);
```

### Jakub Krehel (jakub.kr)

Founding design engineer at Interfere. Former OpenSea design lead.

**Key patterns:**
- **Shadows over borders** — Use layered subtle shadows instead of 1px borders
- **Concentric border-radius** — Inner radius = outer radius - padding
- **Optical alignment** — Trust eyes over math, nudge icons as needed
- **Enter animations** — Scale + fade with spring easing

```css
/* Jakub: Use this instead of borders */
.card {
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.05);
}

.card:hover {
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 8px 16px rgba(0, 0, 0, 0.08);
}

/* Concentric radius */
.outer { border-radius: 16px; padding: 8px; }
.inner { border-radius: 8px; } /* 16 - 8 = 8 */
```

### Jhey Tompkins (jh3y)

Creative CSS developer. Scroll animation specialist.

**Key patterns:**
- **Scroll-driven animations** — Use `animation-timeline: scroll()` or `view()`
- **Proximity scroll-snap** — Use `proximity` not `mandatory`
- **CSS-first** — Avoid JavaScript when CSS works
- **Progressive enhancement** — Feature-detect with `@supports`

```css
/* Jhey: Scroll-linked fade */
.element {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

/* Progressive enhancement */
@supports (animation-timeline: scroll()) {
  .element {
    animation: reveal linear;
    animation-timeline: scroll();
  }
}
```

## Anti-Patterns to Avoid

| Avoid | Use Instead | Why |
|-------|-------------|-----|
| `border: 1px solid #ddd` | Subtle box-shadow | Jakub: Softer, more refined |
| Heavy drop shadows | Layered subtle shadows | Jakub: Natural depth |
| Instant state changes | 150-200ms transitions | Emil: Feels responsive |
| `scroll-snap-type: mandatory` | `proximity` | Jhey: Feels natural |
| JavaScript scroll events | `animation-timeline: scroll()` | Jhey: CSS-first |
| Mathematical centering | Optical alignment | Jakub: Trust your eyes |
| Gradients for interest | Solid colors + space | Vignelli: Restraint |
| Rounded corners everywhere | Sharp corners or consistent radii | Vignelli: Intentionality |

## What NOT to Do

- Add shadows for "depth" without purpose
- Use gradients for "visual interest"
- Center everything (left-align body text)
- Use more than 2-3 colors
- Add decorative borders
- Animate everything
- Use generic icon libraries
- Add patterns "because it looks empty"

Remember: Empty space is not "nothing" — it's a design element. Embrace the void.

---

*"The life of a designer is a life of fight: fight against the ugliness."* — Massimo Vignelli
