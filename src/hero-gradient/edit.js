/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	ColorPicker,
	__experimentalUnitControl as UnitControl,
	RadioControl,
	BaseControl,
	ColorIndicator,
	Flex,
	FlexItem,
	Button,
	Popover,
} from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import { GradientAnimation } from './gradient-animation';
import { SVGPatternGenerator } from './svg-patterns';

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

// Color picker component with popover
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
								<ColorPicker
									color={color}
									onChange={onChange}
									enableAlpha={false}
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
 * Edit function
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		// Canvas gradient settings
		radialGradientsEnabled,
		gradientOpacity,
		gradientBlur,
		brightness,
		contrast,
		saturation,
		hueRotation,
		gradientScale,
		gradientSize,
		gradientSizeMode,
		positionX,
		positionY,
		blendMode,
		gradientBlendModeEnabled,
		gradientBlendMode,
		fadeoutMode,
		fadeoutTime,
		gradientCount,
		animationSpeed,
		gradientFade,
		canvasBgColor,
		// Color settings
		colorMode,
		hueStart,
		hueEnd,
		evenlySpacedColors,
		hueSeparation,
		saturationMin,
		saturationMax,
		lightnessMin,
		lightnessMax,
		paletteColor1,
		paletteColor2,
		paletteColor3,
		paletteColor4,
		paletteColor5,
		// Line gradients
		lineGradientsEnabled,
		lineGradientAngle,
		lineGradientLength,
		lineGradientWidth,
		// SVG overlay
		svgEnabled,
		svgOpacity,
		svgSize,
		svgStrokeWidth,
		svgPattern,
		svgColor,
		svgBlendMode,
		// Dimensions
		maxHeight,
		maxWidth,
	} = attributes;

	const canvasRef = useRef(null);
	const svgOverlayRef = useRef(null);
	const animationRef = useRef(null);
	const svgGeneratorRef = useRef(null);

	// Initialize animation
	useEffect(() => {
		if (canvasRef.current && !animationRef.current) {
			animationRef.current = new GradientAnimation(canvasRef.current);
		}

		return () => {
			if (animationRef.current) {
				animationRef.current.destroy();
				animationRef.current = null;
			}
		};
	}, []);

	// Initialize SVG generator
	useEffect(() => {
		if (svgOverlayRef.current && !svgGeneratorRef.current) {
			svgGeneratorRef.current = new SVGPatternGenerator(svgOverlayRef.current);
		}
	}, []);

	// Update animation settings when attributes change
	useEffect(() => {
		if (animationRef.current) {
			const anim = animationRef.current;
			anim.updateSetting('opacity', gradientOpacity / 100);
			anim.updateSetting('blur', gradientBlur);
			anim.updateSetting('brightness', brightness);
			anim.updateSetting('contrast', contrast);
			anim.updateSetting('saturation', saturation);
			anim.updateSetting('hue', hueRotation);
			anim.updateSetting('scale', gradientScale / 100);
			anim.updateSetting('gradientSizeMultiplier', gradientSize / 100);
			anim.updateSetting('gradientSizeMode', gradientSizeMode);
			anim.updateSetting('positionX', positionX / 100);
			anim.updateSetting('positionY', positionY / 100);
			anim.updateSetting('blendMode', blendMode);
			anim.updateSetting('gradientBlendModeEnabled', gradientBlendModeEnabled);
			anim.updateSetting('gradientBlendMode', gradientBlendMode);
			anim.updateSetting('fadeoutMode', fadeoutMode);
			anim.updateSetting('fadeoutTime', fadeoutTime);
			anim.updateSetting('gradientCount', gradientCount);
			anim.updateSetting('gradientSpeed', animationSpeed / 100);
			anim.updateSetting('hueRotationSpeed', gradientFade);
			anim.updateSetting('backgroundColor', canvasBgColor);
			anim.updateSetting('radialGradientsEnabled', radialGradientsEnabled);
			anim.updateSetting('colorMode', colorMode);
			anim.updateSetting('hueStart', hueStart);
			anim.updateSetting('hueEnd', hueEnd);
			anim.updateSetting('evenlySpacedColors', evenlySpacedColors);
			anim.updateSetting('hueSeparation', hueSeparation);
			anim.updateSetting('saturationMin', saturationMin);
			anim.updateSetting('saturationMax', saturationMax);
			anim.updateSetting('lightnessMin', lightnessMin);
			anim.updateSetting('lightnessMax', lightnessMax);
			anim.updateSetting('paletteColors', [paletteColor1, paletteColor2, paletteColor3, paletteColor4, paletteColor5]);
			anim.updateSetting('lineGradientsEnabled', lineGradientsEnabled);
			anim.updateSetting('lineGradientAngle', lineGradientAngle);
			anim.updateSetting('lineGradientLength', lineGradientLength);
			anim.updateSetting('lineGradientWidth', lineGradientWidth);
		}
	}, [
		radialGradientsEnabled, gradientOpacity, gradientBlur, brightness, contrast, saturation,
		hueRotation, gradientScale, gradientSize, gradientSizeMode, positionX, positionY,
		blendMode, gradientBlendModeEnabled, gradientBlendMode, fadeoutMode, fadeoutTime,
		gradientCount, animationSpeed, gradientFade, canvasBgColor, colorMode, hueStart,
		hueEnd, evenlySpacedColors, hueSeparation, saturationMin, saturationMax, lightnessMin,
		lightnessMax, paletteColor1, paletteColor2, paletteColor3, paletteColor4, paletteColor5,
		lineGradientsEnabled, lineGradientAngle, lineGradientLength, lineGradientWidth,
	]);

	// Update SVG overlay when settings change
	useEffect(() => {
		if (svgGeneratorRef.current) {
			svgGeneratorRef.current.setEnabled(svgEnabled);
			if (svgEnabled) {
				svgGeneratorRef.current.updatePattern(svgPattern, svgSize, svgOpacity, svgColor, svgBlendMode, svgStrokeWidth);
			}
		}
	}, [svgEnabled, svgOpacity, svgSize, svgStrokeWidth, svgPattern, svgColor, svgBlendMode]);

	const blockProps = useBlockProps({
		className: 'wp-block-hero-gradient',
		style: {
			maxHeight: maxHeight || undefined,
			maxWidth: maxWidth || undefined,
		},
	});

	return (
		<>
			<InspectorControls>
				{/* Canvas Gradient Settings Panel */}
				<PanelBody title={__('Canvas Gradient Settings', 'hero-gradient')} initialOpen={true}>
					<ToggleControl
						label={__('Enable Radial Gradients', 'hero-gradient')}
						checked={radialGradientsEnabled}
						onChange={(value) => setAttributes({ radialGradientsEnabled: value })}
					/>
					<RangeControl
						label={__('Gradient Opacity', 'hero-gradient')}
						value={gradientOpacity}
						onChange={(value) => setAttributes({ gradientOpacity: value })}
						min={0}
						max={100}
						step={1}
					/>
					<RangeControl
						label={__('Blur', 'hero-gradient')}
						value={gradientBlur}
						onChange={(value) => setAttributes({ gradientBlur: value })}
						min={0}
						max={50}
						step={1}
					/>
					<RangeControl
						label={__('Brightness', 'hero-gradient')}
						value={brightness}
						onChange={(value) => setAttributes({ brightness: value })}
						min={0}
						max={200}
						step={1}
					/>
					<RangeControl
						label={__('Contrast', 'hero-gradient')}
						value={contrast}
						onChange={(value) => setAttributes({ contrast: value })}
						min={0}
						max={200}
						step={1}
					/>
					<RangeControl
						label={__('Saturation', 'hero-gradient')}
						value={saturation}
						onChange={(value) => setAttributes({ saturation: value })}
						min={0}
						max={200}
						step={1}
					/>
					<RangeControl
						label={__('Hue Rotation', 'hero-gradient')}
						value={hueRotation}
						onChange={(value) => setAttributes({ hueRotation: value })}
						min={0}
						max={360}
						step={1}
					/>
					<RangeControl
						label={__('Gradient Scale', 'hero-gradient')}
						value={gradientScale}
						onChange={(value) => setAttributes({ gradientScale: value })}
						min={50}
						max={200}
						step={1}
					/>
					<RangeControl
						label={__('Gradient Size', 'hero-gradient')}
						value={gradientSize}
						onChange={(value) => setAttributes({ gradientSize: value })}
						min={50}
						max={200}
						step={1}
					/>
					<RadioControl
						label={__('Gradient Size Mode', 'hero-gradient')}
						selected={gradientSizeMode}
						options={[
							{ label: __('Apply to Base Radius', 'hero-gradient'), value: 'base' },
							{ label: __('Apply During Drawing', 'hero-gradient'), value: 'drawing' },
						]}
						onChange={(value) => setAttributes({ gradientSizeMode: value })}
					/>
					<RangeControl
						label={__('Center Position X', 'hero-gradient')}
						value={positionX}
						onChange={(value) => setAttributes({ positionX: value })}
						min={0}
						max={100}
						step={1}
					/>
					<RangeControl
						label={__('Center Position Y', 'hero-gradient')}
						value={positionY}
						onChange={(value) => setAttributes({ positionY: value })}
						min={0}
						max={100}
						step={1}
					/>
					<SelectControl
						label={__('Mix Blend Mode', 'hero-gradient')}
						value={blendMode}
						options={BLEND_MODE_OPTIONS}
						onChange={(value) => setAttributes({ blendMode: value })}
					/>
					<ToggleControl
						label={__('Gradient Blend Mode (Gradient-to-Gradient)', 'hero-gradient')}
						checked={gradientBlendModeEnabled}
						onChange={(value) => setAttributes({ gradientBlendModeEnabled: value })}
					/>
					{gradientBlendModeEnabled && (
						<SelectControl
							label={__('Gradient Blend Mode', 'hero-gradient')}
							value={gradientBlendMode}
							options={BLEND_MODE_OPTIONS}
							onChange={(value) => setAttributes({ gradientBlendMode: value })}
						/>
					)}
					<SelectControl
						label={__('Fadeout Mode', 'hero-gradient')}
						value={fadeoutMode}
						options={[
							{ label: __('None', 'hero-gradient'), value: 'none' },
							{ label: __('Auto (Recommended for Lighten)', 'hero-gradient'), value: 'auto' },
							{ label: __('Custom', 'hero-gradient'), value: 'custom' },
						]}
						onChange={(value) => setAttributes({ fadeoutMode: value })}
					/>
					{fadeoutMode === 'custom' && (
						<RangeControl
							label={__('Fadeout Time (seconds)', 'hero-gradient')}
							value={fadeoutTime}
							onChange={(value) => setAttributes({ fadeoutTime: value })}
							min={1}
							max={60}
							step={1}
						/>
					)}
					<RangeControl
						label={__('Gradient Count', 'hero-gradient')}
						value={gradientCount}
						onChange={(value) => setAttributes({ gradientCount: value })}
						min={2}
						max={10}
						step={1}
					/>
					<RangeControl
						label={__('Animation Speed', 'hero-gradient')}
						value={animationSpeed}
						onChange={(value) => setAttributes({ animationSpeed: value })}
						min={0}
						max={1000}
						step={1}
						renderTooltipContent={(value) => (value / 100).toFixed(2)}
					/>
					<RangeControl
						label={__('Gradient Color Fade', 'hero-gradient')}
						value={gradientFade}
						onChange={(value) => setAttributes({ gradientFade: value })}
						min={0}
						max={10}
						step={0.1}
					/>
					<ColorPickerControl
						label={__('Canvas Background Color', 'hero-gradient')}
						color={canvasBgColor}
						onChange={(value) => setAttributes({ canvasBgColor: value })}
					/>
				</PanelBody>

				{/* Gradient Colors Panel */}
				<PanelBody title={__('Gradient Colors', 'hero-gradient')} initialOpen={false}>
					<SelectControl
						label={__('Color Palette Mode', 'hero-gradient')}
						value={colorMode}
						options={[
							{ label: __('Hue Range (Auto)', 'hero-gradient'), value: 'hue-range' },
							{ label: __('Custom Palette', 'hero-gradient'), value: 'palette' },
						]}
						onChange={(value) => setAttributes({ colorMode: value })}
					/>
					{colorMode === 'hue-range' && (
						<>
							<RangeControl
								label={__('Base Hue Start', 'hero-gradient')}
								value={hueStart}
								onChange={(value) => setAttributes({ hueStart: value })}
								min={0}
								max={360}
								step={1}
							/>
							<RangeControl
								label={__('Base Hue End', 'hero-gradient')}
								value={hueEnd}
								onChange={(value) => setAttributes({ hueEnd: value })}
								min={0}
								max={360}
								step={1}
							/>
							<ToggleControl
								label={__('Evenly Spaced Colors', 'hero-gradient')}
								checked={evenlySpacedColors}
								onChange={(value) => setAttributes({ evenlySpacedColors: value })}
							/>
							<RangeControl
								label={__('Hue Separation', 'hero-gradient')}
								value={hueSeparation}
								onChange={(value) => setAttributes({ hueSeparation: value })}
								min={0}
								max={100}
								step={1}
							/>
							<RangeControl
								label={__('Saturation Min', 'hero-gradient')}
								value={saturationMin}
								onChange={(value) => setAttributes({ saturationMin: value })}
								min={0}
								max={100}
								step={1}
							/>
							<RangeControl
								label={__('Saturation Max', 'hero-gradient')}
								value={saturationMax}
								onChange={(value) => setAttributes({ saturationMax: value })}
								min={0}
								max={100}
								step={1}
							/>
							<RangeControl
								label={__('Lightness Min', 'hero-gradient')}
								value={lightnessMin}
								onChange={(value) => setAttributes({ lightnessMin: value })}
								min={0}
								max={100}
								step={1}
							/>
							<RangeControl
								label={__('Lightness Max', 'hero-gradient')}
								value={lightnessMax}
								onChange={(value) => setAttributes({ lightnessMax: value })}
								min={0}
								max={100}
								step={1}
							/>
						</>
					)}
					{colorMode === 'palette' && (
						<>
							<ColorPickerControl
								label={__('Color 1', 'hero-gradient')}
								color={paletteColor1}
								onChange={(value) => setAttributes({ paletteColor1: value })}
							/>
							<ColorPickerControl
								label={__('Color 2', 'hero-gradient')}
								color={paletteColor2}
								onChange={(value) => setAttributes({ paletteColor2: value })}
							/>
							<ColorPickerControl
								label={__('Color 3', 'hero-gradient')}
								color={paletteColor3}
								onChange={(value) => setAttributes({ paletteColor3: value })}
							/>
							<ColorPickerControl
								label={__('Color 4', 'hero-gradient')}
								color={paletteColor4}
								onChange={(value) => setAttributes({ paletteColor4: value })}
							/>
							<ColorPickerControl
								label={__('Color 5', 'hero-gradient')}
								color={paletteColor5}
								onChange={(value) => setAttributes({ paletteColor5: value })}
							/>
						</>
					)}
				</PanelBody>

				{/* Line Gradients Panel */}
				<PanelBody title={__('Line Gradients', 'hero-gradient')} initialOpen={false}>
					<ToggleControl
						label={__('Enable Line Gradients', 'hero-gradient')}
						checked={lineGradientsEnabled}
						onChange={(value) => setAttributes({ lineGradientsEnabled: value })}
					/>
					{lineGradientsEnabled && (
						<>
							<RangeControl
								label={__('Line Gradient Angle', 'hero-gradient')}
								value={lineGradientAngle}
								onChange={(value) => setAttributes({ lineGradientAngle: value })}
								min={0}
								max={360}
								step={1}
							/>
							<RangeControl
								label={__('Line Gradient Length', 'hero-gradient')}
								value={lineGradientLength}
								onChange={(value) => setAttributes({ lineGradientLength: value })}
								min={50}
								max={1000}
								step={1}
							/>
							<RangeControl
								label={__('Line Gradient Width', 'hero-gradient')}
								value={lineGradientWidth}
								onChange={(value) => setAttributes({ lineGradientWidth: value })}
								min={20}
								max={500}
								step={1}
							/>
						</>
					)}
				</PanelBody>

				{/* SVG Pattern Overlay Panel */}
				<PanelBody title={__('SVG Pattern Overlay', 'hero-gradient')} initialOpen={false}>
					<ToggleControl
						label={__('Enable SVG Overlay', 'hero-gradient')}
						checked={svgEnabled}
						onChange={(value) => setAttributes({ svgEnabled: value })}
					/>
					{svgEnabled && (
						<>
							<RangeControl
								label={__('SVG Opacity', 'hero-gradient')}
								value={svgOpacity}
								onChange={(value) => setAttributes({ svgOpacity: value })}
								min={0}
								max={100}
								step={1}
							/>
							<RangeControl
								label={__('Pattern Size', 'hero-gradient')}
								value={svgSize}
								onChange={(value) => setAttributes({ svgSize: value })}
								min={20}
								max={300}
								step={1}
							/>
							<RangeControl
								label={__('Stroke Width', 'hero-gradient')}
								value={svgStrokeWidth}
								onChange={(value) => setAttributes({ svgStrokeWidth: value })}
								min={0.1}
								max={5}
								step={0.1}
							/>
							<SelectControl
								label={__('Pattern Type', 'hero-gradient')}
								value={svgPattern}
								options={SVG_PATTERN_OPTIONS}
								onChange={(value) => setAttributes({ svgPattern: value })}
							/>
							<ColorPickerControl
								label={__('SVG Pattern Color', 'hero-gradient')}
								color={svgColor}
								onChange={(value) => setAttributes({ svgColor: value })}
							/>
							<SelectControl
								label={__('SVG Mix Blend Mode', 'hero-gradient')}
								value={svgBlendMode}
								options={BLEND_MODE_OPTIONS}
								onChange={(value) => setAttributes({ svgBlendMode: value })}
							/>
						</>
					)}
				</PanelBody>

				{/* Dimensions Panel */}
				<PanelBody title={__('Dimensions', 'hero-gradient')} initialOpen={false}>
					<BaseControl>
						<UnitControl
							label={__('Max Width', 'hero-gradient')}
							value={maxWidth}
							onChange={(value) => setAttributes({ maxWidth: value })}
							units={[
								{ value: 'px', label: 'px' },
								{ value: '%', label: '%' },
								{ value: 'vw', label: 'vw' },
								{ value: 'em', label: 'em' },
							]}
						/>
					</BaseControl>
					<BaseControl>
						<UnitControl
							label={__('Max Height', 'hero-gradient')}
							value={maxHeight}
							onChange={(value) => setAttributes({ maxHeight: value })}
							units={[
								{ value: 'px', label: 'px' },
								{ value: 'vh', label: 'vh' },
								{ value: '%', label: '%' },
								{ value: 'em', label: 'em' },
							]}
						/>
					</BaseControl>
					<p className="components-base-control__help">
						{__('Min height is set in the native Dimensions panel in the block settings.', 'hero-gradient')}
					</p>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="hero-gradient__background">
					<canvas ref={canvasRef} className="hero-gradient__canvas" />
					<div ref={svgOverlayRef} className="hero-gradient__svg-overlay" />
				</div>
				<div className="hero-gradient__content">
					<InnerBlocks
						template={[
							['core/heading', { placeholder: __('Add your heading...', 'hero-gradient'), level: 1 }],
							['core/paragraph', { placeholder: __('Add your content...', 'hero-gradient') }],
						]}
						templateLock={false}
					/>
				</div>
			</div>
		</>
	);
}
