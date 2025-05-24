import { useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

import "./CircularText.css";

const getRotationTransition = (duration, from, loop = true) => ({
  from: from,
  to: from + 360,
  ease: "linear",
  duration: duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration, from) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
});

const CircularText = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotate = useMotionValue(0);

  useEffect(() => {
    const current = rotate.get();
    controls.start({
      rotate: [current, current + 360],
      scale: 1,
      transition: getTransition(spinDuration, current),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinDuration, controls, onHover, text, rotate]);

  const handleHoverStart = () => {
    const current = rotate.get();
    switch (onHover) {
      case "slowDown":
        controls.start({
          rotate: [current, current + 360],
          scale: 1,
          transition: getTransition(spinDuration * 2, current),
        });
        break;
      case "speedUp":
        controls.start({
          rotate: [current, current + 360],
          scale: 1,
          transition: getTransition(spinDuration / 4, current),
        });
        break;
      case "pause":
        controls.start({
          rotate: current,
          scale: 1,
          transition: {
            rotate: { type: "spring", damping: 20, stiffness: 300 },
            scale: { type: "spring", damping: 20, stiffness: 300 },
          },
        });
        break;
      case "goBonkers":
        controls.start({
          rotate: [current, current + 360],
          scale: 0.8,
          transition: getTransition(spinDuration / 20, current),
        });
        break;
      default:
        break;
    }
  };

  const handleHoverEnd = () => {
    const current = rotate.get();
    controls.start({
      rotate: [current, current + 360],
      scale: 1,
      transition: getTransition(spinDuration, current),
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      style={{ rotate }}
    >
      {letters.map((letter, i) => {
        const rotation = (360 / letters.length) * i;
        const factor = Number((Math.PI / letters.length).toFixed(0));
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotation}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span key={i} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
