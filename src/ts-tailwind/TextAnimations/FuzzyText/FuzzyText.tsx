"use client"

import React, { useEffect, useRef } from 'react';

interface FuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children,
  fontSize = 'clamp(2rem, 8vw, 8rem)',
  fontWeight = 900,
  fontFamily = 'inherit',
  color = '#fff',
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement & { cleanupFuzzyText?: () => void }>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match parent
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    setCanvasSize();

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const computedFontFamily =
        fontFamily === 'inherit' ? window.getComputedStyle(canvas).fontFamily || 'sans-serif' : fontFamily;

      const fontSizeStr = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
      let numericFontSize: number;
      if (typeof fontSize === 'number') {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement('span');
        temp.style.fontSize = fontSize;
        document.body.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        numericFontSize = parseFloat(computedSize);
        document.body.removeChild(temp);
      }

      // Convert children to array and handle <br />
      const childArray = React.Children.toArray(children);
      let lines: string[] = [];
      let currentLine = '';
      childArray.forEach(child => {
        if (typeof child === 'string') {
          currentLine += child;
        } else if (React.isValidElement(child) && child.type === 'br') {
          lines.push(currentLine);
          currentLine = '';
        } else if (typeof child === 'number') {
          currentLine += child.toString();
        }
      });
      if (currentLine) lines.push(currentLine);
      if (lines.length === 0) lines = [childArray.join('')];

      // Measure each line
      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = 'alphabetic';
      let maxWidth = 0;
      let totalHeight = 0;
      const lineMetrics = lines.map(line => {
        const metrics = offCtx.measureText(line);
        const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
        const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
        const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
        const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;
        const width = Math.ceil(actualLeft + actualRight);
        const height = Math.ceil(actualAscent + actualDescent);
        maxWidth = Math.max(maxWidth, width);
        totalHeight += height;
        return { line, width, height, actualLeft, actualAscent };
      });
      const extraWidthBuffer = 10;
      const offscreenWidth = maxWidth + extraWidthBuffer;
      offscreen.width = offscreenWidth;
      offscreen.height = totalHeight;
      // Draw each line
      let y = 0;
      lineMetrics.forEach(({ line, width, height, actualLeft, actualAscent }) => {
        offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
        offCtx.textBaseline = 'alphabetic';
        offCtx.fillStyle = color;
        offCtx.fillText(line, extraWidthBuffer / 2 - actualLeft, y + actualAscent);
        y += height;
      });

      // Center the text in the visible canvas
      const rect = canvas.getBoundingClientRect();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const xCenter = (canvasWidth - offscreenWidth) / 2;
      const yCenter = (canvasHeight - totalHeight) / 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.translate(xCenter, yCenter);

      const interactiveLeft = xCenter + extraWidthBuffer / 2;
      const interactiveTop = yCenter;
      const interactiveRight = interactiveLeft + maxWidth;
      const interactiveBottom = interactiveTop + totalHeight;

      let isHovering = false;
      const fuzzRange = 30;

      const run = () => {
        if (isCancelled) return;
        ctx.clearRect(-fuzzRange, -fuzzRange, canvasWidth + 2 * fuzzRange, canvasHeight + 2 * fuzzRange);
        const intensity = isHovering ? hoverIntensity : baseIntensity;
        let y = 0;
        lineMetrics.forEach(({ height }) => {
          for (let j = 0; j < height; j++) {
            const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
            ctx.drawImage(offscreen, 0, y + j, offscreenWidth, 1, dx, y + j, offscreenWidth, 1);
          }
          y += height;
        });
        animationFrameId = window.requestAnimationFrame(run);
      };

      run();

      const isInsideTextArea = (x: number, y: number) =>
        x >= interactiveLeft && x <= interactiveRight && y >= interactiveTop && y <= interactiveBottom;

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableHover) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      const handleMouseLeave = () => {
        isHovering = false;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!enableHover) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      const handleTouchEnd = () => {
        isHovering = false;
      };

      if (enableHover) {
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('touchmove', handleTouchMove, {
          passive: false
        });
        canvas.addEventListener('touchend', handleTouchEnd);
      }

      const cleanup = () => {
        window.cancelAnimationFrame(animationFrameId);
        if (enableHover) {
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('mouseleave', handleMouseLeave);
          canvas.removeEventListener('touchmove', handleTouchMove);
          canvas.removeEventListener('touchend', handleTouchEnd);
        }
      };

      canvas.cleanupFuzzyText = cleanup;
    };

    init();

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      if (canvas && canvas.cleanupFuzzyText) {
        canvas.cleanupFuzzyText();
      }
    };
  }, [children, fontSize, fontWeight, fontFamily, color, enableHover, baseIntensity, hoverIntensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};

export default FuzzyText;
