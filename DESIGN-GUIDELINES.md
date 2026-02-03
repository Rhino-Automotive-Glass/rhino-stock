# Rhino Design Guidelines

Reference document for layout spacing and structure conventions shared across Rhino projects (rhino-stock, rhino-origin). Use as context when prompting LLMs to generate or modify UI code.

---

## Page Structure

Every page follows this skeleton:

```tsx
<div className="min-h-screen bg-background">
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</div>
```

---

## Container Width

All top-level sections (header inner wrapper, main, footer inner wrapper) use the same max-width and centering:

```
max-w-[1600px] mx-auto
```

Never use `w-full` alone as a replacement. Never use Tailwind preset max-widths (`max-w-4xl`, `max-w-7xl`, etc.) — use the explicit `max-w-[1600px]` value consistently.

---

## Responsive Horizontal Padding

All top-level containers use responsive horizontal padding instead of a single fixed value:

```
px-4 sm:px-6 lg:px-8
```

| Breakpoint | Padding |
|------------|---------|
| default    | 1rem (16px) |
| sm (640px) | 1.5rem (24px) |
| lg (1024px)| 2rem (32px) |

---

## Vertical Padding by Section

| Section | Classes | Padding |
|---------|---------|---------|
| Header  | `py-4`  | 1rem top and bottom |
| Main    | `py-8`  | 2rem top and bottom |
| Footer  | `py-4`  | 1rem top and bottom |

---

## Header

```tsx
<header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
  <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
    <!-- Logo + brand left, actions right -->
  </div>
</header>
```

- Layout: `flex items-center justify-between`
- Logo-to-text gap: `gap-3`
- Logo icon size: `w-10 h-10 rounded-lg bg-blue-600`
- Brand title: `text-xl font-semibold` (or `font-bold`)
- Brand subtitle: `text-xs text-gray-500 dark:text-gray-400` (stock) / `text-sm` (origin)
- Right side actions stacked with `gap-4` if multiple items are present

---

## Footer

```tsx
<footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
  <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <p className="text-center text-sm text-gray-500 dark:text-gray-400">...</p>
  </div>
</footer>
```

- `mt-auto` pushes footer to bottom when page content is short
- Border color matches header: `border-gray-200 dark:border-gray-700`

---

## Page Title Section

Title and subtitle sit outside any card, directly inside main before the card:

```tsx
<main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="mb-6">
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
      Page Title
    </h2>
    <p className="mt-1 text-gray-600 dark:text-gray-400">
      Subtitle or description
    </p>
  </div>

  <div className="card ...">...</div>
</main>
```

- Title-to-subtitle gap: `mt-1` on the `<p>`
- Title block bottom margin: `mb-6`
- If a button sits on the same row as the title, wrap both in `flex items-center justify-between`

---

## Buttons in Page Title Row

Outline/secondary buttons next to the page title:

```
px-4 py-2 text-sm font-medium
text-gray-700 dark:text-gray-200
hover:text-gray-900 dark:hover:text-white
transition-colors flex items-center gap-2
border border-gray-200 dark:border-gray-700 rounded-lg
```

Primary action buttons (e.g., "Agregar"):

```
btn btn-primary btn-md flex items-center gap-2
```

---

## Cards

Cards use the shared `.card` CSS class. Internal padding is `p-6 md:p-8`.

```tsx
<div className="card p-6 md:p-8">
  ...
</div>
```

Card styles (in globals.css):
- Light: `bg-white`, `border: 1px solid #e2e8f0`, soft box-shadow
- Dark: `bg-gray-800` (stock) / `bg-gray-700` (origin), `border-color: #374151`

---

## Borders and Dividers

Consistent border palette across the app:

| Usage | Light | Dark |
|-------|-------|------|
| Header/footer borders | `border-gray-200` | `dark:border-gray-700` |
| Card borders | via `.card` class | via `.dark .card` |
| Section dividers (`<hr>`) | `border-gray-200` | `dark:border-gray-700` |
| Input borders | `border-gray-300` (via `.input-base`) | `dark:border-gray-600` |

---

## Spacing Quick Reference

| Token | Value | Common usage |
|-------|-------|--------------|
| `gap-2` | 0.5rem | Icon-to-label inside a button |
| `gap-3` | 0.75rem | Logo-to-brand-text in header |
| `gap-4` | 1rem | Between header action items; grid columns |
| `mb-1` | 0.25rem | Label above an input field |
| `mt-1` | 0.25rem | Subtitle below a heading |
| `mb-3` | 0.75rem | Section title inside a bordered group |
| `mt-3 pt-3` | 0.75rem | Status row separated by border inside a card |
| `mb-6` | 1.5rem | Page title block bottom margin; section separator inside a card |
| `mt-4` | 1rem | Divider below subtitle |
| `mt-6 pt-6` | 1.5rem | Navigation row with top border |
| `p-4` | 1rem | Grouped field sections inside a card |
| `p-6` | 1.5rem | Card internal padding (base) |
| `p-8` | 2rem | Card internal padding (md breakpoint) |
| `px-6 py-3` | 1.5rem / 0.75rem | Table header cells |
| `px-6 py-4` | 1.5rem / 1rem | Table body cells |

---

## Dark Mode

- Always pair light and dark classes together
- Background: `bg-white dark:bg-gray-800` (cards, header) / `bg-gray-50 dark:bg-gray-900` (page bg in origin)
- Text: `text-gray-900 dark:text-white` (headings) / `text-gray-600 dark:text-gray-400` (body) / `text-gray-500 dark:text-gray-400` (muted)
- The root `<html>` tag carries the `dark` class; CSS uses `@custom-variant dark (&:where(.dark, .dark *));`
