/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function for dynamic blocks.
 * Since we use render.php for frontend output, we only save InnerBlocks content.
 *
 * @return {Element} Element to render.
 */
export default function save() {
	const blockProps = useBlockProps.save();

	// Only save the InnerBlocks content - render.php handles the wrapper and canvas
	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
}
