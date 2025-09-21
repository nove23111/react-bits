export const cosmicNexusCode = {
  jsx: `import { useEffect, useRef, useState, useCallback } from 'react';
import './ProfessionalLoader.css';

const ProfessionalLoader = ({ 
  className = '',
  type = 'skeleton',
  size = 'medium',
  color = '#3b82f6',
  speed = 1,
  lines = 3,
  showPercentage = true,
  progress = 0,
  text = 'Loading...',
  adaptive = true,
  theme = 'light',
  animated = true,
  rounded = true,
  glowing = false,
  variant = 'default',
  onComplete = null,
  autoProgress = false,
  duration = 3000
}) => {
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [isComplete, setIsComplete] = useState(false);
  const loaderRef = useRef(null);

  const getLoader = () => {
    switch (type) {
      case 'skeleton': return renderSkeleton();
      case 'progress': return renderProgress();
      case 'pulse': return renderPulse();
      case 'shimmer': return renderShimmer();
      case 'dots': return renderDots();
      case 'spinner': return renderSpinner();
      case 'wave': return renderWave();
      case 'bounce': return renderBounce();
      case 'gradient': return renderGradient();
      case 'ripple': return renderRipple();
      default: return renderSkeleton();
    }
  };

  return (
    <div 
      ref={loaderRef}
      className={\`pro-loader-wrapper \${className} \${size} \${theme} \${variant}\`}
      style={{
        '--primary-color': color,
        '--animation-duration': \`\${2 / speed}s\`
      }}
    >
      {getLoader()}
    </div>
  );
};

export default ProfessionalLoader;`,

  css: \`.pro-loader-wrapper {
  --primary-color: #3b82f6;
  --animation-duration: 2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.pro-loader.skeleton {
  width: 100%;
  max-width: 400px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, 
    rgba(156, 163, 175, 0.1) 25%, 
    rgba(156, 163, 175, 0.3) 50%, 
    rgba(156, 163, 175, 0.1) 75%
  );
  background-size: 200% 100%;
  margin-bottom: 12px;
  border-radius: 8px;
  animation: skeleton-shimmer var(--animation-duration) ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}\`
};
      
      // Energy pulsation
      float energyPulse = sin(time * 3.0 + phase) * energy * 0.3;
      pos.xyz *= (1.0 + energyPulse);
      
      // Dimensional rift effect
      float riftPhase = sin(time * 0.5 + length(pos.xz) * 0.02);
      pos.y += riftPhase * 15.0 * energy;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z) * cosmicScale;
      gl_Position = projectionMatrix * mvPosition;
    }
  \`;

  // Fragment shader for cosmic particles
  const fragmentShader = \`
    varying vec3 vColor;
    varying float vEnergy;
    varying float vPhase;
    
    uniform float time;
    uniform float glowIntensity;
    
    void main() {
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      
      // Create cosmic particle shape
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      
      // Energy core
      float core = 1.0 - smoothstep(0.0, 0.2, dist);
      
      // Pulsating glow
      float pulse = sin(time * 4.0 + vPhase) * 0.3 + 0.7;
      float glow = exp(-dist * 3.0) * glowIntensity * pulse;
      
      // Color mixing with energy
      vec3 finalColor = vColor * (1.0 + vEnergy * 2.0);
      finalColor += vec3(1.0, 0.8, 0.6) * core * 2.0;
      finalColor += vec3(0.3, 0.6, 1.0) * glow;
      
      gl_FragColor = vec4(finalColor, alpha * (0.6 + vEnergy * 0.4));
    }
  \`;

  // Nebula background shader
  const nebulaVertexShader = \`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`;

  const nebulaFragmentShader = \`
    uniform float time;
    uniform vec2 resolution;
    uniform float nebulaDensity;
    
    // Noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec2 p = uv * 4.0;
      
      // Animated nebula
      float n1 = fbm(p + time * 0.1);
      float n2 = fbm(p * 2.0 - time * 0.15);
      float n3 = fbm(p * 0.5 + time * 0.05);
      
      // Color mixing
      vec3 color1 = vec3(0.2, 0.1, 0.8) * n1;
      vec3 color2 = vec3(0.8, 0.2, 0.4) * n2;
      vec3 color3 = vec3(0.1, 0.6, 0.9) * n3;
      
      vec3 finalColor = (color1 + color2 + color3) * nebulaDensity * 0.3;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  \`;

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);
    camera.position.set(0, 0, 300);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = false;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Nebula background
    const nebulaGeometry = new THREE.PlaneGeometry(2, 2);
    const nebulaMaterial = new THREE.ShaderMaterial({
      vertexShader: nebulaVertexShader,
      fragmentShader: nebulaFragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
        nebulaDensity: { value: nebulaDensity }
      }
    });
    const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebulaMesh.position.z = -500;
    scene.add(nebulaMesh);

    // Particle system setup
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const energies = new Float32Array(particleCount);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spherical distribution with clustering
      const radius = Math.pow(Math.random(), 0.7) * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Dynamic colors based on position
      const hue = (Math.atan2(positions[i3 + 1], positions[i3]) + Math.PI) / (2 * Math.PI);
      const saturation = 0.7 + Math.random() * 0.3;
      const lightness = 0.5 + Math.random() * 0.5;
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 8 + 2;
      phases[i] = Math.random() * Math.PI * 2;
      energies[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('energy', new THREE.BufferAttribute(energies, 1));

    // Particle material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2() },
        mouseInfluence: { value: mouseInfluence },
        waveIntensity: { value: waveIntensity },
        glowIntensity: { value: glowIntensity },
        cosmicScale: { value: cosmicScale }
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });

    const particleSystem = new THREE.Points(geometry, material);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);

    // Energy rings
    const ringCount = 5;
    const rings = [];
    for (let i = 0; i < ringCount; i++) {
      const ringGeometry = new THREE.RingGeometry(50 + i * 30, 52 + i * 30, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / ringCount, 0.8, 0.5),
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      rings.push(ring);
      scene.add(ring);
    }

    // Mouse interaction
    const handleMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    mountRef.current.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      nebulaMaterial.uniforms.resolution.value.set(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // GSAP entrance animation
    gsap.timeline()
      .from(camera.position, {
        duration: 3,
        z: 1000,
        ease: 'power3.out'
      })
      .from(particleSystem.scale, {
        duration: 2,
        x: 0,
        y: 0,
        z: 0,
        ease: 'back.out(1.7)'
      }, '-=2')
      .to({}, {
        duration: 0.1,
        onComplete: () => setIsLoaded(true)
      });

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016;
      
      // Update uniforms
      material.uniforms.time.value = timeRef.current;
      material.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      nebulaMaterial.uniforms.time.value = timeRef.current;

      // Auto rotation
      if (autoRotate) {
        particleSystem.rotation.y += 0.002;
        particleSystem.rotation.x += 0.001;
      }

      // Ring animations
      rings.forEach((ring, index) => {
        ring.rotation.z += (index + 1) * 0.01;
        ring.material.opacity = 0.2 + Math.sin(timeRef.current * 2 + index) * 0.1;
      });

      // Color morphing
      if (colorSpeed > 0) {
        const colorArray = geometry.attributes.customColor.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const hue = (timeRef.current * colorSpeed * 0.1 + i * 0.01) % 1;
          const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
          colorArray[i3] = color.r;
          colorArray[i3 + 1] = color.g;
          colorArray[i3 + 2] = color.b;
        }
        geometry.attributes.customColor.needsUpdate = true;
      }

      // Physics simulation
      if (enablePhysics) {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const x = positions[i3];
          const y = positions[i3 + 1];
          const z = positions[i3 + 2];
          
          // Gravitational pull towards center
          const distance = Math.sqrt(x * x + y * y + z * z);
          const force = 0.01;
          positions[i3] -= (x / distance) * force;
          positions[i3 + 1] -= (y / distance) * force;
          positions[i3 + 2] -= (z / distance) * force;
        }
        geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      
      // Dispose of Three.js objects
      geometry.dispose();
      material.dispose();
      nebulaMaterial.dispose();
      nebulaGeometry.dispose();
      rings.forEach(ring => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
      renderer.dispose();
    };
  }, [
    particleCount,
    waveIntensity,
    colorSpeed,
    mouseInfluence,
    autoRotate,
    enablePhysics,
    glowIntensity,
    nebulaDensity,
    cosmicScale,
    interactionRadius,
    energyPulse,
    dimensionalRift
  ]);

  return (
    <div className={\`cosmic-nexus \${className}\`}>
      <div ref={mountRef} className="cosmic-nexus__canvas" />
      {!isLoaded && (
        <div className="cosmic-nexus__loading">
          <div className="cosmic-nexus__loading-text">
            Initializing Cosmic Nexus...
          </div>
          <div className="cosmic-nexus__loading-bar">
            <div className="cosmic-nexus__loading-progress" />
          </div>
        </div>
      )}
      <div className="cosmic-nexus__info">
        <div className="cosmic-nexus__stats">
          <div>Particles: {particleCount.toLocaleString()}</div>
          <div>Dimensions: ∞</div>
          <div>Energy Level: {Math.floor(Math.random() * 100)}%</div>
        </div>
      </div>
    </div>
  );
};

export default CosmicNexus;`,

  css: `.cosmic-nexus {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background: radial-gradient(ellipse at center, #0a0a2e 0%, #000000 100%);
  overflow: hidden;
  cursor: crosshair;
  font-family: 'Courier New', monospace;
}

.cosmic-nexus__canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.cosmic-nexus__canvas canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* Epic loading screen */
.cosmic-nexus__loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #000428, #004e92);
  z-index: 10;
  animation: cosmicPulse 2s ease-in-out infinite alternate;
}

@keyframes cosmicPulse {
  0% { background: linear-gradient(45deg, #000428, #004e92); }
  100% { background: linear-gradient(45deg, #004e92, #000428); }
}

.cosmic-nexus__loading-text {
  color: #00ffff;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 2rem;
  text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff;
  animation: textGlow 1.5s ease-in-out infinite alternate;
}

@keyframes textGlow {
  0% { 
    text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff;
    transform: scale(1);
  }
  100% { 
    text-shadow: 0 0 30px #ff00ff, 0 0 60px #ff00ff, 0 0 90px #ff00ff;
    transform: scale(1.05);
  }
}

.cosmic-nexus__loading-bar {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.cosmic-nexus__loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00, #00ffff);
  background-size: 200% 100%;
  border-radius: 2px;
  animation: loadingProgress 3s ease-in-out infinite, gradientShift 2s linear infinite;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
}

@keyframes loadingProgress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

/* Info panel */
.cosmic-nexus__info {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 5;
  pointer-events: none;
}

.cosmic-nexus__stats {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #00ffff;
  font-size: 0.9rem;
  font-family: 'Courier New', monospace;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  animation: statsGlow 3s ease-in-out infinite alternate;
}

@keyframes statsGlow {
  0% { 
    border-color: rgba(0, 255, 255, 0.3);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  }
  100% { 
    border-color: rgba(255, 0, 255, 0.5);
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.3);
  }
}

.cosmic-nexus__stats div {
  margin: 0.5rem 0;
  text-shadow: 0 0 10px currentColor;
}

.cosmic-nexus__stats div:first-child {
  color: #00ff00;
}

.cosmic-nexus__stats div:nth-child(2) {
  color: #ff00ff;
}

.cosmic-nexus__stats div:last-child {
  color: #ffff00;
}

/* Responsive design */
@media (max-width: 768px) {
  .cosmic-nexus {
    height: 100vh;
    min-height: 400px;
  }
  
  .cosmic-nexus__loading-text {
    font-size: 1.2rem;
    letter-spacing: 2px;
  }
  
  .cosmic-nexus__loading-bar {
    width: 250px;
  }
  
  .cosmic-nexus__info {
    top: 10px;
    left: 10px;
  }
  
  .cosmic-nexus__stats {
    padding: 0.8rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .cosmic-nexus__loading-text {
    font-size: 1rem;
    letter-spacing: 1px;
  }
  
  .cosmic-nexus__loading-bar {
    width: 200px;
  }
  
  .cosmic-nexus__stats {
    padding: 0.6rem;
    font-size: 0.7rem;
  }
}

/* Performance optimizations */
.cosmic-nexus * {
  will-change: transform;
}

.cosmic-nexus__canvas {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Epic hover effects */
.cosmic-nexus:hover .cosmic-nexus__stats {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .cosmic-nexus__loading,
  .cosmic-nexus__loading-text,
  .cosmic-nexus__loading-progress,
  .cosmic-nexus__stats {
    animation: none;
  }
  
  .cosmic-nexus__loading-text {
    text-shadow: 0 0 20px #00ffff;
  }
  
  .cosmic-nexus__stats {
    border-color: rgba(0, 255, 255, 0.5);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: light) {
  .cosmic-nexus {
    background: radial-gradient(ellipse at center, #e6e6fa 0%, #f0f8ff 100%);
  }
  
  .cosmic-nexus__stats {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    border-color: rgba(0, 0, 0, 0.2);
  }
}`
};
