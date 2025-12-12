/**
 * Gradient Background Extension for Core Blocks
 * Adds opt-in animated gradient background to Group, Columns, Row, Stack blocks
 * Includes ALL gradient settings from the Hero Gradient block
 */

import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useEffect, useRef, useState } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    RangeControl,
    SelectControl,
    RadioControl,
    BaseControl,
    ColorIndicator,
    Flex,
    FlexItem,
    Button,
    Popover,
} from '@wordpress/components';
import { GradientAnimation } from '../hero-gradient/gradient-animation';
import { SVGPatternGenerator } from '../hero-gradient/svg-patterns';

// Blocks that support gradient background extension
const SUPPORTED_BLOCKS = [
    'core/group',
    'core/columns',
    'core/column',
    'core/row',
    'core/stack',
];

// Blend mode options
const BLEND_MODE_OPTIONS = [
    { label: 'Normal', value: 'normal' },
    { label: 'Multiply', value: 'multiply' },
    { label: 'Screen', value: 'screen' },
    { label: 'Overlay', value: 'overlay' },
    { label: 'Soft Light', value: 'soft-light' },
    { label: 'Hard Light', value: 'hard-light' },
    { label: 'Color Dodge', value: 'color-dodge' },
    { label: 'Color Burn', value: 'color-burn' },
    { label: 'Darken', value: 'darken' },
    { label: 'Lighten', value: 'lighten' },
    { label: 'Difference', value: 'difference' },
    { label: 'Exclusion', value: 'exclusion' },
];

// SVG pattern options
const SVG_PATTERN_OPTIONS = [
    { label: 'Grid', value: 'grid' },
    { label: 'Dots', value: 'dots' },
    { label: 'Horizontal Lines', value: 'lines-horizontal' },
    { label: 'Vertical Lines', value: 'lines-vertical' },
    { label: 'Diagonal Lines', value: 'diagonal' },
    { label: 'Crosshatch', value: 'crosshatch' },
    { label: 'Hexagon', value: 'hexagon' },
    { label: 'Circles', value: 'circles' },
    { label: 'Waves', value: 'waves' },
    { label: 'Mesh', value: 'mesh' },
    { label: 'Noise', value: 'noise' },
    { label: 'Circuit', value: 'circuit' },
    { label: 'Scanlines', value: 'scanlines' },
    { label: 'Dots Grid', value: 'dots-grid' },
    { label: 'Radial', value: 'radial' },
];

// All gradient settings with defaults (matching Hero Gradient block)
const GRADIENT_ATTRIBUTE_DEFAULTS = {
    // Toggle
    heroGradientEnabled: false,
    // Canvas gradient settings
    heroRadialGradientsEnabled: true,
    heroGradientOpacity: 100,
    heroGradientBlur: 0,
    heroBrightness: 100,
    heroContrast: 100,
    heroSaturation: 100,
    heroHueRotation: 0,
    heroGradientScale: 100,
    heroGradientSize: 100,
    heroGradientSizeMode: 'base',
    heroPositionX: 50,
    heroPositionY: 50,
    heroBlendMode: 'normal',
    heroGradientBlendModeEnabled: false,
    heroGradientBlendMode: 'normal',
    heroFadeoutMode: 'none',
    heroFadeoutTime: 10,
    heroGradientCount: 5,
    heroAnimationSpeed: 50,
    heroGradientFade: 0,
    heroCanvasBgColor: '#000000',
    // Color settings
    heroColorMode: 'hue-range',
    heroHueStart: 200,
    heroHueEnd: 280,
    heroEvenlySpacedColors: true,
    heroHueSeparation: 100,
    heroSaturationMin: 60,
    heroSaturationMax: 100,
    heroLightnessMin: 20,
    heroLightnessMax: 50,
    heroPaletteColor1: '#4a90e2',
    heroPaletteColor2: '#5ba3f5',
    heroPaletteColor3: '#6bb6ff',
    heroPaletteColor4: '#7bc9ff',
    heroPaletteColor5: '#8bdaff',
    // Line gradients
    heroLineGradientsEnabled: false,
    heroLineGradientAngle: 0,
    heroLineGradientLength: 200,
    heroLineGradientWidth: 100,
    // SVG overlay
    heroSvgEnabled: false,
    heroSvgOpacity: 15,
    heroSvgSize: 100,
    heroSvgStrokeWidth: 1,
    heroSvgPattern: 'grid',
    heroSvgColor: '#ffffff',
    heroSvgBlendMode: 'normal',
};

// Color picker component
function ColorPickerControl({ label, color, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef();

    return (
        <BaseControl label={label}>
            <Flex>
                <FlexItem>
                    <Button
                        ref={buttonRef}
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            padding: 0,
                            minWidth: 36,
                            height: 36,
                            border: '1px solid #ccc',
                            borderRadius: 4,
                        }}
                    >
                        <ColorIndicator colorValue={color} />
                    </Button>
                    {isOpen && (
                        <Popover
                            anchor={buttonRef.current}
                            onClose={() => setIsOpen(false)}
                        >
                            <div style={{ padding: 16 }}>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => onChange(e.target.value)}
                                    style={{ width: '100%', height: 40 }}
                                />
                            </div>
                        </Popover>
                    )}
                </FlexItem>
                <FlexItem>
                    <code style={{ fontSize: 12 }}>{color}</code>
                </FlexItem>
            </Flex>
        </BaseControl>
    );
}

/**
 * Add gradient attributes to supported blocks
 */
function addGradientAttributes(settings, name) {
    if (!SUPPORTED_BLOCKS.includes(name)) {
        return settings;
    }

    const newAttributes = {};
    Object.keys(GRADIENT_ATTRIBUTE_DEFAULTS).forEach((key) => {
        const defaultValue = GRADIENT_ATTRIBUTE_DEFAULTS[key];
        newAttributes[key] = {
            type: typeof defaultValue === 'boolean' ? 'boolean' :
                typeof defaultValue === 'number' ? 'number' : 'string',
            default: defaultValue,
        };
    });

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            ...newAttributes,
        },
    };
}

addFilter(
    'blocks.registerBlockType',
    'hero-gradient/add-gradient-attributes',
    addGradientAttributes
);

/**
 * Add gradient controls to block inspector
 */
const withGradientControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { name, attributes, setAttributes } = props;

        if (!SUPPORTED_BLOCKS.includes(name)) {
            return <BlockEdit {...props} />;
        }

        const {
            heroGradientEnabled,
            heroRadialGradientsEnabled,
            heroGradientOpacity,
            heroGradientBlur,
            heroBrightness,
            heroContrast,
            heroSaturation,
            heroHueRotation,
            heroGradientScale,
            heroGradientSize,
            heroGradientSizeMode,
            heroPositionX,
            heroPositionY,
            heroBlendMode,
            heroGradientBlendModeEnabled,
            heroGradientBlendMode,
            heroFadeoutMode,
            heroFadeoutTime,
            heroGradientCount,
            heroAnimationSpeed,
            heroGradientFade,
            heroCanvasBgColor,
            heroColorMode,
            heroHueStart,
            heroHueEnd,
            heroEvenlySpacedColors,
            heroHueSeparation,
            heroSaturationMin,
            heroSaturationMax,
            heroLightnessMin,
            heroLightnessMax,
            heroPaletteColor1,
            heroPaletteColor2,
            heroPaletteColor3,
            heroPaletteColor4,
            heroPaletteColor5,
            heroLineGradientsEnabled,
            heroLineGradientAngle,
            heroLineGradientLength,
            heroLineGradientWidth,
            heroSvgEnabled,
            heroSvgOpacity,
            heroSvgSize,
            heroSvgStrokeWidth,
            heroSvgPattern,
            heroSvgColor,
            heroSvgBlendMode,
        } = attributes;

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    {/* Main Toggle */}
                    <PanelBody
                        title={__('Gradient Background', 'hero-gradient')}
                        initialOpen={false}
                        icon="art"
                    >
                        <ToggleControl
                            label={__('Enable Animated Gradient', 'hero-gradient')}
                            checked={heroGradientEnabled}
                            onChange={(value) => setAttributes({ heroGradientEnabled: value })}
                            help={heroGradientEnabled ? __('Animated gradient background is active', 'hero-gradient') : __('Add an animated gradient background to this block', 'hero-gradient')}
                        />
                    </PanelBody>

                    {heroGradientEnabled && (
                        <>
                            {/* Canvas Gradient Settings */}
                            <PanelBody title={__('Canvas Gradient Settings', 'hero-gradient')} initialOpen={false}>
                                <ToggleControl
                                    label={__('Enable Radial Gradients', 'hero-gradient')}
                                    checked={heroRadialGradientsEnabled}
                                    onChange={(value) => setAttributes({ heroRadialGradientsEnabled: value })}
                                />
                                <RangeControl
                                    label={__('Gradient Opacity', 'hero-gradient')}
                                    value={heroGradientOpacity}
                                    onChange={(value) => setAttributes({ heroGradientOpacity: value })}
                                    min={0}
                                    max={100}
                                />
                                <RangeControl
                                    label={__('Blur', 'hero-gradient')}
                                    value={heroGradientBlur}
                                    onChange={(value) => setAttributes({ heroGradientBlur: value })}
                                    min={0}
                                    max={50}
                                />
                                <RangeControl
                                    label={__('Brightness', 'hero-gradient')}
                                    value={heroBrightness}
                                    onChange={(value) => setAttributes({ heroBrightness: value })}
                                    min={0}
                                    max={200}
                                />
                                <RangeControl
                                    label={__('Contrast', 'hero-gradient')}
                                    value={heroContrast}
                                    onChange={(value) => setAttributes({ heroContrast: value })}
                                    min={0}
                                    max={200}
                                />
                                <RangeControl
                                    label={__('Saturation', 'hero-gradient')}
                                    value={heroSaturation}
                                    onChange={(value) => setAttributes({ heroSaturation: value })}
                                    min={0}
                                    max={200}
                                />
                                <RangeControl
                                    label={__('Hue Rotation', 'hero-gradient')}
                                    value={heroHueRotation}
                                    onChange={(value) => setAttributes({ heroHueRotation: value })}
                                    min={0}
                                    max={360}
                                />
                                <RangeControl
                                    label={__('Gradient Scale', 'hero-gradient')}
                                    value={heroGradientScale}
                                    onChange={(value) => setAttributes({ heroGradientScale: value })}
                                    min={50}
                                    max={200}
                                />
                                <RangeControl
                                    label={__('Gradient Size', 'hero-gradient')}
                                    value={heroGradientSize}
                                    onChange={(value) => setAttributes({ heroGradientSize: value })}
                                    min={50}
                                    max={200}
                                />
                                <RadioControl
                                    label={__('Gradient Size Mode', 'hero-gradient')}
                                    selected={heroGradientSizeMode}
                                    options={[
                                        { label: __('Apply to Base Radius', 'hero-gradient'), value: 'base' },
                                        { label: __('Apply During Drawing', 'hero-gradient'), value: 'drawing' },
                                    ]}
                                    onChange={(value) => setAttributes({ heroGradientSizeMode: value })}
                                />
                                <RangeControl
                                    label={__('Position X', 'hero-gradient')}
                                    value={heroPositionX}
                                    onChange={(value) => setAttributes({ heroPositionX: value })}
                                    min={0}
                                    max={100}
                                />
                                <RangeControl
                                    label={__('Position Y', 'hero-gradient')}
                                    value={heroPositionY}
                                    onChange={(value) => setAttributes({ heroPositionY: value })}
                                    min={0}
                                    max={100}
                                />
                                <SelectControl
                                    label={__('Mix Blend Mode', 'hero-gradient')}
                                    value={heroBlendMode}
                                    options={BLEND_MODE_OPTIONS}
                                    onChange={(value) => setAttributes({ heroBlendMode: value })}
                                />
                                <ToggleControl
                                    label={__('Gradient-to-Gradient Blend', 'hero-gradient')}
                                    checked={heroGradientBlendModeEnabled}
                                    onChange={(value) => setAttributes({ heroGradientBlendModeEnabled: value })}
                                />
                                {heroGradientBlendModeEnabled && (
                                    <SelectControl
                                        label={__('Gradient Blend Mode', 'hero-gradient')}
                                        value={heroGradientBlendMode}
                                        options={BLEND_MODE_OPTIONS}
                                        onChange={(value) => setAttributes({ heroGradientBlendMode: value })}
                                    />
                                )}
                                <SelectControl
                                    label={__('Fadeout Mode', 'hero-gradient')}
                                    value={heroFadeoutMode}
                                    options={[
                                        { label: __('None', 'hero-gradient'), value: 'none' },
                                        { label: __('Auto', 'hero-gradient'), value: 'auto' },
                                        { label: __('Custom', 'hero-gradient'), value: 'custom' },
                                    ]}
                                    onChange={(value) => setAttributes({ heroFadeoutMode: value })}
                                />
                                {heroFadeoutMode === 'custom' && (
                                    <RangeControl
                                        label={__('Fadeout Time (seconds)', 'hero-gradient')}
                                        value={heroFadeoutTime}
                                        onChange={(value) => setAttributes({ heroFadeoutTime: value })}
                                        min={1}
                                        max={60}
                                    />
                                )}
                                <RangeControl
                                    label={__('Gradient Count', 'hero-gradient')}
                                    value={heroGradientCount}
                                    onChange={(value) => setAttributes({ heroGradientCount: value })}
                                    min={2}
                                    max={10}
                                />
                                <RangeControl
                                    label={__('Animation Speed', 'hero-gradient')}
                                    value={heroAnimationSpeed}
                                    onChange={(value) => setAttributes({ heroAnimationSpeed: value })}
                                    min={0}
                                    max={1000}
                                />
                                <RangeControl
                                    label={__('Gradient Color Fade', 'hero-gradient')}
                                    value={heroGradientFade}
                                    onChange={(value) => setAttributes({ heroGradientFade: value })}
                                    min={0}
                                    max={10}
                                    step={0.1}
                                />
                                <ColorPickerControl
                                    label={__('Canvas Background', 'hero-gradient')}
                                    color={heroCanvasBgColor}
                                    onChange={(value) => setAttributes({ heroCanvasBgColor: value })}
                                />
                            </PanelBody>

                            {/* Gradient Colors */}
                            <PanelBody title={__('Gradient Colors', 'hero-gradient')} initialOpen={false}>
                                <SelectControl
                                    label={__('Color Mode', 'hero-gradient')}
                                    value={heroColorMode}
                                    options={[
                                        { label: __('Hue Range', 'hero-gradient'), value: 'hue-range' },
                                        { label: __('Custom Palette', 'hero-gradient'), value: 'palette' },
                                    ]}
                                    onChange={(value) => setAttributes({ heroColorMode: value })}
                                />
                                {heroColorMode === 'hue-range' && (
                                    <>
                                        <RangeControl
                                            label={__('Hue Start', 'hero-gradient')}
                                            value={heroHueStart}
                                            onChange={(value) => setAttributes({ heroHueStart: value })}
                                            min={0}
                                            max={360}
                                        />
                                        <RangeControl
                                            label={__('Hue End', 'hero-gradient')}
                                            value={heroHueEnd}
                                            onChange={(value) => setAttributes({ heroHueEnd: value })}
                                            min={0}
                                            max={360}
                                        />
                                        <ToggleControl
                                            label={__('Evenly Spaced Colors', 'hero-gradient')}
                                            checked={heroEvenlySpacedColors}
                                            onChange={(value) => setAttributes({ heroEvenlySpacedColors: value })}
                                        />
                                        <RangeControl
                                            label={__('Hue Separation', 'hero-gradient')}
                                            value={heroHueSeparation}
                                            onChange={(value) => setAttributes({ heroHueSeparation: value })}
                                            min={0}
                                            max={100}
                                        />
                                        <RangeControl
                                            label={__('Saturation Min', 'hero-gradient')}
                                            value={heroSaturationMin}
                                            onChange={(value) => setAttributes({ heroSaturationMin: value })}
                                            min={0}
                                            max={100}
                                        />
                                        <RangeControl
                                            label={__('Saturation Max', 'hero-gradient')}
                                            value={heroSaturationMax}
                                            onChange={(value) => setAttributes({ heroSaturationMax: value })}
                                            min={0}
                                            max={100}
                                        />
                                        <RangeControl
                                            label={__('Lightness Min', 'hero-gradient')}
                                            value={heroLightnessMin}
                                            onChange={(value) => setAttributes({ heroLightnessMin: value })}
                                            min={0}
                                            max={100}
                                        />
                                        <RangeControl
                                            label={__('Lightness Max', 'hero-gradient')}
                                            value={heroLightnessMax}
                                            onChange={(value) => setAttributes({ heroLightnessMax: value })}
                                            min={0}
                                            max={100}
                                        />
                                    </>
                                )}
                                {heroColorMode === 'palette' && (
                                    <>
                                        <ColorPickerControl
                                            label={__('Color 1', 'hero-gradient')}
                                            color={heroPaletteColor1}
                                            onChange={(value) => setAttributes({ heroPaletteColor1: value })}
                                        />
                                        <ColorPickerControl
                                            label={__('Color 2', 'hero-gradient')}
                                            color={heroPaletteColor2}
                                            onChange={(value) => setAttributes({ heroPaletteColor2: value })}
                                        />
                                        <ColorPickerControl
                                            label={__('Color 3', 'hero-gradient')}
                                            color={heroPaletteColor3}
                                            onChange={(value) => setAttributes({ heroPaletteColor3: value })}
                                        />
                                        <ColorPickerControl
                                            label={__('Color 4', 'hero-gradient')}
                                            color={heroPaletteColor4}
                                            onChange={(value) => setAttributes({ heroPaletteColor4: value })}
                                        />
                                        <ColorPickerControl
                                            label={__('Color 5', 'hero-gradient')}
                                            color={heroPaletteColor5}
                                            onChange={(value) => setAttributes({ heroPaletteColor5: value })}
                                        />
                                    </>
                                )}
                            </PanelBody>

                            {/* Line Gradients */}
                            <PanelBody title={__('Line Gradients', 'hero-gradient')} initialOpen={false}>
                                <ToggleControl
                                    label={__('Enable Line Gradients', 'hero-gradient')}
                                    checked={heroLineGradientsEnabled}
                                    onChange={(value) => setAttributes({ heroLineGradientsEnabled: value })}
                                />
                                {heroLineGradientsEnabled && (
                                    <>
                                        <RangeControl
                                            label={__('Angle', 'hero-gradient')}
                                            value={heroLineGradientAngle}
                                            onChange={(value) => setAttributes({ heroLineGradientAngle: value })}
                                            min={0}
                                            max={360}
                                        />
                                        <RangeControl
                                            label={__('Length', 'hero-gradient')}
                                            value={heroLineGradientLength}
                                            onChange={(value) => setAttributes({ heroLineGradientLength: value })}
                                            min={50}
                                            max={1000}
                                        />
                                        <RangeControl
                                            label={__('Width', 'hero-gradient')}
                                            value={heroLineGradientWidth}
                                            onChange={(value) => setAttributes({ heroLineGradientWidth: value })}
                                            min={20}
                                            max={500}
                                        />
                                    </>
                                )}
                            </PanelBody>

                            {/* SVG Pattern Overlay */}
                            <PanelBody title={__('SVG Pattern Overlay', 'hero-gradient')} initialOpen={false}>
                                <ToggleControl
                                    label={__('Enable SVG Overlay', 'hero-gradient')}
                                    checked={heroSvgEnabled}
                                    onChange={(value) => setAttributes({ heroSvgEnabled: value })}
                                />
                                {heroSvgEnabled && (
                                    <>
                                        <RangeControl
                                            label={__('Opacity', 'hero-gradient')}
                                            value={heroSvgOpacity}
                                            onChange={(value) => setAttributes({ heroSvgOpacity: value })}
                                            min={0}
                                            max={100}
                                        />
                                        <RangeControl
                                            label={__('Pattern Size', 'hero-gradient')}
                                            value={heroSvgSize}
                                            onChange={(value) => setAttributes({ heroSvgSize: value })}
                                            min={20}
                                            max={300}
                                        />
                                        <RangeControl
                                            label={__('Stroke Width', 'hero-gradient')}
                                            value={heroSvgStrokeWidth}
                                            onChange={(value) => setAttributes({ heroSvgStrokeWidth: value })}
                                            min={0.1}
                                            max={5}
                                            step={0.1}
                                        />
                                        <SelectControl
                                            label={__('Pattern Type', 'hero-gradient')}
                                            value={heroSvgPattern}
                                            options={SVG_PATTERN_OPTIONS}
                                            onChange={(value) => setAttributes({ heroSvgPattern: value })}
                                        />
                                        <ColorPickerControl
                                            label={__('Pattern Color', 'hero-gradient')}
                                            color={heroSvgColor}
                                            onChange={(value) => setAttributes({ heroSvgColor: value })}
                                        />
                                        <SelectControl
                                            label={__('SVG Blend Mode', 'hero-gradient')}
                                            value={heroSvgBlendMode}
                                            options={BLEND_MODE_OPTIONS}
                                            onChange={(value) => setAttributes({ heroSvgBlendMode: value })}
                                        />
                                    </>
                                )}
                            </PanelBody>
                        </>
                    )}
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withGradientControls');

addFilter(
    'editor.BlockEdit',
    'hero-gradient/with-gradient-controls',
    withGradientControls
);

/**
 * Add gradient wrapper to block in editor
 */
const withGradientWrapper = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        const { name, attributes } = props;

        if (!SUPPORTED_BLOCKS.includes(name) || !attributes.heroGradientEnabled) {
            return <BlockListBlock {...props} />;
        }

        const canvasRef = useRef(null);
        const svgRef = useRef(null);
        const animationRef = useRef(null);
        const svgGeneratorRef = useRef(null);

        const updateAnimationSettings = () => {
            if (animationRef.current) {
                const anim = animationRef.current;
                anim.updateSetting('opacity', attributes.heroGradientOpacity / 100);
                anim.updateSetting('blur', attributes.heroGradientBlur);
                anim.updateSetting('brightness', attributes.heroBrightness);
                anim.updateSetting('contrast', attributes.heroContrast);
                anim.updateSetting('saturation', attributes.heroSaturation);
                anim.updateSetting('hue', attributes.heroHueRotation);
                anim.updateSetting('scale', attributes.heroGradientScale / 100);
                anim.updateSetting('gradientSizeMultiplier', attributes.heroGradientSize / 100);
                anim.updateSetting('gradientSizeMode', attributes.heroGradientSizeMode);
                anim.updateSetting('positionX', attributes.heroPositionX / 100);
                anim.updateSetting('positionY', attributes.heroPositionY / 100);
                anim.updateSetting('blendMode', attributes.heroBlendMode);
                anim.updateSetting('gradientBlendModeEnabled', attributes.heroGradientBlendModeEnabled);
                anim.updateSetting('gradientBlendMode', attributes.heroGradientBlendMode);
                anim.updateSetting('fadeoutMode', attributes.heroFadeoutMode);
                anim.updateSetting('fadeoutTime', attributes.heroFadeoutTime);
                anim.updateSetting('gradientCount', attributes.heroGradientCount);
                anim.updateSetting('gradientSpeed', attributes.heroAnimationSpeed / 100);
                anim.updateSetting('hueRotationSpeed', attributes.heroGradientFade);
                anim.updateSetting('backgroundColor', attributes.heroCanvasBgColor);
                anim.updateSetting('radialGradientsEnabled', attributes.heroRadialGradientsEnabled);
                anim.updateSetting('colorMode', attributes.heroColorMode);
                anim.updateSetting('hueStart', attributes.heroHueStart);
                anim.updateSetting('hueEnd', attributes.heroHueEnd);
                anim.updateSetting('evenlySpacedColors', attributes.heroEvenlySpacedColors);
                anim.updateSetting('hueSeparation', attributes.heroHueSeparation);
                anim.updateSetting('saturationMin', attributes.heroSaturationMin);
                anim.updateSetting('saturationMax', attributes.heroSaturationMax);
                anim.updateSetting('lightnessMin', attributes.heroLightnessMin);
                anim.updateSetting('lightnessMax', attributes.heroLightnessMax);
                anim.updateSetting('paletteColors', [
                    attributes.heroPaletteColor1,
                    attributes.heroPaletteColor2,
                    attributes.heroPaletteColor3,
                    attributes.heroPaletteColor4,
                    attributes.heroPaletteColor5,
                ]);
                anim.updateSetting('lineGradientsEnabled', attributes.heroLineGradientsEnabled);
                anim.updateSetting('lineGradientAngle', attributes.heroLineGradientAngle);
                anim.updateSetting('lineGradientLength', attributes.heroLineGradientLength);
                anim.updateSetting('lineGradientWidth', attributes.heroLineGradientWidth);
            }
        };

        useEffect(() => {
            if (canvasRef.current && !animationRef.current) {
                animationRef.current = new GradientAnimation(canvasRef.current);
                updateAnimationSettings();
            }

            return () => {
                if (animationRef.current) {
                    animationRef.current.destroy();
                    animationRef.current = null;
                }
            };
        }, [attributes.heroGradientEnabled]);

        useEffect(() => {
            if (svgRef.current && attributes.heroSvgEnabled) {
                if (!svgGeneratorRef.current) {
                    svgGeneratorRef.current = new SVGPatternGenerator(svgRef.current);
                }
                svgGeneratorRef.current.setEnabled(true);
                svgGeneratorRef.current.updatePattern(
                    attributes.heroSvgPattern,
                    attributes.heroSvgSize,
                    attributes.heroSvgOpacity,
                    attributes.heroSvgColor,
                    attributes.heroSvgBlendMode,
                    attributes.heroSvgStrokeWidth
                );
            } else if (svgGeneratorRef.current) {
                svgGeneratorRef.current.setEnabled(false);
            }
        }, [
            attributes.heroSvgEnabled,
            attributes.heroSvgPattern,
            attributes.heroSvgSize,
            attributes.heroSvgOpacity,
            attributes.heroSvgColor,
            attributes.heroSvgBlendMode,
            attributes.heroSvgStrokeWidth,
        ]);

        useEffect(() => {
            updateAnimationSettings();
        }, [
            attributes.heroGradientOpacity, attributes.heroGradientBlur, attributes.heroBrightness,
            attributes.heroContrast, attributes.heroSaturation, attributes.heroHueRotation,
            attributes.heroGradientScale, attributes.heroGradientSize, attributes.heroGradientSizeMode,
            attributes.heroPositionX, attributes.heroPositionY, attributes.heroBlendMode,
            attributes.heroGradientBlendModeEnabled, attributes.heroGradientBlendMode,
            attributes.heroFadeoutMode, attributes.heroFadeoutTime, attributes.heroGradientCount,
            attributes.heroAnimationSpeed, attributes.heroGradientFade, attributes.heroCanvasBgColor,
            attributes.heroRadialGradientsEnabled, attributes.heroColorMode, attributes.heroHueStart,
            attributes.heroHueEnd, attributes.heroEvenlySpacedColors, attributes.heroHueSeparation,
            attributes.heroSaturationMin, attributes.heroSaturationMax, attributes.heroLightnessMin,
            attributes.heroLightnessMax, attributes.heroPaletteColor1, attributes.heroPaletteColor2,
            attributes.heroPaletteColor3, attributes.heroPaletteColor4, attributes.heroPaletteColor5,
            attributes.heroLineGradientsEnabled, attributes.heroLineGradientAngle,
            attributes.heroLineGradientLength, attributes.heroLineGradientWidth,
        ]);

        return (
            <div className="hero-gradient-extension-wrapper" style={{ position: 'relative' }}>
                <div className="hero-gradient__background" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                }}>
                    <canvas
                        ref={canvasRef}
                        className="hero-gradient__canvas"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                    <div
                        ref={svgRef}
                        className="hero-gradient__svg-overlay"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <BlockListBlock {...props} />
                </div>
            </div>
        );
    };
}, 'withGradientWrapper');

addFilter(
    'editor.BlockListBlock',
    'hero-gradient/with-gradient-wrapper',
    withGradientWrapper
);

/**
 * Add data attribute for frontend initialization
 */
function addGradientDataAttribute(extraProps, blockType, attributes) {
    if (!SUPPORTED_BLOCKS.includes(blockType.name) || !attributes.heroGradientEnabled) {
        return extraProps;
    }

    const gradientSettings = {};
    Object.keys(GRADIENT_ATTRIBUTE_DEFAULTS).forEach((key) => {
        gradientSettings[key] = attributes[key];
    });

    return {
        ...extraProps,
        'data-hero-gradient': JSON.stringify(gradientSettings),
        className: extraProps.className ? `${extraProps.className} has-hero-gradient` : 'has-hero-gradient',
    };
}

addFilter(
    'blocks.getSaveContent.extraProps',
    'hero-gradient/add-gradient-data-attribute',
    addGradientDataAttribute
);
