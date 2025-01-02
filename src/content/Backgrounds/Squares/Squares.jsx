import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const defaultLightColors = {
    borderColor: '#E8E8E8',
    hoverFillColor: '#D8D8D8',
    backgroundColor: '#fff',
    backgroundOpacity: 0,
    gradientStartColor: '#F8F8F8',
    gradientEndColor: '#fff',
};

const defaultDarkColors = {
    borderColor: '#333333',
    hoverFillColor: '#404040',
    backgroundColor: '#111111',
    backgroundOpacity: 0,
    gradientStartColor: '#1A1A1A',
    gradientEndColor: '#111111',
};

const Squares = ({
    direction = 'right',
    speed = 1,
    lightMode = defaultLightColors,
    darkMode = defaultDarkColors,
    gradientStartOpacity = 0,
    gradientEndOpacity = 1,
    borderWidth = 1,
    squareSize = 50,
    blur,
}) => {
    const { theme } = useTheme();
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const numSquaresX = useRef(10);
    const numSquaresY = useRef(10);
    const gridOffset = useRef({ x: 0, y: 0 });
    const [hoveredSquare, setHoveredSquare] = useState(null);

    const themeColors = theme === 'dark' ? { ...defaultDarkColors, ...darkMode } : { ...defaultLightColors, ...lightMode };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
            numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Helper function to convert hex to rgb
        const hexToRgb = (hex) => {
            // Remove the hash if present
            hex = hex.replace('#', '');

            // Handle both short and long hex
            const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
            const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
            const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);

            return `${r}, ${g}, ${b}`;
        };

        const drawGrid = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Set background color with opacity
            if (themeColors.backgroundOpacity && themeColors.backgroundOpacity > 0) {
                ctx.fillStyle = `rgba(${hexToRgb(themeColors.backgroundColor)}, ${themeColors.backgroundOpacity})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Set line width for borders
            ctx.lineWidth = borderWidth;

            for (let x = 0; x < numSquaresX.current; x++) {
                for (let y = 0; y < numSquaresY.current; y++) {
                    const squareX = (x * squareSize) + (gridOffset.current.x % squareSize);
                    const squareY = (y * squareSize) + (gridOffset.current.y % squareSize);

                    if (hoveredSquare && hoveredSquare.x === x && hoveredSquare.y === y) {
                        ctx.fillStyle = themeColors.hoverFillColor;
                        ctx.fillRect(squareX, squareY, squareSize, squareSize);
                    }

                    ctx.strokeStyle = themeColors.borderColor;
                    ctx.strokeRect(squareX, squareY, squareSize, squareSize);
                }
            }

            const gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2
            );

            gradient.addColorStop(0, `rgba(${hexToRgb(themeColors.gradientStartColor)}, ${gradientStartOpacity})`);
            gradient.addColorStop(1, `rgba(${hexToRgb(themeColors.gradientEndColor)}, ${gradientEndOpacity})`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        const updateAnimation = () => {
            switch (direction) {
                case 'right':
                    gridOffset.current.x -= speed;
                    break;
                case 'left':
                    gridOffset.current.x += speed;
                    break;
                case 'down':
                    gridOffset.current.y += speed;
                    break;
                case 'up':
                    gridOffset.current.y -= speed;
                    break;
                case 'diagonal':
                    gridOffset.current.x -= speed;
                    gridOffset.current.y -= speed;
                    break;
                default:
                    break;
            }

            if (Math.abs(gridOffset.current.x) > squareSize) gridOffset.current.x = 0;
            if (Math.abs(gridOffset.current.y) > squareSize) gridOffset.current.y = 0;

            drawGrid();
            requestRef.current = requestAnimationFrame(updateAnimation);
        };

        const handleMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const hoveredSquareX = Math.floor(
                (mouseX - (gridOffset.current.x % squareSize)) / squareSize
            );
            const hoveredSquareY = Math.floor(
                (mouseY - (gridOffset.current.y % squareSize)) / squareSize
            );

            setHoveredSquare({ x: hoveredSquareX, y: hoveredSquareY });
        };

        const handleMouseLeave = () => {
            setHoveredSquare(null);
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        requestRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [direction, speed, themeColors, gradientStartOpacity, gradientEndOpacity, borderWidth, squareSize, hoveredSquare, theme]);

    return (
        <div className="w-full h-full absolute top-0 left-0 z-0" style={{ backdropFilter: blur ? `blur(${blur}px)` : undefined }}>
            <canvas ref={canvasRef} className="w-full h-full border-none block"></canvas>
        </div>
    );
};

export default Squares; 
