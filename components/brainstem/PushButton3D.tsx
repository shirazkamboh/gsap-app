'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function ButtonModel({ onDown, onUp }: { onDown: () => void, onUp: () => void }) {
  const plungerRef = useRef<THREE.Mesh>(null!)
  const [pressed, setPressed] = useState(false)

  useFrame(() => {
    // Smooth plunger movement
    const targetY = pressed ? -0.1 : 0
    plungerRef.current.position.y = THREE.MathUtils.lerp(plungerRef.current.position.y, targetY, 0.2)
  })

  const handlePointerDown = () => {
    setPressed(true)
    onDown()
  }

  const handlePointerUp = () => {
    setPressed(false)
    onUp()
  }

  return (
    <group scale={1.5}>
      {/* Button Socket/Base */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.2, 1.3, 0.4, 32]} />
        <meshStandardMaterial color="#88ccff" metalness={0.5} roughness={0.2} />
      </mesh>
      
      {/* Inner Rim */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Plunger (The Clickable Part) */}
      <mesh 
        ref={plungerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[0.9, 0.9, 0.6, 32]} />
        <meshStandardMaterial 
          color="#00aaff" 
          emissive="#00aaff" 
          emissiveIntensity={pressed ? 2 : 0.5} 
          metalness={0.3} 
          roughness={0.1} 
        />
        
        {/* "Push" Tooltip */}
        <Html position={[0, 1.2, 0]} center distanceFactor={10}>
          <div className={`transition-opacity duration-300 pointer-events-none flex flex-col items-center ${pressed ? 'opacity-0' : 'opacity-100'}`}>
            <div className="bg-white text-[#003366] font-bold px-4 py-2 rounded-full text-lg shadow-xl relative">
              Push
              {/* Little arrow */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
            </div>
          </div>
        </Html>
      </mesh>
    </group>
  )
}

export default function PushButton3D({ onDown, onUp }: { onDown: () => void, onUp: () => void }) {
  return (
    <div className="w-full h-64 cursor-pointer">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 4, 6]} fov={30} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Environment preset="city" />
        
        <ButtonModel onDown={onDown} onUp={onUp} />
        
        <ContactShadows 
          position={[0, -0.4, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={1} 
          color="#000000" 
        />
      </Canvas>
    </div>
  )
}
