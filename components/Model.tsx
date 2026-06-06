'use client'

import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Model() {
  const modelRef = useRef<Group>(null!)

  const gltf = useGLTF('/models/living.glb')

  useEffect(() => {
    const model = modelRef.current

    gsap.to(model.rotation, {
      y: Math.PI * 12,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })

    gsap.to(model.position, {
      y: -1.5,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })
  }, [])

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={1}
      position={[0, -10, 0]}
    />
  )
}