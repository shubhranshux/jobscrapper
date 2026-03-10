import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function LightPillar({
  topColor = '#5227FF',
  bottomColor = '#FF9FFC',
  intensity = 1.0,
  rotationSpeed = 0.3,
  interactive = false,
  className = '',
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  mixBlendMode = 'screen',
  pillarRotation = 0,
  quality = 'high'
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Basic Three.JS Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    const dpr = quality === 'high' ? Math.min(window.devicePixelRatio, 2) : 1;
    renderer.setPixelRatio(dpr);
    
    // Attach to DOM
    containerRef.current.appendChild(renderer.domElement);

    // Full screen quad geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Modified shader to create a Light Pillar effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTopColor: { value: new THREE.Color(topColor) },
        uBottomColor: { value: new THREE.Color(bottomColor) },
        uResolution: { value: new THREE.Vector2() },
        uIntensity: { value: intensity },
        uGlow: { value: glowAmount },
        uNoiseIntensity: { value: noiseIntensity },
        uWidth: { value: pillarWidth },
        uHeight: { value: pillarHeight },
        uRotation: { value: pillarRotation * Math.PI / 180 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uInteractive: { value: interactive ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        uniform vec2 uResolution;
        uniform float uIntensity;
        uniform float uGlow;
        uniform float uNoiseIntensity;
        uniform float uWidth;
        uniform float uHeight;
        uniform float uRotation;
        uniform vec2 uMouse;
        uniform float uInteractive;
        varying vec2 vUv;

        // 2D Simplex Noise function
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 uv = vUv;
          
          // Rotation
          vec2 center = vec2(0.5);
          uv -= center;
          float s = sin(uRotation);
          float c = cos(uRotation);
          mat2 rot = mat2(c, -s, s, c);
          uv = rot * uv;
          uv += center;

          // Interactive
          vec2 mouseOffset = (uMouse - 0.5) * uInteractive * 0.1;
          uv += mouseOffset;

          // Core pillar logic
          float distX = abs(uv.x - 0.5);
          
          // Apply noise
          float n = snoise(vec2(uv.x * 3.0, uv.y * 3.0 - (uTime * 0.5))) * uNoiseIntensity;
          float distortedX = distX + (n * 0.05);

          // Soft pillar edge
          float shape = smoothstep(uWidth * 0.1, 0.0, distortedX);
          
          // Y Fade
          float distY = abs(uv.y - 0.5);
          float fadeY = smoothstep(0.0, uHeight * 0.5, 0.5 - distY);
          shape *= fadeY;

          // Glow falloff
          float glow = smoothstep(uWidth * 0.5 + uGlow, 0.0, distortedX) * 0.5 * fadeY;
          
          // Gradient colors
          vec3 color = mix(uBottomColor, uTopColor, uv.y);
          
          // Final compositing
          float alpha = clamp(shape + glow, 0.0, 1.0) * uIntensity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse Handler
    let currentX = 0.5, currentY = 0.5;
    let targetX = 0.5, targetY = 0.5;

    const handleMouseMove = (e) => {
      if (!interactive || !containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      targetX = (e.clientX - left) / width;
      targetY = 1.0 - ((e.clientY - top) / height);
    };
    if (interactive) window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let rafId;
    const startTime = Date.now();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const time = (Date.now() - startTime) * 0.001;
      
      material.uniforms.uTime.value = time * rotationSpeed;

      // Smooth mouse interpolation
      if (interactive) {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        material.uniforms.uMouse.value.set(currentX, currentY);
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [
    topColor, bottomColor, intensity, rotationSpeed, interactive,
    glowAmount, pillarWidth, pillarHeight, noiseIntensity, pillarRotation, quality
  ]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        mixBlendMode,
        pointerEvents: interactive ? 'auto' : 'none',
        zIndex: 0
      }} 
    />
  );
}