'use client'

import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BrainStemCharacter() {
  const group = useRef<THREE.Group>(null!)
  const { scene, animations } = useGLTF('/models/BrainStem.glb')
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    const walkName = names.find(n => n.toLowerCase().includes('walk')) || names[names.length - 1]
    const walkAction = actions[walkName]

    if (walkAction) {
      walkAction.play().paused = true // Start paused
    }

    // GSAP Scroll Animation
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: 'main',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress
          
          if (walkAction) {
            // Slower animation: multiply progress to slow down the speed 
            // of the walk cycle relative to the scroll
            const duration = walkAction.getClip().duration
            // Using a multiplier to slow down the playback (e.g. 0.5 for half speed)
            // or just letting it stretch across the 300vh scroll
            walkAction.time = (progress * duration * 0.5) % duration
          }

          // Keep character centered - removed Z movement
          if (group.current) {
            group.current.rotation.y = progress * Math.PI * 0.2 // Subtle rotation only
          }
        }
      })
    })

    return () => ctx.revert()
  }, [actions, names, animations])

  return (
    <group ref={group}>
      <primitive 
        object={scene} 
        /* 
           ADJUST CHARACTER PLACEMENT HERE:
           position: [x, y, z]
           rotation: [x, y, z] (in radians)
           scale: number
        */
        position={[0, -1, 0]} 
        rotation={[0, 0, 0]} 
        scale={1.5} 
        castShadow
        receiveShadow
      />
    </group>
  )
}

useGLTF.preload('/models/BrainStem.glb')
