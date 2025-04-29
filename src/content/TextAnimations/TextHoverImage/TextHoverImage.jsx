import React, { useState } from "react";

const TextHoverImage = ({
  content = "Hover Here",         // text from props
  image = "https://i.pinimg.com/originals/cb/b7/5e/cbb75ec8b3ca1822ad385f59f5fefc86.gif",          // image from props
  offsetX = 580,
  offsetY = 480,
}) => {
  const [hover, setHover] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="h-screen w-full bg-black text-white flex items-center justify-center text-9xl tracking-tight">
      <div
        className="relative inline-block p-2 cursor-none"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleMouseMove}
      >
        {content}

        <img
          src={image}
          alt="Hover Preview"
          className={`absolute rounded-full w-48 h-48 pointer-events-none transition-all duration-300 ease-linear mix-blend-difference ${
            hover ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{
            transform: `translate(${mousePosition.x - offsetX}px, ${mousePosition.y - offsetY}px)`,
          }}
        />
      </div>
    </div>
  );
};

export default TextHoverImage;
