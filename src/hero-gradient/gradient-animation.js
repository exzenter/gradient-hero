/**
 * Canvas Gradient Animation
 * Ported from the standalone gradient generator
 */
export class GradientAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationId = null;

        // Animation properties
        this.gradients = [];
        this.time = 0;
        this.speed = 0.0005;

        // Settings
        this.settings = {
            opacity: 1,
            blur: 0,
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0,
            scale: 1,
            gradientSizeMultiplier: 1.0,
            gradientSizeMode: 'base',
            positionX: 0.5,
            positionY: 0.5,
            blendMode: 'normal',
            gradientBlendMode: 'normal',
            gradientBlendModeEnabled: false,
            gradientCount: 5,
            gradientSpeed: 0.5,
            colorIntensity: 0.6,
            backgroundColor: '#000000',
            gradientFade: 0.5,
            hueRotationSpeed: 0,
            animatedHue: 0,
            hueStart: 200,
            hueEnd: 280,
            hueSeparation: 100,
            evenlySpacedColors: true,
            saturationMin: 60,
            saturationMax: 100,
            lightnessMin: 20,
            lightnessMax: 50,
            colorMode: 'hue-range',
            paletteColors: ['#4a90e2', '#5ba3f5', '#6bb6ff', '#7bc9ff', '#8bdaff'],
            fadeoutMode: 'none',
            fadeoutTime: 10,
            radialGradientsEnabled: true,
            lineGradientsEnabled: false,
            lineGradientAngle: 0,
            lineGradientLength: 200,
            lineGradientWidth: 100,
            // Movement settings
            movementMode: 'orbit',
            amplitudeX: 10,
            amplitudeY: 15,
            // Canvas size constraints (0 = no limit)
            maxWidth: 0,
            maxHeight: 0,
        };

        // Fadeout tracking
        this.fadeoutLastTime = Date.now();
        this.accumulatingBlendModes = ['lighten', 'screen', 'color-dodge', 'overlay', 'soft-light'];

        this.init();
    }

    init() {
        this.resize();
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
        this.createGradients();
        this.animate();
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 800, height: 600 };
        let width = rect.width || 800;
        let height = rect.height || 600;

        // Apply max constraints if set
        if (this.settings.maxWidth > 0 && width > this.settings.maxWidth) {
            width = this.settings.maxWidth;
        }
        if (this.settings.maxHeight > 0 && height > this.settings.maxHeight) {
            height = this.settings.maxHeight;
        }

        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }

    /**
     * Create or update gradients while preserving animation state
     * @param {boolean} forceRecreate - If true, regenerate all random seeds (used when gradient count changes)
     */
    createGradients(forceRecreate = true) {
        const count = this.settings.gradientCount;
        const baseRadiusMultiplier = this.settings.gradientSizeMode === 'base' ? this.settings.gradientSizeMultiplier : 1.0;

        // If we need to recreate or don't have gradients yet, generate new seeds
        if (forceRecreate || this.gradients.length === 0) {
            // Store the previous gradient seeds if they exist (for partial preservation)
            const previousSeeds = this.gradients.map(g => ({
                phase: g.phase,
                opacityBase: g.opacityBase,
                radiusFactor: g.radiusFactor,
                velocityX: g.velocityX,
                velocityY: g.velocityY,
                initialX: g.initialX,
                initialY: g.initialY,
            }));

            this.gradients = [];

            for (let i = 0; i < count; i++) {
                // Reuse previous seeds if available (for when count changes but we want some stability)
                const previousSeed = previousSeeds[i];
                const seed = previousSeed || {
                    phase: Math.random() * Math.PI * 2,
                    opacityBase: 0.3 + Math.random() * 0.4,
                    radiusFactor: 200 + Math.random() * 400,
                    velocityX: (Math.random() - 0.5) * 0.5,
                    velocityY: (Math.random() - 0.5) * 0.5,
                    initialX: Math.random(),
                    initialY: Math.random(),
                };

                this.gradients.push({
                    x: seed.initialX * this.canvas.width,
                    y: seed.initialY * this.canvas.height,
                    radius: seed.radiusFactor * baseRadiusMultiplier,
                    vx: seed.velocityX,
                    vy: seed.velocityY,
                    color: this.generateColor(i),
                    opacity: seed.opacityBase,
                    phase: seed.phase,
                    baseIndex: i,
                    // Store seeds for future preservation
                    opacityBase: seed.opacityBase,
                    radiusFactor: seed.radiusFactor,
                    velocityX: seed.velocityX,
                    velocityY: seed.velocityY,
                    initialX: seed.initialX,
                    initialY: seed.initialY,
                });
            }
        } else {
            // Just update existing gradients without changing random seeds
            this.gradients.forEach((gradient, i) => {
                gradient.radius = gradient.radiusFactor * baseRadiusMultiplier;
                gradient.color = this.generateColor(i);
            });
        }
    }

    generateColor(index = null) {
        if (this.settings.colorMode === 'palette' && this.settings.paletteColors.length > 0) {
            const paletteIndex = index !== null ? index % this.settings.paletteColors.length : Math.floor(Math.random() * this.settings.paletteColors.length);
            return this.settings.paletteColors[paletteIndex];
        } else {
            const hueRange = this.settings.hueEnd - this.settings.hueStart;
            const separationRange = hueRange * (this.settings.hueSeparation / 100);

            let hue;
            if (this.settings.evenlySpacedColors && index !== null && this.settings.gradientCount > 1) {
                const spacing = separationRange / (this.settings.gradientCount - 1);
                hue = this.settings.hueStart + index * spacing;
            } else {
                hue = this.settings.hueStart + Math.random() * separationRange;
            }

            const saturation = this.settings.saturationMin + Math.random() * (this.settings.saturationMax - this.settings.saturationMin);
            const lightness = this.settings.lightnessMin + Math.random() * (this.settings.lightnessMax - this.settings.lightnessMin);
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
    }

    /**
     * Calculate position offset based on movement mode
     * @param {Object} gradient - The gradient object with phase and baseIndex
     * @param {number} index - Index of the gradient
     * @param {number} time - Current animation time
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @returns {{offsetX: number, offsetY: number}} Position offsets
     */
    calculateMovementPosition(gradient, index, time, width, height) {
        const speed = this.settings.gradientSpeed;
        const ampX = this.settings.amplitudeX / 100;
        const ampY = this.settings.amplitudeY / 100;
        const phase = gradient.phase;
        const t = time * speed;

        let offsetX = 0;
        let offsetY = 0;

        switch (this.settings.movementMode) {
            case 'orbit':
            default:
                // Elliptical orbit pattern (original behavior)
                offsetX = Math.sin(t + phase) * width * ampX;
                offsetY = Math.cos(t + phase * 1.3) * height * ampY;
                break;

            case 'wave':
                // Horizontal wave with vertical oscillation
                offsetX = Math.sin(t + phase) * width * ampX;
                offsetY = Math.sin(t * 2 + phase + index * 0.5) * height * ampY * 0.5;
                break;

            case 'pulse':
                // Radial expansion/contraction from center
                const pulsePhase = t + phase;
                const pulseRadius = (Math.sin(pulsePhase) * 0.5 + 0.5);
                const pulseAngle = phase * Math.PI * 2;
                offsetX = Math.cos(pulseAngle) * pulseRadius * width * ampX;
                offsetY = Math.sin(pulseAngle) * pulseRadius * height * ampY;
                break;

            case 'drift':
                // Slow random wandering with smooth transitions using multiple sine waves
                offsetX = (Math.sin(t * 0.7 + phase) * 0.5 + Math.sin(t * 0.3 + phase * 2) * 0.3 + Math.sin(t * 0.1 + phase * 3) * 0.2) * width * ampX;
                offsetY = (Math.cos(t * 0.5 + phase) * 0.5 + Math.cos(t * 0.2 + phase * 2.5) * 0.3 + Math.cos(t * 0.15 + phase * 1.5) * 0.2) * height * ampY;
                break;

            case 'bounce':
                // Bounce-style movement (absolute sine for bounce effect)
                const bounceX = Math.abs(Math.sin(t + phase));
                const bounceY = Math.abs(Math.sin(t * 1.3 + phase * 0.7));
                offsetX = (bounceX * 2 - 1) * width * ampX;
                offsetY = (bounceY * 2 - 1) * height * ampY;
                break;

            case 'spiral':
                // Outward/inward spiral pattern
                const spiralT = t + phase;
                const spiralRadius = (Math.sin(spiralT * 0.5) * 0.5 + 0.5);
                const spiralAngle = spiralT * 2;
                offsetX = Math.cos(spiralAngle) * spiralRadius * width * ampX;
                offsetY = Math.sin(spiralAngle) * spiralRadius * height * ampY;
                break;

            case 'sway':
                // Gentle horizontal pendulum motion with subtle vertical
                offsetX = Math.sin(t + phase) * width * ampX;
                offsetY = Math.sin(t * 0.5 + phase) * height * ampY * 0.3;
                break;

            case 'chaos':
                // Multi-frequency noise-based movement
                const chaos1 = Math.sin(t * 1.1 + phase) * Math.cos(t * 0.7 + phase * 1.3);
                const chaos2 = Math.sin(t * 0.8 + phase * 2) * Math.cos(t * 1.5 + phase);
                const chaos3 = Math.sin(t * 2.1 + phase * 0.5);
                offsetX = (chaos1 * 0.5 + chaos2 * 0.3 + chaos3 * 0.2) * width * ampX;
                offsetY = (chaos2 * 0.5 + chaos3 * 0.3 + chaos1 * 0.2) * height * ampY;
                break;

            case 'figure-eight':
                // Infinity/lemniscate pattern
                const figureT = t + phase;
                offsetX = Math.sin(figureT) * width * ampX;
                offsetY = Math.sin(figureT * 2) * height * ampY * 0.5;
                break;

            case 'vertical-wave':
                // Vertical wave with horizontal oscillation
                offsetX = Math.sin(t * 2 + phase + index * 0.5) * width * ampX * 0.5;
                offsetY = Math.sin(t + phase) * height * ampY;
                break;
        }

        return { offsetX, offsetY };
    }

    updateGradients() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = this.canvas.width / dpr;
        const height = this.canvas.height / dpr;

        const centerX = width * this.settings.positionX;
        const centerY = height * this.settings.positionY;

        this.gradients.forEach((gradient, i) => {
            // Use the movement mode calculation
            const { offsetX, offsetY } = this.calculateMovementPosition(gradient, i, this.time, width, height);
            gradient.x = centerX + offsetX;
            gradient.y = centerY + offsetY;

            if (this.settings.colorMode === 'palette' && this.settings.paletteColors.length > 0) {
                const paletteIndex = gradient.baseIndex % this.settings.paletteColors.length;
                gradient.color = this.settings.paletteColors[paletteIndex];
            } else {
                const hueRange = this.settings.hueEnd - this.settings.hueStart;
                const separationRange = hueRange * (this.settings.hueSeparation / 100);

                let baseHue;
                if (this.settings.evenlySpacedColors && this.settings.gradientCount > 1) {
                    const spacing = separationRange / (this.settings.gradientCount - 1);
                    const baseHueValue = this.settings.hueStart + gradient.baseIndex * spacing;
                    const hueShift = Math.sin(this.time * 0.3 + i) * 20 + this.settings.hue;
                    baseHue = baseHueValue + hueShift;
                } else {
                    const hueShift = Math.sin(this.time * 0.3 + i) * 20 + this.settings.hue;
                    const randomOffset = (gradient.baseIndex * 0.1) % 1;
                    baseHue = this.settings.hueStart + randomOffset * separationRange + hueShift;
                }

                const sat = Math.max(
                    this.settings.saturationMin,
                    Math.min(
                        this.settings.saturationMax,
                        (this.settings.saturationMin + this.settings.saturationMax) / 2 + Math.sin(this.time + i) * ((this.settings.saturationMax - this.settings.saturationMin) / 2)
                    )
                );
                const light = Math.max(
                    this.settings.lightnessMin,
                    Math.min(
                        this.settings.lightnessMax,
                        (this.settings.lightnessMin + this.settings.lightnessMax) / 2 + Math.sin(this.time * 0.5 + i) * ((this.settings.lightnessMax - this.settings.lightnessMin) / 2)
                    )
                );
                gradient.color = `hsl(${baseHue % 360}, ${sat}%, ${light}%)`;
            }

            gradient.opacity = (0.3 + Math.sin(this.time * 0.4 + gradient.phase) * 0.2) * this.settings.opacity;
        });

        this.applyRepulsion();

        this.gradients.forEach((gradient) => {
            if (gradient.x < -gradient.radius) gradient.x = width + gradient.radius;
            if (gradient.x > width + gradient.radius) gradient.x = -gradient.radius;
            if (gradient.y < -gradient.radius) gradient.y = height + gradient.radius;
            if (gradient.y > height + gradient.radius) gradient.y = -gradient.radius;
        });
    }

    applyRepulsion() {
        const minDistance = 150;
        const repulsionStrength = 0.15;
        const overlapThreshold = 0.6;

        for (let i = 0; i < this.gradients.length; i++) {
            const gradient1 = this.gradients[i];
            const overlappingIndices = [];

            for (let j = 0; j < this.gradients.length; j++) {
                if (i === j) continue;

                const gradient2 = this.gradients[j];
                const dx = gradient1.x - gradient2.x;
                const dy = gradient1.y - gradient2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const avgRadius = (gradient1.radius + gradient2.radius) / 2;
                const threshold = avgRadius * overlapThreshold;

                if (distance < threshold) {
                    overlappingIndices.push(j);
                }
            }

            if (overlappingIndices.length >= 2) {
                const forceMultiplier = 1 + (overlappingIndices.length - 1) * 0.5;

                let totalForceX = 0;
                let totalForceY = 0;

                overlappingIndices.forEach((j) => {
                    const gradient2 = this.gradients[j];
                    const dx = gradient1.x - gradient2.x;
                    const dy = gradient1.y - gradient2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 0 && distance < minDistance) {
                        const nx = dx / distance;
                        const ny = dy / distance;
                        const force = (minDistance - distance) / minDistance;
                        totalForceX += nx * force * repulsionStrength * forceMultiplier;
                        totalForceY += ny * force * repulsionStrength * forceMultiplier;
                    }
                });

                gradient1.x += totalForceX;
                gradient1.y += totalForceY;
            } else {
                overlappingIndices.forEach((j) => {
                    const gradient2 = this.gradients[j];
                    const dx = gradient1.x - gradient2.x;
                    const dy = gradient1.y - gradient2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 0 && distance < minDistance) {
                        const nx = dx / distance;
                        const ny = dy / distance;
                        const force = (minDistance - distance) / minDistance;

                        gradient1.x += nx * force * repulsionStrength * 0.5;
                        gradient1.y += ny * force * repulsionStrength * 0.5;
                    }
                });
            }
        }
    }

    draw() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = this.canvas.width / dpr;
        const height = this.canvas.height / dpr;

        const shouldFadeout = this.settings.fadeoutMode !== 'none' && this.accumulatingBlendModes.includes(this.settings.blendMode);

        let tempCanvas = null;
        let tempCtx = null;

        if (this.settings.gradientBlendModeEnabled) {
            tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCtx = tempCanvas.getContext('2d');
            tempCtx.clearRect(0, 0, width, height);

            if (this.settings.blur > 0) {
                tempCtx.filter = `blur(${this.settings.blur}px)`;
            } else {
                tempCtx.filter = 'none';
            }

            tempCtx.globalCompositeOperation = this.settings.gradientBlendMode;
        } else {
            // Clear canvas first to support transparent backgrounds
            this.ctx.clearRect(0, 0, width, height);
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.fillStyle = this.settings.backgroundColor;
            this.ctx.fillRect(0, 0, width, height);

            this.ctx.globalCompositeOperation = this.settings.blendMode;

            if (this.settings.blur > 0) {
                this.ctx.filter = `blur(${this.settings.blur}px)`;
            } else {
                this.ctx.filter = 'none';
            }
        }

        const drawingMultiplier = this.settings.gradientSizeMode === 'drawing' ? this.settings.gradientSizeMultiplier : 1.0;
        const ctx = this.settings.gradientBlendModeEnabled ? tempCtx : this.ctx;

        this.gradients.forEach((gradient) => {
            if (this.settings.radialGradientsEnabled) {
                const scaledRadius = gradient.radius * this.settings.scale * drawingMultiplier;
                const grad = this.ctx.createRadialGradient(gradient.x, gradient.y, 0, gradient.x, gradient.y, scaledRadius);

                const colorMatch = gradient.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
                if (colorMatch) {
                    const [, h, s, l] = colorMatch;
                    const fadePoint = this.settings.gradientFade;

                    grad.addColorStop(0, `hsla(${h}, ${s}%, ${l}%, ${gradient.opacity})`);
                    grad.addColorStop(fadePoint, `hsla(${h}, ${s}%, ${l}%, ${gradient.opacity * (1 - fadePoint)})`);
                    grad.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);
                } else {
                    grad.addColorStop(0, gradient.color);
                    grad.addColorStop(1, 'transparent');
                }

                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);
            }

            if (this.settings.lineGradientsEnabled) {
                const angle = (this.settings.lineGradientAngle * Math.PI) / 180;
                const length = this.settings.lineGradientLength * drawingMultiplier;
                const lineWidth = this.settings.lineGradientWidth * drawingMultiplier;

                const halfLength = length / 2;
                const halfWidth = lineWidth / 2;

                const centerX = gradient.x;
                const centerY = gradient.y;

                const colorMatch = gradient.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
                const fadePoint = this.settings.gradientFade;

                const maxRadius = Math.max(halfLength, halfWidth);
                const scaleX = halfLength / maxRadius;
                const scaleY = halfWidth / maxRadius;

                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(angle);
                ctx.scale(scaleX, scaleY);

                const lineGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);

                if (colorMatch) {
                    const [, h, s, l] = colorMatch;
                    lineGrad.addColorStop(0, `hsla(${h}, ${s}%, ${l}%, ${gradient.opacity})`);
                    lineGrad.addColorStop(fadePoint, `hsla(${h}, ${s}%, ${l}%, ${gradient.opacity * (1 - fadePoint)})`);
                    lineGrad.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);
                } else {
                    lineGrad.addColorStop(0, gradient.color);
                    lineGrad.addColorStop(1, 'transparent');
                }

                ctx.fillStyle = lineGrad;
                ctx.fillRect(-maxRadius, -maxRadius, maxRadius * 2, maxRadius * 2);
                ctx.restore();
            }
        });

        if (this.settings.gradientBlendModeEnabled) {
            tempCtx.filter = 'none';
            // Clear canvas first to support transparent backgrounds
            this.ctx.clearRect(0, 0, width, height);
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.fillStyle = this.settings.backgroundColor;
            this.ctx.fillRect(0, 0, width, height);

            if (this.settings.blur > 0) {
                this.ctx.filter = `blur(${this.settings.blur}px)`;
            } else {
                this.ctx.filter = 'none';
            }

            this.ctx.globalCompositeOperation = this.settings.blendMode;
            this.ctx.drawImage(tempCanvas, 0, 0);
        }

        this.ctx.filter = 'none';

        if (shouldFadeout) {
            const fadeoutInterval = this.settings.fadeoutMode === 'auto' ? 10 : this.settings.fadeoutTime;
            const fadePerSecond = 1 / fadeoutInterval;
            const fadePerFrame = fadePerSecond / 60;
            const fadeAmount = Math.min(0.03, fadePerFrame * 0.8);

            this.ctx.globalCompositeOperation = 'multiply';
            this.ctx.fillStyle = `rgba(255, 255, 255, ${1 - fadeAmount})`;
            this.ctx.fillRect(0, 0, width, height);
        }

        this.applyFilters();
    }

    applyFilters() {
        const filter = [];
        if (this.settings.brightness !== 100) filter.push(`brightness(${this.settings.brightness}%)`);
        if (this.settings.contrast !== 100) filter.push(`contrast(${this.settings.contrast}%)`);
        if (this.settings.saturation !== 100) filter.push(`saturate(${this.settings.saturation}%)`);

        const totalHue = this.settings.hue + this.settings.animatedHue;
        if (totalHue !== 0) filter.push(`hue-rotate(${totalHue}deg)`);

        this.canvas.style.filter = filter.join(' ') || 'none';
    }

    animate() {
        this.time += this.speed;

        if (this.settings.hueRotationSpeed > 0) {
            const hueRotationPerFrame = (this.settings.hueRotationSpeed * 360) / 60;
            this.settings.animatedHue = (this.settings.animatedHue + hueRotationPerFrame) % 360;
        }

        this.updateGradients();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateSetting(key, value) {
        const oldValue = this.settings[key];
        this.settings[key] = value;

        if (key === 'gradientCount') {
            // Only force recreate if the count actually changed
            if (oldValue !== value) {
                this.createGradients(true);
            }
        } else if (key === 'colorMode' || key === 'paletteColors') {
            // Update colors without recreating gradient positions
            this.createGradients(false);
        } else if (key === 'hueSeparation' || key === 'evenlySpacedColors') {
            // Update colors without recreating gradient positions
            this.createGradients(false);
        } else if (key === 'gradientSizeMultiplier' || key === 'gradientSizeMode') {
            if (key === 'gradientSizeMode' || (key === 'gradientSizeMultiplier' && this.settings.gradientSizeMode === 'base')) {
                // Update radius without recreating gradient positions
                this.createGradients(false);
            }
        } else if (key === 'fadeoutMode' || key === 'fadeoutTime') {
            this.fadeoutLastTime = Date.now();
        } else if (key === 'hueRotationSpeed') {
            if (value === 0) {
                this.settings.animatedHue = 0;
            }
        } else if (key === 'maxWidth' || key === 'maxHeight') {
            // Apply new size constraints immediately
            this.resize();
        }
    }

    /**
     * Pause the animation loop completely (0% CPU usage)
     */
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this._paused = true;
    }

    /**
     * Resume the animation loop after pause
     */
    resume() {
        if (this._paused && !this.animationId) {
            this._paused = false;
            this.animate();
        }
    }

    /**
     * Check if animation is paused
     * @returns {boolean}
     */
    isPaused() {
        return this._paused === true;
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
    }
}
