<?php
/**
 * Dynamic render callback for Hero Gradient block
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content (inner blocks).
 * @param WP_Block $block      Block instance.
 * @return string Rendered block HTML.
 */

// Get block attributes with defaults
$default_attributes = array(
	'maxHeight'                 => '',
	'maxWidth'                  => '',
	'radialGradientsEnabled'    => true,
	'gradientOpacity'           => 100,
	'gradientBlur'              => 0,
	'brightness'                => 100,
	'contrast'                  => 100,
	'saturation'                => 100,
	'hueRotation'               => 0,
	'gradientScale'             => 100,
	'gradientSize'              => 100,
	'gradientSizeMode'          => 'base',
	'positionX'                 => 50,
	'positionY'                 => 50,
	'blendMode'                 => 'normal',
	'gradientBlendModeEnabled'  => false,
	'gradientBlendMode'         => 'normal',
	'fadeoutMode'               => 'none',
	'fadeoutTime'               => 10,
	'gradientCount'             => 5,
	'animationSpeed'            => 50,
	'gradientFade'              => 0,
	'canvasBgColor'             => '#000000',
	'colorMode'                 => 'hue-range',
	'hueStart'                  => 200,
	'hueEnd'                    => 280,
	'evenlySpacedColors'        => true,
	'hueSeparation'             => 100,
	'saturationMin'             => 60,
	'saturationMax'             => 100,
	'lightnessMin'              => 20,
	'lightnessMax'              => 50,
	'paletteColor1'             => '#4a90e2',
	'paletteColor2'             => '#5ba3f5',
	'paletteColor3'             => '#6bb6ff',
	'paletteColor4'             => '#7bc9ff',
	'paletteColor5'             => '#8bdaff',
	'lineGradientsEnabled'      => false,
	'lineGradientAngle'         => 0,
	'lineGradientLength'        => 200,
	'lineGradientWidth'         => 100,
	'svgEnabled'                => true,
	'svgOpacity'                => 15,
	'svgSize'                   => 100,
	'svgStrokeWidth'            => 1,
	'svgPattern'                => 'grid',
	'svgColor'                  => '#ffffff',
	'svgBlendMode'              => 'normal',
);

$attributes = wp_parse_args( $attributes, $default_attributes );

// Prepare settings JSON for frontend script
$gradient_settings = wp_json_encode( $attributes );

// Extract inner blocks content
$inner_content = '';
if ( ! empty( $block->inner_blocks ) ) {
	foreach ( $block->inner_blocks as $inner_block ) {
		$inner_content .= render_block( $inner_block->parsed_block );
	}
}

// Build custom inline styles for maxWidth/maxHeight
$custom_styles = array();
if ( ! empty( $attributes['maxWidth'] ) ) {
	$custom_styles[] = 'max-width: ' . esc_attr( $attributes['maxWidth'] );
}
if ( ! empty( $attributes['maxHeight'] ) ) {
	$custom_styles[] = 'max-height: ' . esc_attr( $attributes['maxHeight'] );
}
$custom_style_string = ! empty( $custom_styles ) ? implode( '; ', $custom_styles ) . ';' : '';

// Get wrapper attributes - WordPress will add layout/spacing/dimensions styles automatically
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'                  => 'wp-block-hero-gradient',
		'data-gradient-settings' => $gradient_settings,
		'style'                  => $custom_style_string,
	)
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="hero-gradient__background">
		<canvas class="hero-gradient__canvas"></canvas>
		<div class="hero-gradient__svg-overlay"></div>
	</div>
	<div class="hero-gradient__content">
		<?php echo $inner_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</div>
