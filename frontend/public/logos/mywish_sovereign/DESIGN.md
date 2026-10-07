---
name: MyWish Sovereign
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#454652'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#767683'
  outline-variant: '#c6c5d4'
  surface-tint: '#4c56af'
  primary: '#000666'
  on-primary: '#ffffff'
  primary-container: '#1a237e'
  on-primary-container: '#8690ee'
  inverse-primary: '#bdc2ff'
  secondary: '#29695b'
  on-secondary: '#ffffff'
  secondary-container: '#acedda'
  on-secondary-container: '#2e6d5f'
  tertiary: '#380b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c1800'
  on-tertiary-container: '#e17c5a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#343d96'
  secondary-fixed: '#afefdd'
  secondary-fixed-dim: '#94d3c1'
  on-secondary-fixed: '#00201a'
  on-secondary-fixed-variant: '#065043'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#7b2e12'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is rooted in the concepts of **Trust, Authority, and Modern Sophistication**. It moves away from the cluttered density of traditional SaaS dashboards toward a "Sovereign Minimalist" aesthetic—where every element feels intentional, high-stakes, and premium.

The target audience includes professionals and institutions who value the weight of a certificate; therefore, the UI must feel as stable as a physical document but as fluid as a modern web app. We use a **Modern Corporate** style infused with **Minimalism**, characterized by generous negative space, refined typography, and a "high-definition" finish that avoids visual noise.

## Colors

The palette is anchored by **Deep Indigo (#1A237E)**, a color that evokes stability and institutional trust. 

- **Primary:** Use Deep Indigo for primary actions and brand-defining moments.
- **Backgrounds:** Utilize Off-White and Soft Grays to create a layered "canvas" feel rather than a flat white void.
- **Status Colors:** These are slightly desaturated and deepened to maintain the premium aesthetic. Success (Verified) uses a forest green rather than a bright neon green.
- **Contrast:** High contrast between text and background is maintained for accessibility, but pure blacks are avoided in favor of "Rich Charcoal" to keep the interface feeling expensive and soft on the eyes.

## Typography

The design system utilizes **Geist** for its technical precision and monolinear clarity. 

- **Hierarchy:** Use weight (Medium/SemiBold) to differentiate headings rather than just size.
- **Rhythm:** Large headings should use negative letter-spacing to appear more cohesive on high-resolution displays.
- **Utility:** Labels and captions should remain legible at small sizes; ensure they never drop below 12px.
- **Readability:** For long-form content or certificate previews, ensure a maximum line length of 65 characters to optimize scanning.

## Layout & Spacing

This design system follows a **Fixed-Fluid Hybrid** model. The main content is capped at 1200px for optimal readability on ultra-wide monitors, while the interior components utilize a flexible 12-column grid.

- **The 8px Rhythm:** All spacing tokens are multiples of 8 (or 4 for tight UI elements), ensuring a consistent vertical cadence.
- **Desktop Strategy:** Focus on "breathe room." Use `stack-lg` (32px) between major sections to prevent the UI from feeling like a spreadsheet.
- **Mobile Strategy:** Tighten margins to 16px and use `stack-sm` for related input groups to maximize vertical real estate.

## Elevation & Depth

We employ a **Tonal Layering** approach combined with **Ambient Shadows**. Instead of traditional drop shadows that look "muddy," we use multi-layered shadows with a slight tint of the primary color to create a sense of natural height.

- **Level 0 (Base):** Off-white (#F8F9FA) background.
- **Level 1 (Cards):** Pure White (#FFFFFF) with a 1px border (#E0E0E0) and a very soft, diffused shadow (Blur 12px, Spread -2px, 4% Opacity).
- **Level 2 (Modals/Popovers):** Higher elevation with a more pronounced shadow to indicate focus.
- **Interaction:** On hover, buttons and interactive cards should "lift" slightly (shadow deepens, element shifts -2px Y-axis) to provide tactile feedback.

## Shapes

The shape language is **Rounded**, using an 8px base for standard components. This strikes a balance between the sharpness of a professional tool and the approachability of a modern web app.

- **Standard (8px):** Buttons, Input fields, and small UI widgets.
- **Large (16px):** Content cards and certificate preview containers.
- **Pill:** Reserved exclusively for "Status Chips" (e.g., Verified, Pending, Revoked) to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Deep Indigo background, white text. No gradient. High-contrast hover state (slight darken).
- **Secondary:** Ghost style with a 1.5px border in Indigo or Charcoal.
- **Size:** 44px height minimum for touch/click ergonomics.

### Input Fields
- **Default:** White background, 1px light gray border.
- **Focus:** 2px solid Indigo border with a subtle outer glow.
- **Labels:** Always positioned above the field in `label-md` weight.

### Cards
- Used to wrap all certificate information.
- Use a 1px border to define the edge rather than heavy shadows.
- Header sections within cards should have a subtle gray background (#F4F5F7) to separate metadata from the main content.

### Navigation
- **Sidebar:** Minimalist with icons + text. Active state indicated by a vertical 4px bar of the primary color on the left.
- **Breadcrumbs:** Essential for the "Guided" feel; use `label-md` in secondary text color.

### Verification Chips
- Success: Deep Green text on a very pale green background (10% opacity).
- Warning: Deep Amber text on a pale amber background.
- These should always use the Pill shape (rounded-xl).