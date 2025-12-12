<?php
/**
 * Plugin Name:       Hero Gradient
 * Description:       Animated gradient background block with nested content support
 * Version:           0.1.1
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hero-gradient
 *
 * @package HeroGradient
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 */
function hero_gradient_hero_gradient_block_init() {
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}

	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'hero_gradient_hero_gradient_block_init' );

/**
 * Always enqueue the view script on frontend.
 * The script self-detects blocks and does nothing if none are present.
 */
function hero_gradient_enqueue_frontend_scripts() {
	// Don't load in admin
	if ( is_admin() ) {
		return;
	}

	$asset_file = __DIR__ . '/build/hero-gradient/view.asset.php';
	if ( file_exists( $asset_file ) ) {
		$asset = require $asset_file;
	} else {
		$asset = array(
			'dependencies' => array(),
			'version'      => '0.1.0',
		);
	}

	wp_enqueue_script(
		'hero-gradient-view',
		plugins_url( 'build/hero-gradient/view.js', __FILE__ ),
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_enqueue_style(
		'hero-gradient-style',
		plugins_url( 'build/hero-gradient/style-index.css', __FILE__ ),
		array(),
		$asset['version']
	);
}
add_action( 'wp_enqueue_scripts', 'hero_gradient_enqueue_frontend_scripts' );
