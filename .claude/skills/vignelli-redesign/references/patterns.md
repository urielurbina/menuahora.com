# Vignelli Design Patterns

> **Note:** All examples below use placeholder color classes like `bg-gray-900` or `text-gray-500`.
> When implementing, **always replace these with the project's actual brand colors** from `globals.css`.
>
> Example mappings for this project:
> - `bg-gray-100` → `bg-cream` or `bg-[#f6f3ec]`
> - `text-gray-900` → `text-[#1a1a1a]` or `text-dark-brown`
> - `text-gray-500` → `text-[#5a5a5a]`
> - `border-gray-200` → `border-[#d7cbb5]`
> - Accent → Use brand reds: `text-red`, `bg-bright-red`, etc.

## Section Layouts

### The Split

Two-column asymmetric layout with generous gutter:

```tsx
function SplitSection({
  heading,
  content,
  media
}: SplitSectionProps) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Text column - narrower */}
          <div className="lg:col-span-5 lg:col-start-1">
            <h2 className="text-3xl lg:text-4xl text-gray-900 tracking-tight leading-tight">
              {heading}
            </h2>
            <div className="mt-8 text-gray-600 leading-relaxed space-y-4">
              {content}
            </div>
          </div>

          {/* Media column - wider */}
          <div className="lg:col-span-6 lg:col-start-7">
            {media}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### The Stack

Vertical rhythm with generous spacing:

```tsx
function StackSection({ items }: { items: Item[] }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-6">
        {items.map((item, index) => (
          <article
            key={index}
            className={cn(
              "py-12 lg:py-16",
              index !== items.length - 1 && "border-b border-gray-200"
            )}
          >
            <span className="text-xs text-gray-400 font-mono tracking-wider uppercase">
              {item.label}
            </span>
            <h3 className="text-2xl lg:text-3xl text-gray-900 mt-3 tracking-tight">
              {item.title}
            </h3>
            <p className="text-gray-500 mt-4 leading-relaxed">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### The Grid

Clean grid with single-pixel borders:

```tsx
function GridSection({ items }: { items: GridItem[] }) {
  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        <header className="mb-16">
          <h2 className="text-3xl lg:text-4xl text-gray-900 tracking-tight">
            Features
          </h2>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 lg:p-10"
            >
              <span className="text-4xl text-gray-300 font-light">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg text-gray-900 mt-6 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### The Hero

Minimal hero with impactful typography:

```tsx
function HeroSection({
  title,
  subtitle,
  cta
}: HeroProps) {
  return (
    <section className="min-h-[80vh] flex items-center py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-16">
        <h1
          className="text-gray-900 tracking-tight leading-none"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="text-gray-500 text-lg lg:text-xl mt-8 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {cta && (
          <div className="mt-12">
            <a
              href={cta.href}
              className="inline-block text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
```

## Typography Patterns

### Large Quote

```tsx
function Quote({ text, author }: { text: string; author: string }) {
  return (
    <blockquote className="py-16 lg:py-24 border-y border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        <p
          className="text-gray-900 font-light leading-relaxed"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
        >
          "{text}"
        </p>
        <cite className="block mt-8 text-gray-400 text-sm not-italic">
          — {author}
        </cite>
      </div>
    </blockquote>
  );
}
```

### Monospaced Label

```tsx
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-mono text-gray-400 uppercase tracking-widest">
      {children}
    </span>
  );
}
```

### Numeric Display

```tsx
function NumericDisplay({
  value,
  label,
  suffix = ''
}: {
  value: string | number;
  label: string;
  suffix?: string;
}) {
  return (
    <div>
      <span className="text-5xl lg:text-7xl font-light text-gray-900 tracking-tighter">
        {value}
        {suffix && <span className="text-gray-400">{suffix}</span>}
      </span>
      <span className="block mt-2 text-sm text-gray-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
```

## Interactive Patterns

### Minimal Button

```tsx
function Button({
  children,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      className={cn(
        "px-6 py-3 text-sm transition-colors",
        variant === 'primary' && "bg-gray-900 text-white hover:bg-gray-800",
        variant === 'secondary' && "border border-gray-300 text-gray-900 hover:border-gray-900",
        variant === 'ghost' && "text-gray-600 hover:text-gray-900"
      )}
    >
      {children}
    </button>
  );
}
```

### Link with Underline

```tsx
function UnderlineLink({ href, children }: LinkProps) {
  return (
    <a
      href={href}
      className="relative inline-block text-gray-900 group"
    >
      {children}
      <span
        className="absolute left-0 bottom-0 w-full h-px bg-gray-900 origin-left scale-x-100 transition-transform duration-300 group-hover:scale-x-0"
      />
    </a>
  );
}
```

### Expanding Card

```tsx
function ExpandingCard({ title, preview, content }: ExpandingCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg text-gray-900 group-hover:text-gray-600 transition-colors">
          {title}
        </span>
        <span
          className={cn(
            "text-gray-400 transition-transform duration-300",
            isOpen && "rotate-45"
          )}
        >
          +
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-500",
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        )}
      >
        <p className="text-gray-500 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}
```

## List Patterns

### Numbered List

```tsx
function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="flex gap-6">
          <span className="text-gray-300 font-mono text-sm w-6 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-gray-600">{item}</span>
        </li>
      ))}
    </ol>
  );
}
```

### Horizontal List

```tsx
function HorizontalList({ items, separator = '/' }: HorizontalListProps) {
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-3">
          {item}
          {index < items.length - 1 && (
            <span className="text-gray-300">{separator}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
```

## Navigation Patterns

### Minimal Nav

```tsx
function MinimalNav({ links }: { links: NavLink[] }) {
  return (
    <nav className="py-6 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="/" className="text-gray-900 font-medium">
          Logo
        </a>

        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
```

### Footer

```tsx
function MinimalFooter() {
  return (
    <footer className="py-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="text-sm text-gray-400">
            © {new Date().getFullYear()}
          </span>

          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Twitter
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              GitHub
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

## Animation Classes

### Tailwind Utilities

```css
/* Add to tailwind.config or global CSS */

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-up {
  animation: fade-up 600ms ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 500ms ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 500ms ease-out forwards;
}

/* Stagger delays */
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
.stagger-4 { animation-delay: 200ms; }
.stagger-5 { animation-delay: 250ms; }
```

### Intersection Observer Hook

```tsx
function useInView(options = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// Usage
function AnimatedSection({ children }) {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {children}
    </section>
  );
}
```
