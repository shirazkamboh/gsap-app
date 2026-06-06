'use client'

import { Canvas } from '@react-three/fiber'
import {
  Environment,
  Float,
} from '@react-three/drei'

import Model from './Model'

export default function Scene() {
  return (
    <div className="sticky top-0 h-screen">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 45,
        }}
      >
        <ambientLight intensity={0.5} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={0.1}
        />

        <directionalLight
          position={[-5, -5, 2]}
          intensity={0.1}
        />

        <Float
          speed={1}
          rotationIntensity={0.5}
          floatIntensity={1}
        >
          <Model />
        </Float>

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}