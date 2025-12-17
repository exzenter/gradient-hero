/**
 * Canvas Masking Control UI
 * Adds a floating checkbox to enable/disable canvas masking
 */

function initCanvasMaskingUI() {
    // Don't initialize in admin
    if (document.body.classList.contains('wp-admin')) {
        return;
    }

    // Create the UI container
    const uiContainer = document.createElement('div');
    uiContainer.id = 'canvas-masking-ui';
    uiContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        user-select: none;
        cursor: pointer;
        transition: all 0.2s ease;
    `;

    // Add hover effect
    uiContainer.addEventListener('mouseenter', () => {
        uiContainer.style.background = 'rgba(0, 0, 0, 0.9)';
    });
    uiContainer.addEventListener('mouseleave', () => {
        uiContainer.style.background = 'rgba(0, 0, 0, 0.8)';
    });

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'canvas-masking-toggle';
    checkbox.checked = true; // ON by default
    checkbox.style.cssText = `
        margin-right: 8px;
        cursor: pointer;
        width: 16px;
        height: 16px;
        vertical-align: middle;
    `;

    // Create label
    const label = document.createElement('label');
    label.htmlFor = 'canvas-masking-toggle';
    label.textContent = 'Canvas Masking';
    label.style.cssText = `
        cursor: pointer;
        vertical-align: middle;
        font-weight: 500;
    `;

    // Assemble the UI
    uiContainer.appendChild(checkbox);
    uiContainer.appendChild(label);
    document.body.appendChild(uiContainer);

    // Handle checkbox change
    checkbox.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        console.log(`[Canvas Masking UI] Toggled: ${enabled}`);

        // Update all gradient animation instances
        const blocks = document.querySelectorAll('.wp-block-hero-gradient, [data-hero-gradient]');
        blocks.forEach((block) => {
            const animation = block._heroGradientAnimation;
            if (animation && typeof animation.updateSetting === 'function') {
                animation.updateSetting('canvasMaskingEnabled', enabled);
                console.log(`[Canvas Masking UI] Updated animation instance:`, animation);
            }
        });
    });

    console.log('[Canvas Masking UI] Initialized');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvasMaskingUI);
} else {
    initCanvasMaskingUI();
}
