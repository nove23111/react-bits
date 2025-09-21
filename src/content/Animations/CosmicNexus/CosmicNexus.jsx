import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import './CosmicNexus.css';

// Neural Network Brain Simulation
const NeuralBrain = ({
  className = '',
  neuronCount = 150,
  connectionDensity = 0.3,
  learningRate = 0.02,
  synapseStrength = 1.0,
  thoughtSpeed = 2.0,
  brainActivity = 0.8,
  memoryFormation = true,
  consciousnessLevel = 0.7,
  neuralPlasticity = true,
  dreamMode = false,
  cognitiveLoad = 0.5
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const neuralNetworkRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const animationIdRef = useRef(null);
  const neuronsRef = useRef([]);
  const connectionsRef = useRef([]);
  const thoughtsRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Neuron vertex shader - simulates electrical activity
  const neuronVertexShader = `
    attribute float activation;
    attribute float neuronType;
    attribute float connectionStrength;
    attribute float memoryTrace;
    
    varying float vActivation;
    varying float vNeuronType;
    varying float vConnectionStrength;
    varying float vMemoryTrace;
    varying vec3 vPosition;
    
    uniform float time;
    uniform vec2 mouse;
    uniform float brainActivity;
    uniform float consciousnessLevel;
    uniform float cognitiveLoad;
    
    void main() {
      vActivation = activation;
      vNeuronType = neuronType;
      vConnectionStrength = connectionStrength;
      vMemoryTrace = memoryTrace;
      vPosition = position;
      
      vec3 pos = position;
      
      // Neural oscillations - different frequencies for different neuron types
      float alpha = sin(time * 8.0 + pos.x * 0.1) * 0.3; // Alpha waves
      float beta = sin(time * 15.0 + pos.y * 0.1) * 0.2;  // Beta waves
      float gamma = sin(time * 40.0 + pos.z * 0.1) * 0.1; // Gamma waves
      
      float brainWave = alpha + beta + gamma;
      pos += normalize(pos) * brainWave * activation * brainActivity;
      
      // Consciousness field effect
      float consciousness = consciousnessLevel * sin(time * 2.0 + length(pos) * 0.05);
      pos.y += consciousness * 5.0 * activation;
      
      // Mouse represents attention/focus
      vec2 attention = mouse * 2.0 - 1.0;
      float attentionDistance = distance(pos.xy, attention * 100.0);
      float focusEffect = exp(-attentionDistance * 0.02) * cognitiveLoad;
      pos.xyz += normalize(pos.xyz - vec3(attention * 50.0, 0.0)) * focusEffect * 15.0;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      float size = 3.0 + activation * 8.0 + memoryTrace * 5.0;
      gl_PointSize = size * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Neuron fragment shader - simulates synaptic activity
  const neuronFragmentShader = `
    varying float vActivation;
    varying float vNeuronType;
    varying float vConnectionStrength;
    varying float vMemoryTrace;
    varying vec3 vPosition;
    
    uniform float time;
    uniform float synapseStrength;
    uniform float learningRate;
    
    void main() {
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      
      // Neuron body with electrical activity
      float neuronBody = 1.0 - smoothstep(0.0, 0.4, dist);
      
      // Synaptic firing pattern
      float synapticFire = sin(time * 10.0 + vPosition.x * 0.5) * vActivation;
      float fireIntensity = max(0.0, synapticFire) * synapseStrength;
      
      // Different colors for different neuron types
      vec3 neuronColor;
      if (vNeuronType < 0.33) {
        // Sensory neurons - blue to cyan
        neuronColor = mix(vec3(0.0, 0.5, 1.0), vec3(0.0, 1.0, 1.0), vActivation);
      } else if (vNeuronType < 0.66) {
        // Motor neurons - red to orange
        neuronColor = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.8, 0.0), vActivation);
      } else {
        // Interneurons - purple to pink
        neuronColor = mix(vec3(0.8, 0.0, 1.0), vec3(1.0, 0.4, 0.8), vActivation);
      }
      
      // Memory traces - golden glow
      vec3 memoryGlow = vec3(1.0, 0.9, 0.3) * vMemoryTrace * 0.5;
      
      // Electrical activity - white core when firing
      vec3 electricalCore = vec3(1.0) * fireIntensity * (1.0 - smoothstep(0.0, 0.15, dist));
      
      vec3 finalColor = neuronColor + memoryGlow + electricalCore;
      float alpha = neuronBody * (0.7 + vActivation * 0.3 + fireIntensity * 0.5);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  // Nebula background shader
  const nebulaVertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Brain tissue background shader - simulates neural field
  const brainTissueFragmentShader = `
    uniform float time;
    uniform vec2 resolution;
    uniform float brainActivity;
    uniform float consciousnessLevel;
    
    // Advanced noise functions for neural patterns
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for(int i = 0; i < 8; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec2 p = uv * 6.0;
      
      // Neural field patterns
      float neural1 = fbm(p + time * 0.05 + vec2(sin(time * 0.1), cos(time * 0.1)));
      float neural2 = fbm(p * 1.5 - time * 0.03 + vec2(cos(time * 0.15), sin(time * 0.12)));
      float neural3 = fbm(p * 0.8 + time * 0.08 + vec2(sin(time * 0.08), cos(time * 0.09)));
      
      // Brain wave interference patterns
      float brainWaves = sin(p.x * 2.0 + time * 3.0) * cos(p.y * 1.5 + time * 2.0) * 0.3;
      
      // Consciousness field - creates coherent patterns
      float consciousness = consciousnessLevel * sin(length(p - vec2(3.0)) * 0.5 + time * 1.5) * 0.4;
      
      // Neural tissue colors - deep brain tones
      vec3 deepBrain = vec3(0.05, 0.02, 0.15) * neural1;
      vec3 cortex = vec3(0.1, 0.05, 0.2) * neural2;
      vec3 synapses = vec3(0.15, 0.1, 0.25) * neural3;
      
      // Electrical activity overlay
      vec3 electrical = vec3(0.3, 0.4, 0.8) * brainWaves * brainActivity * 0.2;
      
      // Consciousness glow
      vec3 consciousnessGlow = vec3(0.8, 0.6, 1.0) * consciousness * 0.3;
      
      vec3 finalColor = deepBrain + cortex + synapses + electrical + consciousnessGlow;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  useEffect(() => {
    if (!mountRef.current) return;
    
    try {

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
        brainActivity: { value: brainActivity },
        consciousnessLevel: { value: consciousnessLevel }
      }
    });
    const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebulaMesh.position.z = -500;
    scene.add(nebulaMesh);

    // Neural network setup
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(neuronCount * 3);
    const activations = new Float32Array(neuronCount);
    const neuronTypes = new Float32Array(neuronCount);
    const connectionStrengths = new Float32Array(neuronCount);
    const memoryTraces = new Float32Array(neuronCount);
    
    // Neural network structure
    const neurons = [];
    const connections = [];

    // Initialize neural network with brain-like structure
    for (let i = 0; i < neuronCount; i++) {
      const i3 = i * 3;
      
      // Create layered brain structure (cortex, hippocampus, etc.)
      let x, y, z;
      const layer = Math.floor(i / (neuronCount / 6)); // 6 brain layers
      
      switch(layer) {
        case 0: // Sensory cortex
          x = (Math.random() - 0.5) * 200;
          y = 80 + Math.random() * 40;
          z = (Math.random() - 0.5) * 150;
          break;
        case 1: // Motor cortex
          x = (Math.random() - 0.5) * 180;
          y = 40 + Math.random() * 40;
          z = (Math.random() - 0.5) * 140;
          break;
        case 2: // Hippocampus (memory)
          const angle = Math.random() * Math.PI * 2;
          const radius = 30 + Math.random() * 20;
          x = Math.cos(angle) * radius;
          y = -20 + Math.random() * 20;
          z = Math.sin(angle) * radius;
          break;
        case 3: // Thalamus (relay)
          x = (Math.random() - 0.5) * 40;
          y = (Math.random() - 0.5) * 40;
          z = (Math.random() - 0.5) * 40;
          break;
        case 4: // Brain stem
          x = (Math.random() - 0.5) * 30;
          y = -60 + Math.random() * 30;
          z = (Math.random() - 0.5) * 30;
          break;
        default: // Association areas
          x = (Math.random() - 0.5) * 160;
          y = (Math.random() - 0.5) * 120;
          z = (Math.random() - 0.5) * 120;
      }
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Neuron properties
      const neuron = {
        id: i,
        x, y, z,
        layer,
        activation: Math.random() * 0.1,
        baseActivation: Math.random() * 0.1,
        threshold: 0.5 + Math.random() * 0.3,
        connections: [],
        memoryStrength: Math.random(),
        lastFired: 0,
        neuronType: layer / 6 // Normalize layer to 0-1
      };
      
      neurons.push(neuron);
      activations[i] = neuron.activation;
      neuronTypes[i] = neuron.neuronType;
      connectionStrengths[i] = Math.random();
      memoryTraces[i] = neuron.memoryStrength;
    }
    
    // Create neural connections based on distance and layer compatibility
    for (let i = 0; i < neuronCount; i++) {
      const neuronA = neurons[i];
      const connectionCount = Math.floor(connectionDensity * neuronCount * (0.5 + Math.random() * 0.5));
      
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * neuronCount);
        if (targetIndex === i) continue;
        
        const neuronB = neurons[targetIndex];
        const distance = Math.sqrt(
          Math.pow(neuronA.x - neuronB.x, 2) +
          Math.pow(neuronA.y - neuronB.y, 2) +
          Math.pow(neuronA.z - neuronB.z, 2)
        );
        
        // Prefer local connections with some long-range
        const connectionProbability = Math.exp(-distance / 100) + 0.1;
        
        if (Math.random() < connectionProbability) {
          const connection = {
            from: i,
            to: targetIndex,
            weight: (Math.random() - 0.5) * 2, // Can be inhibitory or excitatory
            strength: Math.random(),
            plasticity: Math.random()
          };
          
          connections.push(connection);
          neuronA.connections.push(connection);
        }
      }
    }
    
    neuronsRef.current = neurons;
    connectionsRef.current = connections;

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('activation', new THREE.BufferAttribute(activations, 1));
    geometry.setAttribute('neuronType', new THREE.BufferAttribute(neuronTypes, 1));
    geometry.setAttribute('connectionStrength', new THREE.BufferAttribute(connectionStrengths, 1));
    geometry.setAttribute('memoryTrace', new THREE.BufferAttribute(memoryTraces, 1));

    // Neural material with brain simulation uniforms
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2() },
        brainActivity: { value: brainActivity },
        consciousnessLevel: { value: consciousnessLevel },
        cognitiveLoad: { value: cognitiveLoad },
        synapseStrength: { value: synapseStrength },
        learningRate: { value: learningRate }
      },
      vertexShader: neuronVertexShader,
      fragmentShader: neuronFragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    const neuralNetwork = new THREE.Points(geometry, material);
    neuralNetworkRef.current = neuralNetwork;
    scene.add(neuralNetwork);
    
    // Create synaptic connections visualization
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions = [];
    const connectionColors = [];
    
    connections.forEach(conn => {
      const fromNeuron = neurons[conn.from];
      const toNeuron = neurons[conn.to];
      
      connectionPositions.push(fromNeuron.x, fromNeuron.y, fromNeuron.z);
      connectionPositions.push(toNeuron.x, toNeuron.y, toNeuron.z);
      
      // Color based on connection strength and type
      const color = conn.weight > 0 ? 
        new THREE.Color(0.2, 0.8, 0.3) : // Excitatory - green
        new THREE.Color(0.8, 0.2, 0.3);  // Inhibitory - red
      
      connectionColors.push(color.r, color.g, color.b);
      connectionColors.push(color.r, color.g, color.b);
    });
    
    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connectionPositions), 3));
    connectionGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(connectionColors), 3));
    
    const connectionMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
    
    const connectionLines = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    scene.add(connectionLines);

    // Brain wave visualization rings
    const brainWaveCount = 4;
    const brainWaves = [];
    const waveTypes = ['delta', 'theta', 'alpha', 'beta'];
    
    for (let i = 0; i < brainWaveCount; i++) {
      const waveGeometry = new THREE.RingGeometry(30 + i * 25, 32 + i * 25, 64);
      const waveColor = new THREE.Color().setHSL(i / brainWaveCount * 0.8 + 0.1, 0.7, 0.6);
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: waveColor,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const wave = new THREE.Mesh(waveGeometry, waveMaterial);
      wave.rotation.x = Math.PI / 2;
      wave.userData = { type: waveTypes[i], frequency: (i + 1) * 2 };
      brainWaves.push(wave);
      scene.add(wave);
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

    // Neural network initialization animation
    gsap.timeline()
      .from(camera.position, {
        duration: 4,
        z: 500,
        ease: 'power3.out'
      })
      .from(neuralNetwork.scale, {
        duration: 3,
        x: 0,
        y: 0,
        z: 0,
        ease: 'elastic.out(1, 0.5)'
      }, '-=2')
      .to(connectionMaterial, {
        duration: 2,
        opacity: 0.3,
        ease: 'power2.out'
      }, '-=1')
      .to({}, {
        duration: 0.5,
        onComplete: () => setIsLoaded(true)
      });

    // Advanced neural simulation loop
    const animate = () => {
      timeRef.current += 0.016;
      
      // Update shader uniforms
      material.uniforms.time.value = timeRef.current;
      material.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      nebulaMaterial.uniforms.time.value = timeRef.current;
      nebulaMaterial.uniforms.brainActivity.value = brainActivity;
      nebulaMaterial.uniforms.consciousnessLevel.value = consciousnessLevel;

      // Neural network simulation
      const neurons = neuronsRef.current;
      const connections = connectionsRef.current;
      const activationArray = geometry.attributes.activation.array;
      const memoryArray = geometry.attributes.memoryTrace.array;
      
      // Simulate neural activity
      for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i];
        let totalInput = neuron.baseActivation;
        
        // Calculate input from connected neurons
        neuron.connections.forEach(conn => {
          const sourceNeuron = neurons[conn.from];
          if (sourceNeuron.activation > sourceNeuron.threshold) {
            totalInput += sourceNeuron.activation * conn.weight * conn.strength;
          }
        });
        
        // Mouse attention effect
        const mouseDistance = Math.sqrt(
          Math.pow(neuron.x - mouseRef.current.x * 100, 2) +
          Math.pow(neuron.y - mouseRef.current.y * 100, 2)
        );
        const attentionBoost = Math.exp(-mouseDistance / 50) * cognitiveLoad * 0.5;
        totalInput += attentionBoost;
        
        // Apply activation function (sigmoid)
        neuron.activation = 1 / (1 + Math.exp(-(totalInput - neuron.threshold)));
        
        // Memory formation (Hebbian learning)
        if (memoryFormation && neuron.activation > 0.7) {
          neuron.memoryStrength = Math.min(1, neuron.memoryStrength + learningRate * neuron.activation);
          
          // Strengthen connections that contributed to firing
          neuron.connections.forEach(conn => {
            if (neurons[conn.from].activation > 0.5) {
              conn.strength = Math.min(1, conn.strength + learningRate * conn.plasticity);
            }
          });
        }
        
        // Neural plasticity - weaken unused connections
        if (neuralPlasticity) {
          neuron.connections.forEach(conn => {
            if (neurons[conn.from].activation < 0.1) {
              conn.strength = Math.max(0.1, conn.strength - learningRate * 0.1);
            }
          });
        }
        
        // Update visualization arrays
        activationArray[i] = neuron.activation;
        memoryArray[i] = neuron.memoryStrength;
      }
      
      // Mark attributes for update
      geometry.attributes.activation.needsUpdate = true;
      geometry.attributes.memoryTrace.needsUpdate = true;
      
      // Brain wave animations
      brainWaves.forEach((wave, index) => {
        const frequency = wave.userData.frequency;
        wave.rotation.z += frequency * 0.005 * brainActivity;
        
        // Modulate opacity based on brain activity
        const baseOpacity = 0.1 + brainActivity * 0.2;
        const oscillation = Math.sin(timeRef.current * frequency) * 0.1;
        wave.material.opacity = baseOpacity + oscillation;
        
        // Scale based on consciousness level
        const scale = 1 + consciousnessLevel * Math.sin(timeRef.current * 0.5 + index) * 0.1;
        wave.scale.setScalar(scale);
      });
      
      // Dream mode effects
      if (dreamMode) {
        const dreamIntensity = Math.sin(timeRef.current * 0.3) * 0.5 + 0.5;
        neuralNetwork.rotation.y += dreamIntensity * 0.01;
        neuralNetwork.rotation.x += Math.sin(timeRef.current * 0.2) * 0.005;
        
        // Modulate connection visibility in dreams
        connectionMaterial.opacity = 0.1 + dreamIntensity * 0.3;
      }
      
      // Thought propagation visualization
      if (Math.random() < thoughtSpeed * 0.01) {
        // Create a thought pulse
        const sourceNeuron = neurons[Math.floor(Math.random() * neurons.length)];
        if (sourceNeuron.activation > 0.6) {
          // This could trigger a cascade of activation
          sourceNeuron.connections.forEach(conn => {
            const targetNeuron = neurons[conn.to];
            targetNeuron.activation = Math.min(1, targetNeuron.activation + 0.3 * conn.strength);
          });
        }
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
      connectionGeometry.dispose();
      connectionMaterial.dispose();
      brainWaves.forEach(wave => {
        wave.geometry.dispose();
        wave.material.dispose();
      });
      renderer.dispose();
    };
    
    } catch (error) {
      console.error('Neural Brain initialization error:', error);
      setIsLoaded(true); // Show component even if there's an error
    }
  }, [
    neuronCount,
    connectionDensity,
    learningRate,
    synapseStrength,
    thoughtSpeed,
    brainActivity,
    memoryFormation,
    consciousnessLevel,
    neuralPlasticity,
    dreamMode,
    cognitiveLoad
  ]);

  return (
    <div className={`neural-brain ${className}`}>
      <div ref={mountRef} className="neural-brain__canvas" />
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#00ffff',
          fontSize: '1.2rem',
          fontFamily: 'monospace'
        }}>
          🧠 Loading Neural Network...
        </div>
      )}
    </div>
  );
};

export default NeuralBrain;
