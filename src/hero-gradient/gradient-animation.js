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
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 800, height: 600 };
        const width = rect.width || 800;
        const height = rect.height || 600;

        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }

    createGradients() {
        this.gradients = [];
        const count = this.settings.gradientCount;

        const baseRadiusMultiplier = this.settings.gradientSizeMode === 'base' ? this.settings.gradientSizeMultiplier : 1.0;

        for (let i = 0; i < count; i++) {
            this.gradients.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: (200 + Math.random() * 400) * baseRadiusMultiplier,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: this.generateColor(i),
                opacity: 0.3 + Math.random() * 0.4,
                phase: Math.random() * Math.PI * 2,
                baseIndex: i,
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

    updateGradients() {
        const dpr = window.devicePixelRatio || 1;
        const width = this.canvas.width / dpr;
        const height = this.canvas.height / dpr;

        const centerX = width * this.settings.positionX;
        const centerY = height * this.settings.positionY;

        this.gradients.forEach((gradient, i) => {
            const baseX = centerX + Math.sin(this.time * this.settings.gradientSpeed + gradient.phase) * width * 0.1;
            const baseY = centerY + Math.cos(this.time * this.settings.gradientSpeed + gradient.phase * 1.3) * height * 0.15;

            gradient.x = baseX;
            gradient.y = baseY;

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
        const dpr = window.devicePixelRatio || 1;
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
        this.settings[key] = value;
        if (key === 'gradientCount') {
            this.createGradients();
        } else if (key === 'colorMode' || key === 'paletteColors') {
            this.createGradients();
        } else if (key === 'hueSeparation' || key === 'evenlySpacedColors') {
            this.createGradients();
        } else if (key === 'gradientSizeMultiplier' || key === 'gradientSizeMode') {
            if (key === 'gradientSizeMode' || (key === 'gradientSizeMultiplier' && this.settings.gradientSizeMode === 'base')) {
                this.createGradients();
            }
        } else if (key === 'fadeoutMode' || key === 'fadeoutTime') {
            this.fadeoutLastTime = Date.now();
        } else if (key === 'hueRotationSpeed') {
            if (value === 0) {
                this.settings.animatedHue = 0;
            }
        }
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
