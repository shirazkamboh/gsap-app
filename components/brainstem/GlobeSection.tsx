'use client'

import { useRef, useMemo, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Points, 
  PointMaterial, 
  OrbitControls, 
  PerspectiveCamera,
  Text,
  Float
} from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function DottedGlobe() {
  const pointsRef = useRef<THREE.Points>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const { mouse, viewport } = useThree()
  
  // Create sphere points
  const [positions, originalPositions] = useMemo(() => {
    const geo = new THREE.SphereGeometry(2.0, 40, 40)
    const pos = geo.attributes.position.array as Float32Array
    return [pos, new Float32Array(pos)]
  }, [])

  useFrame((state) => {
    const points = pointsRef.current
    const mesh = meshRef.current
    const posAttr = points.geometry.attributes.position
    
    // Elastic move with cursor
    const mx = (mouse.x * viewport.width) / 2
    const my = (mouse.y * viewport.height) / 2
    const mouseVec = new THREE.Vector3(mx, my, 0)

    for (let i = 0; i < posAttr.count; i++) {
      const x = originalPositions[i * 3]
      const y = originalPositions[i * 3 + 1]
      const z = originalPositions[i * 3 + 2]
      
      const v = new THREE.Vector3(x, y, z)
      v.applyMatrix4(points.matrixWorld)
      
      const dist = v.distanceTo(mouseVec)
      const force = Math.max(0, 1.8 - dist) * 0.7
      
      const dir = v.clone().sub(mouseVec).normalize()
      
      posAttr.setXYZ(
        i,
        x + dir.x * force,
        y + dir.y * force,
        z + dir.z * force
      )
    }
    posAttr.needsUpdate = true
    
    // Sync mesh with points (simple approximation)
    if (mesh) {
      mesh.rotation.copy(points.rotation)
    }
    
    // Slow rotation
    points.rotation.y += 0.002
  })

  return (
    <group>
      {/* The Mesh (connecting lines) - Now Orange */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.99, 40, 40]} />
        <meshStandardMaterial 
          color="#ff6600" 
          wireframe 
          transparent 
          opacity={0.15} 
        />
      </mesh>

      <Points 
        ref={pointsRef} 
        positions={positions} 
        stride={3} 
      >
        <PointMaterial
          transparent
          color="#ff6600"
          size={0.07}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  )
}

function OrbitStar({ radius, speed, offset }: { radius: number; speed: number; offset: number }) {
  const ref = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    // Stars rotate in their own direction
    ref.current.rotation.z = state.clock.getElapsedTime() * speed + offset
  })

  return (
    <group ref={ref}>
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

function SingleOrbit({ orbit, index }: { orbit: { radius: number; speed: number; dots: number }, index: number }) {
  const lineRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    // Lines rotate OPPOSITE to stars (speed * -0.5)
    if (lineRef.current) {
      lineRef.current.rotation.z = state.clock.getElapsedTime() * (orbit.speed * -0.5)
    }
  })

  return (
    <group>
      {/* Dotted Orbit Line rotating opposite */}
      <group ref={lineRef}>
        <Points 
          positions={new Float32Array(
            Array.from({ length: orbit.dots }, (_, j) => {
              const angle = (j / orbit.dots) * Math.PI * 2
              return [Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius, 0]
            }).flat()
          )}
        >
          <PointMaterial
            transparent
            color="#bbbbbb"
            size={0.05}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.5}
          />
        </Points>
      </group>
      
      {/* Rotating Star on this orbit */}
      <OrbitStar radius={orbit.radius} speed={orbit.speed} offset={index * Math.PI} />
    </group>
  )
}

function SolarSystemLines() {
  const orbits = useMemo(() => [
    { radius: 2.8, speed: 0.15, dots: 100 },
    { radius: 3.8, speed: -0.1, dots: 120 },
    { radius: 4.8, speed: 0.08, dots: 140 },
    { radius: 5.8, speed: -0.04, dots: 160 },
  ], [])

  return (
    <group rotation={[Math.PI / 2.5, 0, 0]}>
      {orbits.map((orbit, i) => (
        <SingleOrbit key={i} orbit={orbit} index={i} />
      ))}
    </group>
  )
}

function LogoInside() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        fontSize={0.6}
        color="#ff6600"
        anchorX="center"
        anchorY="middle"
      >
        B
      </Text>
    </Float>
  )
}

function AnimatedScene() {
  const sceneRef = useRef<THREE.Group>(null!)
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sceneRef.current && document.querySelector(".globe-trigger")) {
        // Scale up animation on scroll
        gsap.fromTo(sceneRef.current.scale, 
          { x: 0.1, y: 0.1, z: 0.1 },
          { 
            x: 1, y: 1, z: 1,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ".globe-trigger",
              start: "top 80%",
              once: true
            }
          }
        )
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <group ref={sceneRef}>
      <DottedGlobe />
      <LogoInside />
      <SolarSystemLines />
    </group>
  )
}

export default function GlobeSection() {
  return (
    <section className="globe-trigger relative w-full h-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="absolute top-20 z-10 text-center pointer-events-none">
        <h2 className="text-black text-sm md:text-base font-bold uppercase tracking-[0.5em] opacity-30">
          Neural Core System
        </h2>
      </div>
      
      <div className="w-full h-full relative z-10 pointer-events-none md:pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          
          <Suspense fallback={null}>
            <AnimatedScene />
          </Suspense>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={false}
          />
        </Canvas>
      </div>

      <div className="absolute bottom-20 z-10 text-center w-full px-10 pointer-events-none">
        <p className="text-black text-xs md:text-sm font-medium uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
          Interactive Neural Mesh <br /> v4.0 Experimental Interface
        </p>
      </div>
    </section>
  )
}
