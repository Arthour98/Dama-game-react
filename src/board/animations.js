// Animation durations
export const ANIMATION_DURATION = 300;
export const CAPTURE_ANIMATION_DURATION = 500;
export const CROWN_ANIMATION_DURATION = 800;

export class AnimationManager {
    constructor(ctx, SQUARE_SIZE) {
        this.ctx = ctx;
        this.SQUARE_SIZE = SQUARE_SIZE;
        this.animations = new Map();
    }

    // Animate piece movement
    animateMove(piece, startX, startY, endX, endY, onComplete) {
        const startTime = performance.now();
        const animationId = `${piece.id}-move`;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
            
            // Easing function for smooth movement
            const easeProgress = this.easeInOutQuad(progress);
            
            const currentX = startX + (endX - startX) * easeProgress;
            const currentY = startY + (endY - startY) * easeProgress;

            piece.x = currentX;
            piece.y = currentY;

            if (progress < 1) {
                this.animations.set(animationId, requestAnimationFrame(animate));
            } else {
                this.animations.delete(animationId);
                if (onComplete) onComplete();
            }
        };

        this.animations.set(animationId, requestAnimationFrame(animate));
    }

    // Animate piece capture
    animateCapture(piece, onComplete) {
        const startTime = performance.now();
        const animationId = `${piece.id}-capture`;
        const originalScale = 1;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / CAPTURE_ANIMATION_DURATION, 1);
            
            // Scale down and fade out
            const scale = originalScale * (1 - progress);
            const opacity = 1 - progress;

            piece.scale = scale;
            piece.opacity = opacity;

            if (progress < 1) {
                this.animations.set(animationId, requestAnimationFrame(animate));
            } else {
                this.animations.delete(animationId);
                if (onComplete) onComplete();
            }
        };

        this.animations.set(animationId, requestAnimationFrame(animate));
    }

    // Animate crown transformation
    animateCrown(piece, onComplete) {
        const startTime = performance.now();
        const animationId = `${piece.id}-crown`;
        const originalScale = 1;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / CROWN_ANIMATION_DURATION, 1);
            
            // Scale up and down with glow and spin effect
            const scaleProgress = Math.sin(progress * Math.PI);
            const scale = originalScale * (1 + 0.2 * scaleProgress);
            
            // Add a slight rotation during the animation
            const rotationProgress = progress * Math.PI;
            piece.rotation = rotationProgress;
            
            piece.scale = scale;
            piece.glowIntensity = scaleProgress;

            if (progress < 1) {
                this.animations.set(animationId, requestAnimationFrame(animate));
            } else {
                piece.scale = originalScale;
                piece.glowIntensity = 0;
                piece.rotation = 0;  // Reset rotation
                this.animations.delete(animationId);
                if (onComplete) onComplete();
            }
        };

        this.animations.set(animationId, requestAnimationFrame(animate));
    }

    // Clean up animations
    clearAnimations() {
        this.animations.forEach(animationId => {
            cancelAnimationFrame(animationId);
        });
        this.animations.clear();
    }

    // Easing function for smooth animation
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
}

// Draw functions for special effects
export const drawGlowEffect = (ctx, x, y, size, color, intensity) => {
    const radius = size / 2;
    const gradient = ctx.createRadialGradient(
        x + radius, y + radius, 0,
        x + radius, y + radius, radius * 1.5
    );
    
    gradient.addColorStop(0, `${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gradient;
    ctx.fillRect(x - size/4, y - size/4, size * 1.5, size * 1.5);
    ctx.restore();
};
