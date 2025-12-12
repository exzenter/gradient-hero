<?php
// This file is generated. Do not modify it manually.
return array(
	'hero-gradient' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'hero-gradient/hero-gradient',
		'version' => '0.1.0',
		'title' => 'Hero Gradient',
		'category' => 'design',
		'icon' => 'art',
		'description' => 'Animated gradient background block with nested content support',
		'keywords' => array(
			'gradient',
			'hero',
			'animation',
			'background',
			'canvas'
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'anchor' => true,
			'className' => true,
			'layout' => array(
				'default' => array(
					'type' => 'constrained'
				),
				'allowSwitching' => true,
				'allowEditing' => true,
				'allowInheriting' => true,
				'allowVerticalAlignment' => true,
				'allowJustification' => true,
				'allowOrientation' => true
			),
			'dimensions' => array(
				'minHeight' => true,
				'aspectRatio' => true
			),
			'position' => array(
				'sticky' => true
			),
			'spacing' => array(
				'padding' => true,
				'margin' => array(
					'top',
					'bottom'
				),
				'blockGap' => true
			)
		),
		'attributes' => array(
			'maxHeight' => array(
				'type' => 'string',
				'default' => ''
			),
			'maxWidth' => array(
				'type' => 'string',
				'default' => ''
			),
			'radialGradientsEnabled' => array(
				'type' => 'boolean',
				'default' => true
			),
			'gradientOpacity' => array(
				'type' => 'number',
				'default' => 100
			),
			'gradientBlur' => array(
				'type' => 'number',
				'default' => 0
			),
			'brightness' => array(
				'type' => 'number',
				'default' => 100
			),
			'contrast' => array(
				'type' => 'number',
				'default' => 100
			),
			'saturation' => array(
				'type' => 'number',
				'default' => 100
			),
			'hueRotation' => array(
				'type' => 'number',
				'default' => 0
			),
			'gradientScale' => array(
				'type' => 'number',
				'default' => 100
			),
			'gradientSize' => array(
				'type' => 'number',
				'default' => 100
			),
			'gradientSizeMode' => array(
				'type' => 'string',
				'default' => 'base'
			),
			'positionX' => array(
				'type' => 'number',
				'default' => 50
			),
			'positionY' => array(
				'type' => 'number',
				'default' => 50
			),
			'blendMode' => array(
				'type' => 'string',
				'default' => 'normal'
			),
			'gradientBlendModeEnabled' => array(
				'type' => 'boolean',
				'default' => false
			),
			'gradientBlendMode' => array(
				'type' => 'string',
				'default' => 'normal'
			),
			'fadeoutMode' => array(
				'type' => 'string',
				'default' => 'none'
			),
			'fadeoutTime' => array(
				'type' => 'number',
				'default' => 10
			),
			'gradientCount' => array(
				'type' => 'number',
				'default' => 5
			),
			'animationSpeed' => array(
				'type' => 'number',
				'default' => 50
			),
			'gradientFade' => array(
				'type' => 'number',
				'default' => 0
			),
			'canvasBgColor' => array(
				'type' => 'string',
				'default' => '#000000'
			),
			'colorMode' => array(
				'type' => 'string',
				'default' => 'hue-range'
			),
			'hueStart' => array(
				'type' => 'number',
				'default' => 200
			),
			'hueEnd' => array(
				'type' => 'number',
				'default' => 280
			),
			'evenlySpacedColors' => array(
				'type' => 'boolean',
				'default' => true
			),
			'hueSeparation' => array(
				'type' => 'number',
				'default' => 100
			),
			'saturationMin' => array(
				'type' => 'number',
				'default' => 60
			),
			'saturationMax' => array(
				'type' => 'number',
				'default' => 100
			),
			'lightnessMin' => array(
				'type' => 'number',
				'default' => 20
			),
			'lightnessMax' => array(
				'type' => 'number',
				'default' => 50
			),
			'paletteColor1' => array(
				'type' => 'string',
				'default' => '#4a90e2'
			),
			'paletteColor2' => array(
				'type' => 'string',
				'default' => '#5ba3f5'
			),
			'paletteColor3' => array(
				'type' => 'string',
				'default' => '#6bb6ff'
			),
			'paletteColor4' => array(
				'type' => 'string',
				'default' => '#7bc9ff'
			),
			'paletteColor5' => array(
				'type' => 'string',
				'default' => '#8bdaff'
			),
			'lineGradientsEnabled' => array(
				'type' => 'boolean',
				'default' => false
			),
			'lineGradientAngle' => array(
				'type' => 'number',
				'default' => 0
			),
			'lineGradientLength' => array(
				'type' => 'number',
				'default' => 200
			),
			'lineGradientWidth' => array(
				'type' => 'number',
				'default' => 100
			),
			'svgEnabled' => array(
				'type' => 'boolean',
				'default' => true
			),
			'svgOpacity' => array(
				'type' => 'number',
				'default' => 15
			),
			'svgSize' => array(
				'type' => 'number',
				'default' => 100
			),
			'svgStrokeWidth' => array(
				'type' => 'number',
				'default' => 1
			),
			'svgPattern' => array(
				'type' => 'string',
				'default' => 'grid'
			),
			'svgColor' => array(
				'type' => 'string',
				'default' => '#ffffff'
			),
			'svgBlendMode' => array(
				'type' => 'string',
				'default' => 'normal'
			)
		),
		'textdomain' => 'hero-gradient',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	)
);
