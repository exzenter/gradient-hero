/**
 * SVG Pattern Generator
 * Ported from the standalone gradient generator
 */
export class SVGPatternGenerator {
    constructor(container) {
        this.container = container;
        this.currentPattern = 'grid';
        this.size = 100;
        this.opacity = 0.15;
        this.strokeWidth = 1;
        this.enabled = true;
    }

    generatePattern(patternType, size = 100, color = '#ffffff', strokeWidth = 1) {
        const rgb = this.hexToRgb(color);
        const colorStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : color;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.setAttribute('id', 'heroGradientPattern');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.setAttribute('width', size);
        pattern.setAttribute('height', size);

        switch (patternType) {
            case 'grid':
                this.createGrid(pattern, size, colorStr, strokeWidth);
                break;
            case 'dots':
                this.createDots(pattern, size, colorStr);
                break;
            case 'lines-horizontal':
                this.createHorizontalLines(pattern, size, colorStr, strokeWidth);
                break;
            case 'lines-vertical':
                this.createVerticalLines(pattern, size, colorStr, strokeWidth);
                break;
            case 'diagonal':
                this.createDiagonal(pattern, size, colorStr, strokeWidth);
                break;
            case 'crosshatch':
                this.createCrosshatch(pattern, size, colorStr, strokeWidth);
                break;
            case 'hexagon':
                this.createHexagon(pattern, size, colorStr, strokeWidth);
                break;
            case 'circles':
                this.createCircles(pattern, size, colorStr, strokeWidth);
                break;
            case 'waves':
                this.createWaves(pattern, size, colorStr, strokeWidth);
                break;
            case 'mesh':
                this.createMesh(pattern, size, colorStr, strokeWidth);
                break;
            case 'noise':
                this.createNoise(pattern, size, colorStr);
                break;
            case 'circuit':
                this.createCircuit(pattern, size, colorStr, strokeWidth);
                break;
            case 'scanlines':
                this.createScanlines(pattern, size, colorStr, strokeWidth);
                break;
            case 'dots-grid':
                this.createDotsGrid(pattern, size, colorStr);
                break;
            case 'radial':
                this.createRadial(pattern, size, colorStr, strokeWidth);
                break;
            default:
                this.createGrid(pattern, size, colorStr, strokeWidth);
        }

        defs.appendChild(pattern);
        svg.appendChild(defs);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', 'url(#heroGradientPattern)');
        svg.appendChild(rect);

        return svg;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    }

    createGrid(pattern, size, color, strokeWidth = 1) {
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', '0');
        line1.setAttribute('y1', '0');
        line1.setAttribute('x2', size);
        line1.setAttribute('y2', '0');
        line1.setAttribute('stroke', color);
        line1.setAttribute('stroke-width', strokeWidth);

        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', '0');
        line2.setAttribute('y1', '0');
        line2.setAttribute('x2', '0');
        line2.setAttribute('y2', size);
        line2.setAttribute('stroke', color);
        line2.setAttribute('stroke-width', strokeWidth);

        pattern.appendChild(line1);
        pattern.appendChild(line2);
    }

    createDots(pattern, size, color) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', size / 2);
        circle.setAttribute('cy', size / 2);
        circle.setAttribute('r', size / 10);
        circle.setAttribute('fill', color);
        pattern.appendChild(circle);
    }

    createHorizontalLines(pattern, size, color, strokeWidth = 1) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', size / 2);
        line.setAttribute('x2', size);
        line.setAttribute('y2', size / 2);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', strokeWidth);
        pattern.appendChild(line);
    }

    createVerticalLines(pattern, size, color, strokeWidth = 1) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', size / 2);
        line.setAttribute('y1', '0');
        line.setAttribute('x2', size / 2);
        line.setAttribute('y2', size);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', strokeWidth);
        pattern.appendChild(line);
    }

    createDiagonal(pattern, size, color, strokeWidth = 1) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', size);
        line.setAttribute('x2', size);
        line.setAttribute('y2', '0');
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', strokeWidth);
        pattern.appendChild(line);
    }

    createCrosshatch(pattern, size, color, strokeWidth = 1) {
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', '0');
        line1.setAttribute('y1', size);
        line1.setAttribute('x2', size);
        line1.setAttribute('y2', '0');
        line1.setAttribute('stroke', color);
        line1.setAttribute('stroke-width', strokeWidth);

        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', '0');
        line2.setAttribute('y1', '0');
        line2.setAttribute('x2', size);
        line2.setAttribute('y2', size);
        line2.setAttribute('stroke', color);
        line2.setAttribute('stroke-width', strokeWidth);

        pattern.appendChild(line1);
        pattern.appendChild(line2);
    }

    createHexagon(pattern, size, color, strokeWidth = 1) {
        const w = size;
        const h = size * 0.866;
        pattern.setAttribute('height', h);

        const points = `${w * 0.25},0 ${w * 0.75},0 ${w},${h * 0.5} ${w * 0.75},${h} ${w * 0.25},${h} 0,${h * 0.5}`;
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points);
        polygon.setAttribute('fill', 'none');
        polygon.setAttribute('stroke', color);
        polygon.setAttribute('stroke-width', strokeWidth);
        pattern.appendChild(polygon);
    }

    createCircles(pattern, size, color, strokeWidth = 1) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', size / 2);
        circle.setAttribute('cy', size / 2);
        circle.setAttribute('r', size / 3);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', strokeWidth);
        pattern.appendChild(circle);
    }

    createWaves(pattern, size, color, strokeWidth = 1) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M0,${size / 2} Q${size / 4},0 ${size / 2},${size / 2} T${size},${size / 2}`;
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', strokeWidth);
        pattern.appendChild(path);
    }

    createMesh(pattern, size, color, strokeWidth = 1) {
        const third = size / 3;

        for (let i = 0; i <= 3; i++) {
            const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            hLine.setAttribute('x1', '0');
            hLine.setAttribute('y1', third * i);
            hLine.setAttribute('x2', size);
            hLine.setAttribute('y2', third * i);
            hLine.setAttribute('stroke', color);
            hLine.setAttribute('stroke-width', strokeWidth);
            pattern.appendChild(hLine);

            const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            vLine.setAttribute('x1', third * i);
            vLine.setAttribute('y1', '0');
            vLine.setAttribute('x2', third * i);
            vLine.setAttribute('y2', size);
            vLine.setAttribute('stroke', color);
            vLine.setAttribute('stroke-width', strokeWidth);
            pattern.appendChild(vLine);
        }
    }

    createNoise(pattern, size, color) {
        for (let i = 0; i < 20; i++) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', Math.random() * size);
            rect.setAttribute('y', Math.random() * size);
            rect.setAttribute('width', 2);
            rect.setAttribute('height', 2);
            rect.setAttribute('fill', color);
            rect.setAttribute('opacity', Math.random() * 0.5 + 0.25);
            pattern.appendChild(rect);
        }
    }

    createCircuit(pattern, size, color, strokeWidth = 1) {
        const half = size / 2;

        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', '0');
        line1.setAttribute('y1', half);
        line1.setAttribute('x2', half);
        line1.setAttribute('y2', half);
        line1.setAttribute('stroke', color);
        line1.setAttribute('stroke-width', strokeWidth);
        pattern.appendChild(line1);

        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', half);
        line2.setAttribute('y1', half);
        line2.setAttribute('x2', half);
        line2.setAttribute('y2', '0');
        line2.setAttribute('stroke', color);
        line2.setAttribute('stroke-width', strokeWidth);
        pattern.appendChild(line2);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', half);
        circle.setAttribute('cy', half);
        circle.setAttribute('r', size / 10);
        circle.setAttribute('fill', color);
        pattern.appendChild(circle);

        const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line3.setAttribute('x1', half);
        line3.setAttribute('y1', half);
        line3.setAttribute('x2', size);
        line3.setAttribute('y2', half);
        line3.setAttribute('stroke', color);
        line3.setAttribute('stroke-width', strokeWidth);
        pattern.appendChild(line3);
    }

    createScanlines(pattern, size, color, strokeWidth = 1) {
        const gap = size / 4;

        for (let i = 0; i < 4; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', gap * i + gap / 2);
            line.setAttribute('x2', size);
            line.setAttribute('y2', gap * i + gap / 2);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', strokeWidth);
            pattern.appendChild(line);
        }
    }

    createDotsGrid(pattern, size, color) {
        const gap = size / 4;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', gap * i + gap / 2);
                circle.setAttribute('cy', gap * j + gap / 2);
                circle.setAttribute('r', size / 20);
                circle.setAttribute('fill', color);
                pattern.appendChild(circle);
            }
        }
    }

    createRadial(pattern, size, color, strokeWidth = 1) {
        const center = size / 2;

        for (let i = 1; i <= 3; i++) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', center);
            circle.setAttribute('cy', center);
            circle.setAttribute('r', (size / 6) * i);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', color);
            circle.setAttribute('stroke-width', strokeWidth);
            pattern.appendChild(circle);
        }
    }

    updatePattern(patternType, size, opacity, color = '#ffffff', blendMode = 'normal', strokeWidth = 1) {
        if (!this.container || !this.enabled) return;

        this.currentPattern = patternType;
        this.size = size;
        this.opacity = opacity / 100;
        this.strokeWidth = strokeWidth;

        this.container.innerHTML = '';
        const svg = this.generatePattern(patternType, size, color, strokeWidth);

        this.container.style.opacity = this.opacity;
        this.container.style.mixBlendMode = blendMode;

        this.container.appendChild(svg);
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (this.container) {
            this.container.style.display = enabled ? 'block' : 'none';
        }
    }

    refresh() {
        if (this.enabled && this.container) {
            this.updatePattern(this.currentPattern, this.size, this.opacity * 100);
        }
    }
}
