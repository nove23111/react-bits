import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface TrueFocusProps {
    sentence?: string;
    manualMode?: boolean;
    blurAmount?: number;
    borderColor?: string;
    glowColor?: string;
    animationDuration?: number;
    pauseBetweenAnimations?: number;
    enableSoundEffects?: boolean;
    soundVolume?: number;
    onWordFocus?: (word: string, index: number) => void;
    customFocusIndicator?: 'corners' | 'underline' | 'highlight' | 'glow';
    enableTypewriter?: boolean;
}

interface FocusRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
    sentence = "True Focus",
    manualMode = false,
    blurAmount = 5,
    borderColor = "green",
    glowColor = "rgba(0, 255, 0, 0.6)",
    animationDuration = 0.5,
    pauseBetweenAnimations = 1,
    enableSoundEffects = false,
    soundVolume = 0.3,
    onWordFocus,
    customFocusIndicator = 'corners',
    enableTypewriter = false,
}) => {
    const words = sentence.split(" ");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
    const [typewriterText, setTypewriterText] = useState<string>("");
    const containerRef = useRef<HTMLDivElement | null>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });
    const audioContextRef = useRef<AudioContext | null>(null);

    const playFocusSound = () => {
        if (!enableSoundEffects) return;
        
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            
            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(soundVolume, ctx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (error) {
            console.warn('Audio not supported:', error);
        }
    };

    const updateTypewriter = (targetWord: string) => {
        if (!enableTypewriter) return;
        
        let currentText = "";
        let charIndex = 0;
        
        const typeInterval = setInterval(() => {
            if (charIndex < targetWord.length) {
                currentText += targetWord[charIndex];
                setTypewriterText(currentText);
                charIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    };

    useEffect(() => {
        if (!manualMode) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % words.length);
            }, (animationDuration + pauseBetweenAnimations) * 1000);

            return () => clearInterval(interval);
        }
    }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

    useEffect(() => {
        if (currentIndex === null || currentIndex === -1) return;
        if (!wordRefs.current[currentIndex] || !containerRef.current) return;

        const parentRect = containerRef.current.getBoundingClientRect();
        const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

        setFocusRect({
            x: activeRect.left - parentRect.left,
            y: activeRect.top - parentRect.top,
            width: activeRect.width,
            height: activeRect.height,
        });

        playFocusSound();
        
        if (onWordFocus) {
            onWordFocus(words[currentIndex], currentIndex);
        }
        
        if (enableTypewriter) {
            updateTypewriter(words[currentIndex]);
        }
    }, [currentIndex, words.length]);

    const handleMouseEnter = (index: number) => {
        if (manualMode) {
            setLastActiveIndex(index);
            setCurrentIndex(index);
        }
    };

    const handleMouseLeave = () => {
        if (manualMode) {
            setCurrentIndex(lastActiveIndex!);
        }
    };

    return (
        <div
            className="relative flex gap-4 justify-center items-center flex-wrap"
            ref={containerRef}
        >
            {words.map((word, index) => {
                const isActive = index === currentIndex;
                return (
                    <span
                        key={index}
                        ref={(el) => { wordRefs.current[index] = el; }}
                        className="relative text-[3rem] font-black cursor-pointer"
                        style={{
                            filter: manualMode
                                ? isActive
                                    ? `blur(0px)`
                                    : `blur(${blurAmount}px)`
                                : isActive
                                    ? `blur(0px)`
                                    : `blur(${blurAmount}px)`,
                            transition: `filter ${animationDuration}s ease`,
                        } as React.CSSProperties}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {word}
                    </span>
                );
            })}

            <motion.div
                className="absolute top-0 left-0 pointer-events-none box-border border-0"
                animate={{
                    x: focusRect.x,
                    y: focusRect.y,
                    width: focusRect.width,
                    height: focusRect.height,
                    opacity: currentIndex >= 0 ? 1 : 0,
                }}
                transition={{
                    duration: animationDuration,
                }}
                style={{
                    "--border-color": borderColor,
                    "--glow-color": glowColor,
                } as React.CSSProperties}
            >
                <span
                    className="absolute w-3 h-3 sm:w-4 sm:h-4 border-2 sm:border-[3px] rounded-[2px] sm:rounded-[3px] top-[-8px] sm:top-[-10px] left-[-8px] sm:left-[-10px] border-r-0 border-b-0"
                    style={{
                        borderColor: "var(--border-color)",
                        filter: "drop-shadow(0 0 4px var(--border-color))",
                    }}
                ></span>
                <span
                    className="absolute w-3 h-3 sm:w-4 sm:h-4 border-2 sm:border-[3px] rounded-[2px] sm:rounded-[3px] top-[-8px] sm:top-[-10px] right-[-8px] sm:right-[-10px] border-l-0 border-b-0"
                    style={{
                        borderColor: "var(--border-color)",
                        filter: "drop-shadow(0 0 4px var(--border-color))",
                    }}
                ></span>
                <span
                    className="absolute w-3 h-3 sm:w-4 sm:h-4 border-2 sm:border-[3px] rounded-[2px] sm:rounded-[3px] bottom-[-8px] sm:bottom-[-10px] left-[-8px] sm:left-[-10px] border-r-0 border-t-0"
                    style={{
                        borderColor: "var(--border-color)",
                        filter: "drop-shadow(0 0 4px var(--border-color))",
                    }}
                ></span>
                <span
                    className="absolute w-3 h-3 sm:w-4 sm:h-4 border-2 sm:border-[3px] rounded-[2px] sm:rounded-[3px] bottom-[-8px] sm:bottom-[-10px] right-[-8px] sm:right-[-10px] border-l-0 border-t-0"
                    style={{
                        borderColor: "var(--border-color)",
                        filter: "drop-shadow(0 0 4px var(--border-color))",
                    }}
                ></span>
            </motion.div>
        </div>
    );
};

export default TrueFocus;