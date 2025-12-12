/**
 * Hero Gradient Block Registration
 */

import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';

// Load block extensions for core blocks
import '../extensions/gradient-background';

/**
 * Block icon - gradient art icon
 */
const blockIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
		<defs>
			<linearGradient id="heroGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stopColor="#4a90e2" />
				<stop offset="50%" stopColor="#6bb6ff" />
				<stop offset="100%" stopColor="#8bdaff" />
			</linearGradient>
		</defs>
		<rect x="2" y="4" width="20" height="16" rx="2" fill="url(#heroGradientIcon)" />
		<rect x="6" y="9" width="12" height="2" rx="1" fill="white" opacity="0.9" />
		<rect x="8" y="13" width="8" height="1.5" rx="0.75" fill="white" opacity="0.7" />
	</svg>
);

/**
 * Register the block
 */
registerBlockType(metadata.name, {
	...metadata,
	icon: blockIcon,
	edit: Edit,
	save,
});
