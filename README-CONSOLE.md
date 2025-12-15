# Hero Gradient - Console Commands

Control the gradient animation live via browser console.

## Quick Access

```javascript
// Get animation instance
const anim = document.querySelector('.wp-block-hero-gradient')._heroGradientAnimation;

// Change any setting
anim.updateSetting('settingName', value);
```

---

## Animation Stability

**Settings updates preserve animation state** - perfect for scroll-based animations!

When you update settings via `updateSetting()`, the gradient animation maintains its visual continuity:
- Gradient positions and phases are preserved
- Colors and sizes update smoothly without "jumping"
- Only changing `gradientCount` will add/remove gradients

This makes the gradient ideal for scroll-driven animations where you interpolate settings based on scroll position. The animation will smoothly transition between states without resetting.

---

## Available Settings

### Animation & Movement

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `gradientSpeed` | number | 0.5 | Animation speed |
| `gradientCount` | number | 5 | Number of gradient blobs |
| `positionX` | number | 0.5 | Center X position (0-1) |
| `positionY` | number | 0.5 | Center Y position (0-1) |

```javascript
anim.updateSetting('gradientSpeed', 1.5);
anim.updateSetting('gradientCount', 8);
anim.updateSetting('positionX', 0.3);
anim.updateSetting('positionY', 0.7);
```

---

### Movement Patterns

Control how gradients move around the canvas with 10 different animation patterns.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `movementMode` | string | 'orbit' | Movement pattern type |
| `amplitudeX` | number | 10 | Horizontal movement range (% of width) |
| `amplitudeY` | number | 15 | Vertical movement range (% of height) |

**Available Movement Modes:**

| Mode | Value | Description |
|------|-------|-------------|
| Orbit | `'orbit'` | Elliptical sine/cosine pattern (default) |
| Wave | `'wave'` | Horizontal wave with vertical oscillation |
| Pulse | `'pulse'` | Radial expansion/contraction from center |
| Drift | `'drift'` | Slow random wandering with smooth transitions |
| Bounce | `'bounce'` | Bounce-style movement within bounds |
| Spiral | `'spiral'` | Outward/inward spiral pattern |
| Sway | `'sway'` | Gentle horizontal pendulum motion |
| Chaos | `'chaos'` | Multi-frequency noise-based movement |
| Figure Eight | `'figure-eight'` | Infinity/lemniscate pattern |
| Vertical Wave | `'vertical-wave'` | Vertical wave with horizontal oscillation |

```javascript
// Change movement mode
anim.updateSetting('movementMode', 'spiral');

// Adjust movement amplitude
anim.updateSetting('amplitudeX', 25);  // 25% of canvas width
anim.updateSetting('amplitudeY', 30);  // 30% of canvas height

// Combine with speed for different effects
anim.updateSetting('movementMode', 'chaos');
anim.updateSetting('gradientSpeed', 0.3);
anim.updateSetting('amplitudeX', 40);
anim.updateSetting('amplitudeY', 40);
```

---

### Size & Scale

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `scale` | number | 1 | Overall gradient scale |
| `gradientSizeMultiplier` | number | 1.0 | Size multiplier |
| `gradientSizeMode` | string | 'base' | 'base' or 'drawing' |

```javascript
anim.updateSetting('scale', 1.5);
anim.updateSetting('gradientSizeMultiplier', 2.0);
anim.updateSetting('gradientSizeMode', 'drawing');
```

---

### Canvas Size Constraints

Limit the canvas rendering size for performance optimization. Setting a value of 0 means no limit.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `maxWidth` | number | 0 | Maximum canvas width in pixels (0 = no limit) |
| `maxHeight` | number | 0 | Maximum canvas height in pixels (0 = no limit) |

```javascript
// Limit canvas to 1920x1080 for better performance on large screens
anim.updateSetting('maxWidth', 1920);
anim.updateSetting('maxHeight', 1080);

// Limit only height (useful for hero sections)
anim.updateSetting('maxHeight', 800);

// Remove limits
anim.updateSetting('maxWidth', 0);
anim.updateSetting('maxHeight', 0);
```

> **Performance Tip:** On high-DPI displays (Retina), limiting canvas size significantly reduces GPU/CPU load. A 4K display rendering at 1920x1080 uses ~75% fewer pixels.

---

### Colors (Hue Range Mode)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `colorMode` | string | 'hue-range' | 'hue-range' or 'palette' |
| `hueStart` | number | 200 | Starting hue (0-360) |
| `hueEnd` | number | 280 | Ending hue (0-360) |
| `hueSeparation` | number | 100 | Color separation % |
| `evenlySpacedColors` | boolean | true | Evenly space colors |
| `saturationMin` | number | 60 | Min saturation % |
| `saturationMax` | number | 100 | Max saturation % |
| `lightnessMin` | number | 20 | Min lightness % |
| `lightnessMax` | number | 50 | Max lightness % |

```javascript
// Red to Yellow gradient
anim.updateSetting('hueStart', 0);
anim.updateSetting('hueEnd', 60);

// High saturation
anim.updateSetting('saturationMin', 80);
anim.updateSetting('saturationMax', 100);

// Bright colors
anim.updateSetting('lightnessMin', 40);
anim.updateSetting('lightnessMax', 70);
```

---

### Colors (Palette Mode)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `paletteColors` | array | [...] | Array of hex colors |

```javascript
anim.updateSetting('colorMode', 'palette');
anim.updateSetting('paletteColors', ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181']);
```

---

### Visual Effects

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `opacity` | number | 1 | Overall opacity (0-1) |
| `blur` | number | 0 | Blur amount (px) |
| `brightness` | number | 100 | Brightness % |
| `contrast` | number | 100 | Contrast % |
| `saturation` | number | 100 | CSS saturation filter % |
| `hue` | number | 0 | Hue rotation (deg) |
| `gradientFade` | number | 0.5 | Gradient edge fade (0-1) |

```javascript
anim.updateSetting('blur', 15);
anim.updateSetting('brightness', 120);
anim.updateSetting('contrast', 110);
anim.updateSetting('opacity', 0.8);
```

---

### Blend Modes

| Setting | Type | Default | Options |
|---------|------|---------|---------|
| `blendMode` | string | 'normal' | normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion |
| `gradientBlendModeEnabled` | boolean | false | Enable inter-gradient blending |
| `gradientBlendMode` | string | 'normal' | Same options as blendMode |

```javascript
anim.updateSetting('blendMode', 'screen');
anim.updateSetting('gradientBlendModeEnabled', true);
anim.updateSetting('gradientBlendMode', 'difference');
```

---

### Background

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `backgroundColor` | string | '#000000' | Canvas background color |

```javascript
anim.updateSetting('backgroundColor', '#1a1a2e');
anim.updateSetting('backgroundColor', 'transparent');
```

---

### Radial Gradients

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `radialGradientsEnabled` | boolean | true | Enable radial gradients |

```javascript
anim.updateSetting('radialGradientsEnabled', false);
```

---

### Line Gradients

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `lineGradientsEnabled` | boolean | false | Enable line gradients |
| `lineGradientAngle` | number | 0 | Rotation angle (deg) |
| `lineGradientLength` | number | 200 | Line length (px) |
| `lineGradientWidth` | number | 100 | Line width (px) |

```javascript
anim.updateSetting('lineGradientsEnabled', true);
anim.updateSetting('lineGradientAngle', 45);
anim.updateSetting('lineGradientLength', 300);
anim.updateSetting('lineGradientWidth', 50);
```

---

### Fadeout

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `fadeoutMode` | string | 'none' | 'none', 'auto', or 'custom' |
| `fadeoutTime` | number | 10 | Fade time in seconds |

```javascript
anim.updateSetting('fadeoutMode', 'auto');
anim.updateSetting('fadeoutTime', 5);
```

---

### Animated Hue Rotation

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `hueRotationSpeed` | number | 0 | Rotations per second |

```javascript
anim.updateSetting('hueRotationSpeed', 0.1); // Slow rainbow effect
```

---

### Playback Control

Pause and resume the animation loop to save CPU/GPU resources.

| Method | Returns | Description |
|--------|---------|-------------|
| `pause()` | void | Stop animation loop completely (0% CPU) |
| `resume()` | void | Restart animation loop |
| `isPaused()` | boolean | Check if animation is paused |

```javascript
// Pause animation (0% CPU usage)
anim.pause();

// Resume animation
anim.resume();

// Check state
if (anim.isPaused()) {
    console.log('Animation is paused');
}

// Toggle pause/resume
anim.isPaused() ? anim.resume() : anim.pause();
```

> **Performance Tip:** Use `pause()` when the gradient is off-screen or hidden to eliminate all CPU usage from the animation.

---

## Example Presets

### Neon Glow
```javascript
const anim = document.querySelector('.wp-block-hero-gradient')._heroGradientAnimation;
anim.updateSetting('backgroundColor', '#0a0a0f');
anim.updateSetting('blendMode', 'screen');
anim.updateSetting('blur', 20);
anim.updateSetting('brightness', 150);
anim.updateSetting('hueStart', 280);
anim.updateSetting('hueEnd', 340);
anim.updateSetting('saturationMin', 90);
anim.updateSetting('saturationMax', 100);
```

### Sunset
```javascript
const anim = document.querySelector('.wp-block-hero-gradient')._heroGradientAnimation;
anim.updateSetting('colorMode', 'palette');
anim.updateSetting('paletteColors', ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd']);
anim.updateSetting('gradientSpeed', 0.3);
```

### Matrix
```javascript
const anim = document.querySelector('.wp-block-hero-gradient')._heroGradientAnimation;
anim.updateSetting('backgroundColor', '#000000');
anim.updateSetting('hueStart', 120);
anim.updateSetting('hueEnd', 140);
anim.updateSetting('saturationMin', 100);
anim.updateSetting('saturationMax', 100);
anim.updateSetting('lightnessMin', 30);
anim.updateSetting('lightnessMax', 60);
anim.updateSetting('blendMode', 'screen');
```

### Hypnotic Spiral
```javascript
const anim = document.querySelector('.wp-block-hero-gradient')._heroGradientAnimation;
anim.updateSetting('movementMode', 'spiral');
anim.updateSetting('amplitudeX', 35);
anim.updateSetting('amplitudeY', 35);
anim.updateSetting('gradientSpeed', 0.8);
anim.updateSetting('hueStart', 0);
anim.updateSetting('hueEnd', 360);
```

### Calm Drift
```javascript
const anim = document.querySelector('.wp-block-hero-gradient')._heroGradientAnimation;
anim.updateSetting('movementMode', 'drift');
anim.updateSetting('amplitudeX', 20);
anim.updateSetting('amplitudeY', 20);
anim.updateSetting('gradientSpeed', 0.2);
anim.updateSetting('blur', 25);
```

### Energetic Chaos
```javascript
const anim = document.querySelector('.wp-block-hero-gradient')._heroGradientAnimation;
anim.updateSetting('movementMode', 'chaos');
anim.updateSetting('amplitudeX', 40);
anim.updateSetting('amplitudeY', 40);
anim.updateSetting('gradientSpeed', 1.5);
anim.updateSetting('saturationMin', 90);
anim.updateSetting('saturationMax', 100);
```

---

## Multiple Animations

If you have multiple gradient blocks:

```javascript
// Get all animations
const blocks = document.querySelectorAll('.wp-block-hero-gradient');
const animations = Array.from(blocks).map(b => b._heroGradientAnimation);

// Change all at once
animations.forEach(anim => {
    anim.updateSetting('gradientSpeed', 2);
});

// Access specific one by index
animations[0].updateSetting('blur', 10);
animations[1].updateSetting('blur', 20);
```
