/**
 * Frontend script for Hero Gradient block
 * Initializes gradient animations on the frontend
 */

// Import the animation classes
import { GradientAnimation } from './gradient-animation';
import { SVGPatternGenerator } from './svg-patterns';

/**
 * Initialize all Hero Gradient blocks on the page
 */
function initHeroGradientBlocks() {
    // Initialize dedicated Hero Gradient blocks
    const blocks = document.querySelectorAll('.wp-block-hero-gradient[data-gradient-settings]');

    blocks.forEach((block) => {
        const canvas = block.querySelector('.hero-gradient__canvas');
        const svgOverlay = block.querySelector('.hero-gradient__svg-overlay');

        if (!canvas) return;

        // Check if already initialized
        if (canvas.dataset.initialized === 'true') return;
        canvas.dataset.initialized = 'true';

        // Get settings from data attribute
        let settings = {};
        try {
            const settingsAttr = block.dataset.gradientSettings;
            if (settingsAttr) {
                settings = JSON.parse(settingsAttr);
            }
        } catch (e) {
            console.warn('Hero Gradient: Could not parse settings', e);
        }

        // Initialize gradient animation
        const animation = new GradientAnimation(canvas);

        // Apply settings
        applyGradientSettings(animation, settings);

        // Initialize SVG pattern
        initSvgPattern(svgOverlay, settings);

        // Store animation reference for cleanup
        block._heroGradientAnimation = animation;
    });

    // Initialize extended core blocks with gradient background
    initExtendedBlocks();
}

/**
 * Initialize core blocks with gradient background extension
 */
function initExtendedBlocks() {
    const extendedBlocks = document.querySelectorAll('[data-hero-gradient]');

    extendedBlocks.forEach((block) => {
        // Skip if this is a native Hero Gradient block (has data-gradient-settings)
        if (block.dataset.gradientSettings) return;

        // Check if already initialized
        if (block.dataset.heroGradientInitialized === 'true') return;
        block.dataset.heroGradientInitialized = 'true';

        // Get settings from data attribute
        let settings = {};
        try {
            settings = JSON.parse(block.dataset.heroGradient);
        } catch (e) {
            console.warn('Hero Gradient Extension: Could not parse settings', e);
            return;
        }

        if (!settings.heroGradientEnabled) return;

        // Create the gradient background elements
        const backgroundWrapper = document.createElement('div');
        backgroundWrapper.className = 'hero-gradient__background hero-gradient-extension__background';
        backgroundWrapper.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; overflow: hidden; pointer-events: none;';

        const canvas = document.createElement('canvas');
        canvas.className = 'hero-gradient__canvas';
        canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';

        const svgOverlay = document.createElement('div');
        svgOverlay.className = 'hero-gradient__svg-overlay';
        svgOverlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none;';

        backgroundWrapper.appendChild(canvas);
        backgroundWrapper.appendChild(svgOverlay);

        // Ensure the block has relative positioning
        const computedStyle = window.getComputedStyle(block);
        if (computedStyle.position === 'static') {
            block.style.position = 'relative';
        }

        // Insert the background as the first child
        block.insertBefore(backgroundWrapper, block.firstChild);

        // Initialize gradient animation
        const animation = new GradientAnimation(canvas);

        // Convert hero-prefixed settings to standard names
        const normalizedSettings = {
            radialGradientsEnabled: settings.heroRadialGradientsEnabled,
            gradientOpacity: settings.heroGradientOpacity,
            gradientBlur: settings.heroGradientBlur,
            brightness: settings.heroBrightness,
            contrast: settings.heroContrast,
            saturation: settings.heroSaturation,
            hueRotation: settings.heroHueRotation,
            gradientScale: settings.heroGradientScale,
            gradientSize: settings.heroGradientSize,
            gradientSizeMode: settings.heroGradientSizeMode,
            positionX: settings.heroPositionX,
            positionY: settings.heroPositionY,
            blendMode: settings.heroBlendMode,
            gradientBlendModeEnabled: settings.heroGradientBlendModeEnabled,
            gradientBlendMode: settings.heroGradientBlendMode,
            fadeoutMode: settings.heroFadeoutMode,
            fadeoutTime: settings.heroFadeoutTime,
            gradientCount: settings.heroGradientCount,
            animationSpeed: settings.heroAnimationSpeed,
            gradientFade: settings.heroGradientFade,
            canvasBgColor: settings.heroCanvasBgColor,
            colorMode: settings.heroColorMode,
            hueStart: settings.heroHueStart,
            hueEnd: settings.heroHueEnd,
            evenlySpacedColors: settings.heroEvenlySpacedColors,
            hueSeparation: settings.heroHueSeparation,
            saturationMin: settings.heroSaturationMin,
            saturationMax: settings.heroSaturationMax,
            lightnessMin: settings.heroLightnessMin,
            lightnessMax: settings.heroLightnessMax,
            paletteColor1: settings.heroPaletteColor1,
            paletteColor2: settings.heroPaletteColor2,
            paletteColor3: settings.heroPaletteColor3,
            paletteColor4: settings.heroPaletteColor4,
            paletteColor5: settings.heroPaletteColor5,
            lineGradientsEnabled: settings.heroLineGradientsEnabled,
            lineGradientAngle: settings.heroLineGradientAngle,
            lineGradientLength: settings.heroLineGradientLength,
            lineGradientWidth: settings.heroLineGradientWidth,
            svgEnabled: settings.heroSvgEnabled,
            svgOpacity: settings.heroSvgOpacity,
            svgSize: settings.heroSvgSize,
            svgStrokeWidth: settings.heroSvgStrokeWidth,
            svgPattern: settings.heroSvgPattern,
            svgColor: settings.heroSvgColor,
            svgBlendMode: settings.heroSvgBlendMode,
        };

        applyGradientSettings(animation, normalizedSettings);

        // Initialize SVG pattern
        initSvgPattern(svgOverlay, normalizedSettings);

        // Store animation reference for cleanup
        block._heroGradientAnimation = animation;
    });
}

/**
 * Apply gradient settings to animation instance
 */
function applyGradientSettings(animation, settings) {
    if (settings.radialGradientsEnabled !== undefined) animation.updateSetting('radialGradientsEnabled', settings.radialGradientsEnabled);
    if (settings.gradientOpacity !== undefined) animation.updateSetting('opacity', settings.gradientOpacity / 100);
    if (settings.gradientBlur !== undefined) animation.updateSetting('blur', settings.gradientBlur);
    if (settings.brightness !== undefined) animation.updateSetting('brightness', settings.brightness);
    if (settings.contrast !== undefined) animation.updateSetting('contrast', settings.contrast);
    if (settings.saturation !== undefined) animation.updateSetting('saturation', settings.saturation);
    if (settings.hueRotation !== undefined) animation.updateSetting('hue', settings.hueRotation);
    if (settings.gradientScale !== undefined) animation.updateSetting('scale', settings.gradientScale / 100);
    if (settings.gradientSize !== undefined) animation.updateSetting('gradientSizeMultiplier', settings.gradientSize / 100);
    if (settings.gradientSizeMode !== undefined) animation.updateSetting('gradientSizeMode', settings.gradientSizeMode);
    if (settings.positionX !== undefined) animation.updateSetting('positionX', settings.positionX / 100);
    if (settings.positionY !== undefined) animation.updateSetting('positionY', settings.positionY / 100);
    if (settings.blendMode !== undefined) animation.updateSetting('blendMode', settings.blendMode);
    if (settings.gradientBlendModeEnabled !== undefined) animation.updateSetting('gradientBlendModeEnabled', settings.gradientBlendModeEnabled);
    if (settings.gradientBlendMode !== undefined) animation.updateSetting('gradientBlendMode', settings.gradientBlendMode);
    if (settings.fadeoutMode !== undefined) animation.updateSetting('fadeoutMode', settings.fadeoutMode);
    if (settings.fadeoutTime !== undefined) animation.updateSetting('fadeoutTime', settings.fadeoutTime);
    if (settings.gradientCount !== undefined) animation.updateSetting('gradientCount', settings.gradientCount);
    if (settings.animationSpeed !== undefined) animation.updateSetting('gradientSpeed', settings.animationSpeed / 100);
    if (settings.gradientFade !== undefined) animation.updateSetting('hueRotationSpeed', settings.gradientFade);
    if (settings.canvasBgColor !== undefined) animation.updateSetting('backgroundColor', settings.canvasBgColor);
    if (settings.colorMode !== undefined) animation.updateSetting('colorMode', settings.colorMode);
    if (settings.hueStart !== undefined) animation.updateSetting('hueStart', settings.hueStart);
    if (settings.hueEnd !== undefined) animation.updateSetting('hueEnd', settings.hueEnd);
    if (settings.evenlySpacedColors !== undefined) animation.updateSetting('evenlySpacedColors', settings.evenlySpacedColors);
    if (settings.hueSeparation !== undefined) animation.updateSetting('hueSeparation', settings.hueSeparation);
    if (settings.saturationMin !== undefined) animation.updateSetting('saturationMin', settings.saturationMin);
    if (settings.saturationMax !== undefined) animation.updateSetting('saturationMax', settings.saturationMax);
    if (settings.lightnessMin !== undefined) animation.updateSetting('lightnessMin', settings.lightnessMin);
    if (settings.lightnessMax !== undefined) animation.updateSetting('lightnessMax', settings.lightnessMax);
    if (settings.lineGradientsEnabled !== undefined) animation.updateSetting('lineGradientsEnabled', settings.lineGradientsEnabled);
    if (settings.lineGradientAngle !== undefined) animation.updateSetting('lineGradientAngle', settings.lineGradientAngle);
    if (settings.lineGradientLength !== undefined) animation.updateSetting('lineGradientLength', settings.lineGradientLength);
    if (settings.lineGradientWidth !== undefined) animation.updateSetting('lineGradientWidth', settings.lineGradientWidth);

    // Handle palette colors
    if (settings.paletteColor1 !== undefined) {
        const paletteColors = [
            settings.paletteColor1,
            settings.paletteColor2 || '#5ba3f5',
            settings.paletteColor3 || '#6bb6ff',
            settings.paletteColor4 || '#7bc9ff',
            settings.paletteColor5 || '#8bdaff',
        ];
        animation.updateSetting('paletteColors', paletteColors);
    }
}

/**
 * Initialize SVG pattern overlay
 */
function initSvgPattern(svgOverlay, settings) {
    if (!svgOverlay) return;

    if (settings.svgEnabled === true) {
        const svgGenerator = new SVGPatternGenerator(svgOverlay);
        svgGenerator.setEnabled(true);
        svgGenerator.updatePattern(
            settings.svgPattern || 'grid',
            settings.svgSize || 100,
            settings.svgOpacity || 15,
            settings.svgColor || '#ffffff',
            settings.svgBlendMode || 'normal',
            settings.svgStrokeWidth || 1
        );
    } else {
        svgOverlay.style.display = 'none';
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroGradientBlocks);
} else {
    initHeroGradientBlocks();
}

// Re-initialize on AJAX navigation (for themes with AJAX page transitions)
if (typeof wp !== 'undefined' && wp.hooks) {
    wp.hooks.addAction('blocks.ready', 'hero-gradient', initHeroGradientBlocks);
}
