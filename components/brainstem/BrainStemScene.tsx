'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, MeshReflectorMaterial, Float } from '@react-three/drei'
import { Suspense, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BrainStemCharacter from './BrainStemCharacter'
import RotatingTicker from './RotatingTicker'

function GlowingParticles({ count = 100 }) {
  const pointsRef = useRef<THREE.Points>(null!)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const angles = new Float32Array(count)
    const radii = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      angles[i] = Math.random() * Math.PI * 2
      radii[i] = 0.8 + Math.random() * 0.4
      speeds[i] = 0.01 + Math.random() * 0.02
      
      const x = Math.cos(angles[i]) * radii[i]
      const z = Math.sin(angles[i]) * radii[i]
      const y = -1 + Math.random() * 4 // Start from bottom to top range
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    return { positions, speeds, angles, radii }
  }, [count])

  useFrame((state) => {
    const points = pointsRef.current
    const posAttr = points.geometry.attributes.position
    
    for (let i = 0; i < count; i++) {
      // Rotation
      particles.angles[i] += particles.speeds[i]
      const x = Math.cos(particles.angles[i]) * particles.radii[i]
      const z = Math.sin(particles.angles[i]) * particles.radii[i]
      
      // Upward movement
      let y = posAttr.getY(i)
      y += 0.015 // Vertical speed
      
      // Reset to bottom if it goes too high
      if (y > 3) {
        y = -1
      }
      
      posAttr.setXYZ(i, x, y, z)
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ff6600"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

gsap.registerPlugin(ScrollTrigger)

function SceneContent() {
  const { camera } = useThree()
  const lightRef = useRef<THREE.DirectionalLight>(null!)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Mouse Parallax - tightened to maintain centering
  useFrame((state) => {
    const targetX = state.mouse.x * 0.2
    const targetY = state.mouse.y * 0.1
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.2 + targetY, 0.05)
    state.camera.lookAt(0, 0.5, 0) // Look at the character's torso
  })

  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 30]} />

      <Suspense fallback={null}>
        <RotatingTicker />
      </Suspense>
      
      <Suspense fallback={null}>
        <BrainStemCharacter />
      </Suspense>

      <GlowingParticles count={150} />

      {/* Professional 3-Point Studio Lighting */}
      <directionalLight 
        ref={lightRef}
        position={[5, 5, 5]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      
      <pointLight position={[-4, 2, 3]} intensity={1.5} color="#445566" />
      
      <spotLight 
        position={[0, 5, -5]} 
        intensity={4} 
        angle={0.5} 
        penumbra={1} 
        color="#ffffff"
      />

      <ambientLight intensity={1} />
      
      <Environment preset="night" />

      {/* Premium Polished Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        {isMobile ? (
          <meshStandardMaterial color="#101010" roughness={1} metalness={0.3} />
        ) : (
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#101010"
            metalness={0.5}
          />
        )}
      </mesh>

      {/* Post Processing - desktop only */}
      {!isMobile && (
        <EffectComposer enableNormalPass={false}>
          <Bloom 
            luminanceThreshold={1} 
            mipmapBlur 
            intensity={0.5} 
            radius={0.4} 
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      )}
    </>
  )
}

export default function BrainStemScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="w-full h-full">
      <Canvas
        shadows={isMobile ? false : 'pcf'}
        dpr={isMobile ? [1, 1] : [1, 2]}
        camera={{ position: [0, 1.5, 5], fov: 35 }}
        gl={{ 
          antialias: !isMobile,
          toneMapping: THREE.ReinhardToneMapping,
          powerPreference: isMobile ? "default" : "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
