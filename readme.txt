=== Hero Gradient ===
Contributors:      exzentde
Tags:              gradient, animation, background, hero, block
Tested up to:      6.9
Stable tag:        0.1.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Beautiful animated gradient backgrounds for your WordPress blocks with full customization and nested content support.

== Description ==

**Hero Gradient** adds stunning animated gradient backgrounds to your WordPress site. Create eye-catching hero sections, headers, and content areas with smooth color transitions and optional SVG grid overlays.

= Features =

* Animated gradient backgrounds with customizable colors
* Configurable animation speed and direction
* 10 movement modes (Orbit, Wave, Pulse, Drift, Bounce, Spiral, Sway, Chaos, Figure Eight, Vertical Wave)
* Canvas masking with .no-blend and .still-blend classes for selective blend exclusion
* SVG grid overlay patterns
* Full block editor integration
* Nested content support (add any blocks inside)
* Responsive design

= Block Editor Support =

Works seamlessly with the WordPress block editor (Gutenberg). Simply add the Hero Gradient block and customize colors, animation speed, and overlay patterns directly in the editor.

== Installation ==

1. Upload the `hero-gradient` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. In the block editor, search for "Hero Gradient" and add it to your page

== Frequently Asked Questions ==

= Can I add content inside the gradient block? =

Yes! Hero Gradient supports nested content. Add headings, paragraphs, buttons, or any other blocks inside.

= Does it work with Full Site Editing? =

Yes, Hero Gradient is fully compatible with WordPress Full Site Editing and block themes.

= Can I customize the animation speed? =

Yes, animation speed, colors, and direction are all customizable through the block settings panel.

== Screenshots ==

1. Hero Gradient block in the editor
2. Animated gradient with SVG grid overlay
3. Block settings panel

== Changelog ==

= 0.1.4 =
* Added canvas masking feature with .no-blend class for selective blend exclusion
* Added .still-blend class to create cut-outs in masked regions
* Added frontend UI toggle for canvas masking
* Added comprehensive console debug logging for masking

= 0.1.2 =
* Removed Gradient Opacity option from Canvas Gradient Settings
* Updated Gradient Color Fade to accept values from 0-1 in 0.01 steps

= 0.1.1 =
* Added alpha/transparency support for Canvas Background Color
* Fixed transparent backgrounds appearing black

= 0.1.0 =
* Initial release
* Animated gradient backgrounds
* SVG grid overlay support
* Nested content support

== Upgrade Notice ==

= 0.1.0 =
Initial release of Hero Gradient.
