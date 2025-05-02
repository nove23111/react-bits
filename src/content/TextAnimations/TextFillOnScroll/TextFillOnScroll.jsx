import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TextFillOnScroll = ({
  text = "Scroll to Fill",
  fillColor = "#ffffffeb",
  borderColor = "#ffffffeb",
  borderWidth = 1,
  backgroundColor = "#060606",
  textSize = "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
  fontFamily = "DM Sans, sans-serif",
  showProgress = true,
  className = "",
  style = {},
  ...props
}) => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const maskRef = useRef(null);
  const [fillProgress, setFillProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sectionElement = sectionRef.current;
    const textElement = textRef.current;
    const maskElement = maskRef.current;

    if (!sectionElement || !textElement || !maskElement) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionElement,
      start: "top top",
      end: "bottom top",
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        setFillProgress(progress);
        gsap.to(maskElement, {
          clipPath: `polygon(0% 0%, ${progress * 100}% 0%, ${
            progress * 100
          }% 100%, 0% 100%)`,
          duration: 0.1,
          overwrite: true,
        });
      },
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      scrollTrigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${className}`}
      style={{ backgroundColor, ...style }}
      {...props}
    >
      <div className="relative text-left max-w-full px-4">
        <div className="relative">
          {/* Outline text (bottom layer) */}
          <h1
            ref={textRef}
            className={`font-bold break-words z-10 ${textSize}`}
            style={{
              color: "transparent",
              WebkitTextStroke: `${borderWidth}px ${borderColor}`,
              textStroke: `${borderWidth}px ${borderColor}`,
              fontFamily,
            }}
          >
            {text}
          </h1>
          {/* Filled text (top layer with mask) */}
          <h1
            ref={maskRef}
            className={`font-bold  absolute top-0 left-0 z-20 break-words ${textSize}`}
            style={{
              color: fillColor,
              clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
              fontFamily,
            }}
          >
            {text}
          </h1>
        </div>
      </div>
      {showProgress && (
        <div className="absolute bottom-4 left-4 text-sm text-gray-500">
          Scroll progress: {Math.round(fillProgress * 100)}%
        </div>
      )}
      {/* User instruction */}
      <div className="absolute bottom-10 left-0 right-0 text-center text-gray-300 opacity-50 font-medium">
        Scroll down to see the text fill effect
      </div>
    </section>
  );
};

export default TextFillOnScroll;
