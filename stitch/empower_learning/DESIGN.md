---
name: Empower Learning
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444651'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#252a32'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b4049'
  on-tertiary-container: '#a7acb6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#dee2ed'
  tertiary-fixed-dim: '#c2c6d1'
  on-tertiary-fixed: '#171c23'
  on-tertiary-fixed-variant: '#424750'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
  display-lg-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The brand personality is authoritative yet encouraging, designed to foster a sense of academic excellence and personal growth. The target audience includes students and educators seeking a structured, distraction-free learning environment. 

The design system employs a **Modern Corporate** style with **Minimalist** leanings. It prioritizes clarity and high-contrast visuals to ensure that educational content remains the focal point. By utilizing generous whitespace and a restricted color palette, the UI evokes an emotional response of focus, reliability, and intellectual empowerment. The aesthetic is clean, professional, and systematically organized to reduce cognitive load.

## Colors
The palette is rooted in a "Deep Blue" primary shade to establish institutional trust and stability. "Vibrant Blue" is reserved strictly for interactive elements, progress indicators, and primary calls to action to guide the student’s journey. 

A "Tertiary Blue" tint provides subtle background categorization for cards and highlighted sections without breaking the minimalist aesthetic. The neutral scale favors a cool slate-gray for secondary text and borders, maintaining a high contrast ratio against the clean white background to ensure maximum readability for long-form educational content.

## Typography
This design system utilizes **IBM Plex Sans Arabic** for its exceptional legibility and systematic structure. The typeface balances technical precision with the fluid nature of Arabic script, making it ideal for an educational context.

Headlines are set with a heavier weight (600-700) to provide a clear information hierarchy, while body text uses a generous 1.5x line height to prevent eye fatigue during reading. For mobile devices, display sizes are scaled down to maintain layout integrity while preserving the bold, empowering character of the brand. All text alignment is prioritized for Right-to-Left (RTL) reading patterns.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop to ensure content remains centered and readable, transitioning to a **Fluid Grid** for mobile and tablet devices. 

A 12-column system is used for desktop (breakpoint: 1024px+), while a 4-column system is used for mobile (below 600px). The spacing rhythm is strictly based on an 8px base unit. This consistency creates a rhythmic, professional feel across the platform. Sections are separated by large vertical gaps (64px - 80px) to give students "room to breathe" between different learning modules.

## Elevation & Depth
To maintain a modern and clean aesthetic, depth is communicated through **Tonal Layers** and **Low-Contrast Outlines**. 

Surfaces primarily sit on a "Level 0" white background. Interactive cards use a subtle 1px border in a light neutral shade. **Ambient Shadows** are applied only to floating elements like dropdowns, modals, or active "lesson cards" to give them a gentle lift. These shadows are highly diffused with a very low opacity (5-8%) and a slight Deep Blue tint to keep them integrated with the brand palette. This approach avoids the visual "clutter" of heavy shadows while still providing necessary affordance.

## Shapes
The shape language is **Soft**. A 0.25rem (4px) base radius is applied to small components like input fields and checkboxes, while larger components like buttons and cards use 0.5rem (8px). 

This slight rounding softens the "Corporate" feel of the blue palette, making the interface feel more welcoming and accessible to students. It strikes a balance between the precision of sharp corners and the playfulness of pill shapes, maintaining a professional academic tone.

## Components
- **Buttons**: Primary buttons are solid "Vibrant Blue" with white text. Secondary buttons use "Deep Blue" outlines. All buttons feature a 0.5rem corner radius and a subtle hover state that deepens the color.
- **Input Fields**: Clean 1px neutral borders that transition to "Vibrant Blue" on focus. Labels are positioned above the field using the `label-lg` typography.
- **Cards**: Minimalist white backgrounds with a subtle border. For lesson cards, use a "Tertiary Blue" background to indicate completion or active status.
- **Chips**: Small, 4px rounded labels used for course categories or difficulty levels, utilizing low-saturation background tints.
- **Progress Bars**: High-contrast "Vibrant Blue" fills against a "Tertiary Blue" track to provide clear visual feedback on student progress.
- **Lists**: Lesson lists use 16px vertical padding between items with a light divider line, ensuring each topic is distinct and readable.
- **Navigation**: A clean top bar with "Deep Blue" typography for primary links and a "Vibrant Blue" button for the main CTA (e.g., "Start Learning").