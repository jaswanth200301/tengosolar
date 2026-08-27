---
name: Helios Synthetica
colors:
  surface: '#091420'
  surface-dim: '#091420'
  surface-bright: '#303a48'
  surface-container-lowest: '#050f1b'
  surface-container-low: '#121c29'
  surface-container: '#16202d'
  surface-container-high: '#202b38'
  surface-container-highest: '#2b3643'
  on-surface: '#d8e3f5'
  on-surface-variant: '#d1c6ab'
  inverse-surface: '#d8e3f5'
  inverse-on-surface: '#27313e'
  outline: '#9a9077'
  outline-variant: '#4e4632'
  surface-tint: '#eec200'
  primary: '#fff0cc'
  on-primary: '#3c2f00'
  primary-container: '#ffd000'
  on-primary-container: '#6f5a00'
  inverse-primary: '#725c00'
  secondary: '#d7ffc5'
  on-secondary: '#053900'
  secondary-container: '#2ff801'
  on-secondary-container: '#0f6d00'
  tertiary: '#ffeede'
  on-tertiary: '#452b00'
  tertiary-container: '#ffcc8a'
  on-tertiary-container: '#7f5200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe082'
  primary-fixed-dim: '#eec200'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#564500'
  secondary-fixed: '#79ff5b'
  secondary-fixed-dim: '#2ae500'
  on-secondary-fixed: '#022100'
  on-secondary-fixed-variant: '#095300'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#ffb955'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#091420'
  on-background: '#d8e3f5'
  surface-variant: '#2b3643'
  sky-void: '#040E1A'
  sky-deep: '#071525'
  sky-mid: '#0E2038'
  sky-rim: '#1A3550'
  sun-core: '#FFD84D'
  sun-deep: '#E07B0A'
  cyber-lime: '#39FF14'
  dusk-plum: '#3D2159'
  text-body: '#C8DAE8'
  text-muted: '#6B8FA8'
typography:
  headline-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.12'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Outfit
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16.5px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 13.5px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11.5px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.14em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
  button:
    fontFamily: Inter
    fontSize: 14.5px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  tight: 8px
  medium: 18px
  standard: 24px
  large: 48px
  section: 80px
  container-max: 760px
  nav-max: 900px
---

## Brand & Style

The design system embodies a "Solar-punk meets High-Tech" aesthetic, bridging the gap between advanced engineering and ecological optimism. It visualizes the transition from the cold void of space to the warmth of solar energy.

The style is **Glassmorphic Minimalism with Neon Accents**. It utilizes deep, layered surfaces that mimic the vastness of the sky, punctuated by high-intensity "solar" glows and technical data overlays. The interface should feel like a futuristic command center—precise and sophisticated—yet remains approachable through soft geometry and human-centric typography. 

Key visual principles include:
- **Luminous Depth:** Surfaces are not flat; they are translucent layers that catch "light" from underlying radial gradients.
- **Technical Precision:** Monospaced accents and subtle grid overlays suggest data-driven reliability.
- **Kinetic Energy:** Subtle glows and "pulse" animations simulate the constant flow of harvested energy.

## Colors

The palette is anchored in a high-contrast dark mode to maximize the impact of "Solar Gold" and "Cyber Lime" accents. 

- **Primary & Tertiary:** Use `#FFD000` (Electric Solar Gold) and its derivatives for the "Sun Core" effect. These should be used for critical actions and energy-related data visualizations.
- **Secondary:** `#39FF14` (Cyber Lime) acts as a high-visibility accent for success states, active status indicators, and technical highlights.
- **Backgrounds:** Utilize a "Sky Stack" of deep navies. Avoid pure black; instead, use `#040E1A` as the base to maintain a sense of atmospheric depth.
- **Functionality:** All colors must maintain high contrast ratios against the dark base for accessibility. Use `sun-deep` for shadows and hover states to simulate a concentrated heat effect.

## Typography

This system uses a three-tier typographic hierarchy to separate brand voice, content, and data.

1.  **Brand (Outfit):** Heavyweights (700-800) are reserved for headlines. The geometric nature of Outfit provides a modern, clean look that feels engineered but friendly.
2.  **Interface (Inter):** Used for all standard body copy and primary UI interactions. It ensures maximum readability against dark, glowing backgrounds.
3.  **Technical (JetBrains Mono):** Used for "Eyebrow" labels, technical specs, and status markers. Always use `label-caps` for section markers to evoke a schematic or blueprint feel.

**Note:** For headers larger than 32px, use the `headline-lg-mobile` variant on devices narrower than 768px.

## Layout & Spacing

The layout philosophy follows a **Fixed Content Grid** within a fluid, atmospheric environment. 

- **Grid:** Use a 12-column system for desktop, transitioning to 4 columns for mobile. 
- **Rhythm:** Spacing is built on a 4px/8px incremental scale. Use `medium` (18px) for internal card padding and `large` (48px) for vertical separation between related content blocks.
- **Sectioning:** Large vertical gaps (`section`) should be used to separate different solar concepts (e.g., product features vs. technical specs), allowing the background gradients room to breathe.
- **Breakpoints:**
  - **Mobile:** < 640px (16px horizontal margins)
  - **Tablet:** < 1024px (24px horizontal margins)
  - **Desktop:** > 1024px (Max-width container centered)

## Elevation & Depth

Hierarchy is established through **Luminous Layering** rather than traditional shadows.

- **The Glass Effect:** All cards and modals use `backdrop-filter: blur(10px)` with a semi-transparent fill of `sky-mid` (90% opacity). This allows the background "sunlight" to subtly penetrate the UI.
- **Glow Elevation:** Instead of black shadows, elevated elements like Primary Buttons use an "Amber Glow" (`rgba(224, 123, 10, 0.3)`). This creates the illusion of the component being a light source.
- **The Horizon Line:** Use 2px linear gradients as dividers. These should fade from `sun-core` to transparent to simulate a sun-ray cutting through the darkness.
- **Z-Index Strategy:**
  - Layer 0: Background radial gradients.
  - Layer 1: Content cards with `sky-rim` borders.
  - Layer 2: Navigation and floating CTAs (Blur enabled).
  - Layer 3: Toasts and system-level alerts.

## Shapes

The shape language balances "Rounded" precision with organic flow. 

- **Containers:** Standard cards use `rounded-lg` (1rem) to feel approachable.
- **Interactive Elements:** Buttons and small tags should use `rounded-xl` or full pill shapes to distinguish them from structural containers.
- **Borders:** Use thin, 1px strokes (`sky-rim`) for most boundaries. For active states or "hot" zones, use a dual-stroke effect: a 1px solid border with an external 2px soft glow.

## Components

### Buttons
- **Primary:** Gradient fill (`sun-core` to `sun-deep`), black text, pill-shaped, with a `sun-deep` glowing shadow on hover.
- **Secondary:** Ghost style with `sky-rim` border and `sun-core` text. On hover, apply a subtle `sky-mid` background fill.

### Cards & Containers
- Cards must use the Glassmorphism style: `sky-mid` background at 90% opacity, `blur(10px)`, and a 1px `sky-rim` border. 
- Headers inside cards should use `label-caps` from the typography section.

### Input Fields
- Inputs use `sky-void` backgrounds with `sky-rim` borders. 
- Focus state: Border transitions to `sun-core` with a 4px outer glow.
- Placeholder text: Use `text-dim` in `data-mono` font style.

### Chips & Badges
- Technical chips (e.g., "Active", "1.2kW") use `JetBrains Mono` and a `sky-rim` background with `cyber-lime` text.
- Use a "pulse" animation dot (2s infinite) next to status labels to indicate live data.

### Progress & Data
- Progress bars should use a `sun-core` to `cyber-lime` horizontal gradient to represent "energy fill."
- Background of the track should be `sky-rim` at 50% opacity.