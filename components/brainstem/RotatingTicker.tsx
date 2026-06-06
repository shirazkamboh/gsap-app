'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export default function RotatingTicker() {
  const groupRef = useRef<THREE.Group>(null!)
  const text = "A QUICK BROWN FOX JUMPS "
  const segments = 12
  const radius = 5

  useFrame((state) => {
    // Continuous rotation
    groupRef.current.rotation.y += 0.003
    
    // Subtle bulge/bobbing
    const time = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(time * 0.3) * 0.05
  })

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {[...Array(segments)].map((_, i) => {
        const angle = (i / segments) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <Text
            key={i}
            position={[x, 0, z]}
            // Rotate each segment to face OUTWARD from the center
            rotation={[0, -angle + Math.PI / 2, 0]}
            fontSize={12}
            color="#ff6600"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
          >
            {text}
          </Text>
        )
      })}
    </group>
  )
}
