import "./GlassIcons.css";

const gradientMapping = {
  blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
  purple: "linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))",
  red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
  indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
  orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
  green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))",
};

const GlassIcons = ({ 
  items, 
  className, 
  onItemClick,
  enableRipple = true,
  enableHapticFeedback = true 
}) => {
  const getBackgroundStyle = (color) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  const handleClick = (item, index, event) => {
    if (enableHapticFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    if (enableRipple) {
      createRippleEffect(event.currentTarget, item.color);
    }
    
    if (onItemClick) {
      onItemClick(item, index);
    }
    
    if (item.onClick) {
      item.onClick(item, index);
    }
  };

  const createRippleEffect = (button, color) => {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      width: ${size}px;
      height: ${size}px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: ripple-effect 0.6s ease-out;
      pointer-events: none;
      z-index: 10;
    `;
    
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  };

  return (
    <>
      <style>{`
        @keyframes ripple-effect {
          to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
      <div className={`icon-btns ${className || ""}`}>
        {items.map((item, index) => (
          <button
            key={index}
            className={`icon-btn ${item.customClass || ""}`}
            aria-label={item.label}
            type="button"
            onClick={(e) => handleClick(item, index, e)}
            disabled={item.disabled}
          >
            <span
              className="icon-btn__back"
              style={getBackgroundStyle(item.color)}
            ></span>
            <span className="icon-btn__front">
              <span className="icon-btn__icon" aria-hidden="true">{item.icon}</span>
            </span>
            <span className="icon-btn__label">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default GlassIcons;
