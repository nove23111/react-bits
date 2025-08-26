import React, { useRef, useEffect } from "react";

interface LightningProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
  // New props
  enableBranching?: boolean;
  branchingIntensity?: number;
  enablePulse?: boolean;
  pulseSpeed?: number;
  enableColorShift?: boolean;
  colorShiftSpeed?: number;
  enableInteractivity?: boolean;
  onLightningStrike?: () => void;
  enableSoundReactive?: boolean;
  audioFrequencyData?: Uint8Array;
  className?: string;
}

const Lightning: React.FC<LightningProps> = ({
  hue = 230,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
  // idea
  enableBranching = false,
  branchingIntensity = 0.5,
  enablePulse = false,
  pulseSpeed = 2.0,
  enableColorShift = false,
  colorShiftSpeed = 0.5,
  enableInteractivity = false,
  onLightningStrike = null,
  enableSoundReactive = false,
  audioFrequencyData = null,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastStrikeTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      uniform bool uEnableBranching;
      uniform float uBranchingIntensity;
      uniform bool uEnablePulse;
      uniform float uPulseSpeed;
      uniform bool uEnableColorShift;
      uniform float uColorShiftSpeed;
      uniform vec2 uMousePosition;
      uniform bool uEnableInteractivity;
      uniform float uAudioIntensity;
      
      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          
          // Interactive mouse influence
          if (uEnableInteractivity) {
              vec2 mouseUv = (uMousePosition / iResolution.xy) * 2.0 - 1.0;
              mouseUv.x *= iResolution.x / iResolution.y;
              float mouseDist = length(uv - mouseUv);
              uv += (uv - mouseUv) * 0.1 * exp(-mouseDist * 2.0);
          }
          
          float baseSize = uSize;
          float baseIntensity = uIntensity;
          
          // Pulse effect
          if (uEnablePulse) {
              float pulse = 0.5 + 0.5 * sin(iTime * uPulseSpeed);
              baseIntensity *= (0.7 + 0.6 * pulse);
              baseSize *= (0.8 + 0.4 * pulse);
          }
          
          // Audio reactive
          if (uAudioIntensity > 0.0) {
              baseIntensity *= (1.0 + uAudioIntensity * 2.0);
              baseSize *= (1.0 + uAudioIntensity * 0.5);
          }
          
          vec2 noiseUv = uv * baseSize + 0.8 * iTime * uSpeed;
          
          // Branching effect
          if (uEnableBranching) {
              float branchNoise = fbm(noiseUv * 2.0 + vec2(iTime * 0.3, 0.0));
              noiseUv += branchNoise * uBranchingIntensity * 0.5;
          }
          
          uv += 2.0 * fbm(noiseUv) - 1.0;
          
          float dist = abs(uv.x);
          
          // Color shifting
          float currentHue = uHue;
          if (uEnableColorShift) {
              currentHue += sin(iTime * uColorShiftSpeed) * 60.0;
          }
          
          vec3 baseColor = hsv2rgb(vec3(currentHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * baseIntensity;
          
          // Additional branching glow
          if (uEnableBranching) {
              float branchGlow = exp(-dist * 20.0) * uBranchingIntensity;
              col += baseColor * branchGlow * 0.3;
          }
          
          col = pow(col, vec3(1.0));
          fragColor = vec4(col, 1.0);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const compileShader = (
      source: string,
      type: number
    ): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const uHueLocation = gl.getUniformLocation(program, "uHue");
    const uXOffsetLocation = gl.getUniformLocation(program, "uXOffset");
    const uSpeedLocation = gl.getUniformLocation(program, "uSpeed");
    const uIntensityLocation = gl.getUniformLocation(program, "uIntensity");
    const uSizeLocation = gl.getUniformLocation(program, "uSize");
    const uEnableBranchingLocation = gl.getUniformLocation(program, "uEnableBranching");
    const uBranchingIntensityLocation = gl.getUniformLocation(program, "uBranchingIntensity");
    const uEnablePulseLocation = gl.getUniformLocation(program, "uEnablePulse");
    const uPulseSpeedLocation = gl.getUniformLocation(program, "uPulseSpeed");
    const uEnableColorShiftLocation = gl.getUniformLocation(program, "uEnableColorShift");
    const uColorShiftSpeedLocation = gl.getUniformLocation(program, "uColorShiftSpeed");
    const uMousePositionLocation = gl.getUniformLocation(program, "uMousePosition");
    const uEnableInteractivityLocation = gl.getUniformLocation(program, "uEnableInteractivity");
    const uAudioIntensityLocation = gl.getUniformLocation(program, "uAudioIntensity");

    // Mouse interaction handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!enableInteractivity) return;
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleClick = () => {
      if (!enableInteractivity || !onLightningStrike) return;
      const currentTime = performance.now();
      if (currentTime - lastStrikeTimeRef.current > 500) { // Throttle strikes
        onLightningStrike();
        lastStrikeTimeRef.current = currentTime;
      }
    };

    if (enableInteractivity) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);
    }

    const startTime = performance.now();
    let animationId: number;
    const render = () => {
      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      const currentTime = performance.now();
      gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0);
      gl.uniform1f(uHueLocation, hue);
      gl.uniform1f(uXOffsetLocation, xOffset);
      gl.uniform1f(uSpeedLocation, speed);
      gl.uniform1f(uIntensityLocation, intensity);
      gl.uniform1f(uSizeLocation, size);
      
      // New uniforms
      gl.uniform1i(uEnableBranchingLocation, enableBranching ? 1 : 0);
      gl.uniform1f(uBranchingIntensityLocation, branchingIntensity);
      gl.uniform1i(uEnablePulseLocation, enablePulse ? 1 : 0);
      gl.uniform1f(uPulseSpeedLocation, pulseSpeed);
      gl.uniform1i(uEnableColorShiftLocation, enableColorShift ? 1 : 0);
      gl.uniform1f(uColorShiftSpeedLocation, colorShiftSpeed);
      gl.uniform2f(uMousePositionLocation, mousePositionRef.current.x, mousePositionRef.current.y);
      gl.uniform1i(uEnableInteractivityLocation, enableInteractivity ? 1 : 0);
      
      // Audio reactive
      let audioIntensity = 0;
      if (enableSoundReactive && audioFrequencyData) {
        const avgFrequency = Array.from(audioFrequencyData).reduce((a, b) => a + b, 0) / audioFrequencyData.length;
        audioIntensity = avgFrequency / 255;
      }
      gl.uniform1f(uAudioIntensityLocation, audioIntensity);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (enableInteractivity) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [hue, xOffset, speed, intensity, size, enableBranching, branchingIntensity, enablePulse, pulseSpeed, enableColorShift, colorShiftSpeed, enableInteractivity, enableSoundReactive]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full relative ${enableInteractivity ? 'cursor-pointer' : ''} ${className}`}
      role="img"
      aria-label="Interactive lightning background"
    />
  );
};

export default Lightning;
