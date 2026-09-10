---
name: game-ui-ux-polisher
description: >-
  Visual styling, tactile micro-interactions, responsive mobile/iPad UI scaling,
  glassmorphism, CSS 3D card tilts, particle effects, and Web Audio sound design for web games.
  Use when enhancing game visuals, styling headers, creating tactile buttons, or optimizing mobile viewports.
---

# Game UI / UX & Visual Polish Skill

This skill provides design systems, CSS micro-interactions, responsive scaling patterns, and audio-visual punch to elevate web games into polished experiences.

---

## 1. Tactical Glassmorphism & Cyber/Fantasy HUD Design

### 1. Card & Panel Glassmorphic Base
```css
.game-glass-panel {
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
}
```

### 2. Glowing Stat Badges (No Squashed Text)
* Always structure stat cards with clear hierarchy:
  1. `.stat-label`: 11px uppercase bold muted text (`letter-spacing: 1.2px`).
  2. `.stat-value`: 24px bold colored accent (Gold, Cyan, Emerald).
  3. `.stat-sub`: 12px secondary explanation.

---

## 2. 3D Card Interactions & Micro-Animations

### 1. 3D Perspective Tilt on Hover / Touch
```css
.card-3d-wrap {
    perspective: 1000px;
    transform-style: preserve-3d;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-3d-wrap:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
}
```

### 2. High-Tier Holographic & Shimmer Gradients
```css
.rarity-mythic-glow {
    border-color: #ec4899;
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
    animation: neonPulse 2s infinite alternate;
}

@keyframes neonPulse {
    0% { filter: drop-shadow(0 0 4px rgba(236, 72, 153, 0.4)); }
    100% { filter: drop-shadow(0 0 16px rgba(236, 72, 153, 0.9)); }
}
```

---

## 3. Mobile, Tablet (iPad), and Desktop Responsiveness

### 1. Viewport Scaling & Safe Areas
* Always configure viewport meta tag:
  `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">`
* Use `100dvh` for fullscreen arenas to avoid mobile browser address bar jumps.
* Enforce `aspect-ratio: 1 / 1` for player card photos to prevent image distortion on tablets.

### 2. Touch Responsiveness
* Disable callout and tap highlight:
  ```css
  * {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
  }
  ```
