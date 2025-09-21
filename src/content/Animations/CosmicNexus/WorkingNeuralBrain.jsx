import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WorkingNeuralBrain = ({ 
  className = '',
  neuronCount = 150,
  connectionDensity = 0.3,
  brainActivity = 0.8,
  consciousnessLevel = 0.7
}) => {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      
      renderer.setSize(500, 500);
      renderer.setClearColor(0x000011, 1);
      mountRef.current.appendChild(renderer.domElement);

      // Create neurons as points
      const neuronGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(neuronCount * 3);
      const colors = new Float32Array(neuronCount * 3);
      const sizes = new Float32Array(neuronCount);

      // Generate neuron positions in brain-like structure
      for (let i = 0; i < neuronCount; i++) {
        const i3 = i * 3;
        
        // Create layered brain structure
        const layer = Math.floor(i / (neuronCount / 3));
        let x, y, z;
        
        switch(layer) {
          case 0: // Cortex
            x = (Math.random() - 0.5) * 200;
            y = 50 + Math.random() * 50;
            z = (Math.random() - 0.5) * 150;
            break;
          case 1: // Mid brain
            x = (Math.random() - 0.5) * 150;
            y = (Math.random() - 0.5) * 50;
            z = (Math.random() - 0.5) * 100;
            break;
          default: // Brain stem
            x = (Math.random() - 0.5) * 100;
            y = -50 + Math.random() * 30;
            z = (Math.random() - 0.5) * 80;
        }
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        // Neuron colors based on type
        const hue = layer / 3;
        const color = new THREE.Color().setHSL(hue * 0.8 + 0.1, 0.8, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        sizes[i] = 2 + Math.random() * 4;
      }

      neuronGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      neuronGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      neuronGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const neuronMaterial = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
      });

      const neurons = new THREE.Points(neuronGeometry, neuronMaterial);
      scene.add(neurons);

      // Create connections as lines
      const connectionGeometry = new THREE.BufferGeometry();
      const connectionPositions = [];
      const connectionColors = [];
      
      const connectionCount = Math.floor(neuronCount * connectionDensity);
      
      for (let i = 0; i < connectionCount; i++) {
        const from = Math.floor(Math.random() * neuronCount) * 3;
        const to = Math.floor(Math.random() * neuronCount) * 3;
        
        if (from !== to) {
          // Add line from neuron to neuron
          connectionPositions.push(
            positions[from], positions[from + 1], positions[from + 2],
            positions[to], positions[to + 1], positions[to + 2]
          );
          
          // Connection color - green for excitatory, red for inhibitory
          const isExcitatory = Math.random() > 0.3;
          const color = isExcitatory ? 
            new THREE.Color(0.2, 0.8, 0.3) : 
            new THREE.Color(0.8, 0.2, 0.3);
          
          connectionColors.push(
            color.r, color.g, color.b,
            color.r, color.g, color.b
          );
        }
      }

      connectionGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connectionPositions), 3));
      connectionGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(connectionColors), 3));

      const connectionMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });

      const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
      scene.add(connections);

      camera.position.set(0, 0, 300);

      // Animation loop
      let time = 0;
      const animate = () => {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Rotate the brain
        neurons.rotation.y += 0.005;
        connections.rotation.y += 0.005;
        
        // Pulse effect based on brain activity
        const pulse = Math.sin(time * 2) * 0.1 + 1;
        neurons.scale.setScalar(pulse * brainActivity);
        
        // Update connection opacity based on consciousness
        connectionMaterial.opacity = 0.1 + consciousnessLevel * 0.3;
        
        renderer.render(scene, camera);
      };

      animate();
      setIsLoaded(true);

      // Handle resize
      const handleResize = () => {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        neuronGeometry.dispose();
        neuronMaterial.dispose();
        connectionGeometry.dispose();
        connectionMaterial.dispose();
        renderer.dispose();
      };
    } catch (error) {
      console.error('Neural Brain error:', error);
      setIsLoaded(true);
    }
  }, [neuronCount, connectionDensity, brainActivity, consciousnessLevel]);

  return (
    <div className={`neural-brain ${className}`} style={{ width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
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

export default WorkingNeuralBrain;
