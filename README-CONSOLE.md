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
