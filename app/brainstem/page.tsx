'use client'

import { Suspense, useEffect, useRef } from 'react'
import BrainStemScene from '@/components/brainstem/BrainStemScene'
import GlobeSection from '@/components/brainstem/GlobeSection'
import CylinderSlider from '@/components/brainstem/CylinderSlider'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BrainStemPage() {
  const heroContainerRef = useRef<HTMLDivElement>(null!)
  const orangeSectionRef = useRef<HTMLElement>(null!)
  const videoSectionRef = useRef<HTMLElement>(null!)
  const videoHeadingRef = useRef<HTMLHeadingElement>(null!)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Text Skew Animation
      if (document.querySelector(".hero-row-1")) {
        gsap.to(".hero-row-1", {
          scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "30% top",
            scrub: 1,
          },
          skewX: 10,
          x: -100,
          opacity: 0,
        })
      }

      if (document.querySelector(".hero-row-2")) {
        gsap.to(".hero-row-2", {
          scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "30% top",
            scrub: 1,
          },
          skewX: -10,
          x: 100,
          opacity: 0,
        })
      }

      // 2. Parallax Hero Scroll Up (When orange section is 30% in)
      if (heroContainerRef.current && orangeSectionRef.current) {
        gsap.to(heroContainerRef.current, {
          scrollTrigger: {
            trigger: orangeSectionRef.current,
            start: "top 70%", // 30% into screen
            end: "top top",
            scrub: true,
          },
          y: "-100%",
          ease: "none"
        })
      }

      // 3. Video Section Text Animations
      if (videoHeadingRef.current && videoSectionRef.current) {
        const words = videoHeadingRef.current.innerText.split(" ")
        videoHeadingRef.current.innerHTML = words.map(word => `<span class="inline-block translate-y-full opacity-0 mr-4">${word}</span>`).join("")
        
        gsap.to(videoHeadingRef.current.querySelectorAll("span"), {
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: "top 60%",
            end: "top 20%",
            scrub: 1,
          },
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out"
        })
      }

      if (videoSectionRef.current && document.querySelector(".video-para")) {
        gsap.from(".video-para", {
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: "top 50%",
            end: "top 10%",
            scrub: 1,
          },
          x: -200,
          opacity: 0,
          ease: "power2.out"
        })
      }

      if (videoSectionRef.current && document.querySelector(".full-width-heading")) {
        gsap.from(".full-width-heading", {
          scrollTrigger: {
            trigger: videoSectionRef.current,
            start: "top 30%",
            end: "top top",
            scrub: 1,
          },
          scale: 0.8,
          opacity: 0,
          ease: "power1.inOut"
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="relative w-full bg-black">
      {/* Scroll container increased to 1200vh to ensure long sticky duration for all sections */}
      <div className="h-[1200vh] w-full relative">
        
        {/* Hero Section Container (Parallax Layer) */}
        <div ref={heroContainerRef} className="fixed inset-0 w-full h-screen z-0">
          {/* Hero Text Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-end pb-16 sm:pb-24 md:pb-32 px-4 sm:px-8 md:px-10">
            <div className="w-full max-w-7xl text-white font-bold text-5xl sm:text-7xl md:text-[10rem] leading-[0.85] uppercase tracking-tighter">
              <div className="hero-row-1 overflow-hidden">QUICK BROWN</div>
              <div className="hero-row-2 overflow-hidden text-right">FOX JUMPS</div>
            </div>
          </div>

          {/* 3D Scene Layer */}
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-white">Loading Scene...</div>}>
              <BrainStemScene />
            </Suspense>
          </div>
        </div>

        {/* Orange Background Section (Solid Scroll In) */}
        <section 
          ref={orangeSectionRef}
          className="absolute top-[200vh] left-0 w-full min-h-screen bg-[#ff6600] z-30 flex items-center justify-center px-4 sm:px-8 md:px-10 py-20 md:py-32"
        >
          <div className="max-w-4xl text-center text-white">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold uppercase mb-8 md:mb-12 leading-tight">
              A New Era of Cinematic <br />
              Character Animation <br />
              Excellence Starts Here <br />
              Beyond the Ordinary
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-medium tracking-[0.2em] uppercase leading-relaxed max-w-2xl mx-auto">
              We push the boundaries of digital human interaction through immersive 3D storytelling and advanced procedural movements.
            </p>
          </div>
        </section>

        {/* Video Background Section (Revealed behind) */}
        <section 
          ref={videoSectionRef}
          className="absolute top-[350vh] left-0 w-full min-h-[150vh] z-20"
        >
          {/* Video Background - Sticky for reveal effect */}
          <div className="sticky top-0 w-full h-screen overflow-hidden bg-zinc-900">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://v.ftcdn.net/04/81/25/11/700_F_481251101_H8H8IqI9lY7iUv5XvPz7pS9P7wV8Vv9y_ST.mp4" type="video/mp4" />
              <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-slow-motion-4806-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60" />
            
            {/* Content Container */}
            <div className="relative h-full flex flex-col items-center justify-center text-white px-4 sm:px-8 md:px-10">
              <h2 
                ref={videoHeadingRef} 
                className="text-3xl sm:text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-6 md:mb-8 text-center"
              >
                THE FUTURE IS IMMERSIVE
              </h2>
              <p className="video-para text-sm sm:text-xl md:text-2xl font-light uppercase tracking-widest max-w-3xl text-center mb-10 md:mb-16 px-4">
                Exploring the intersection of technology and human emotion through advanced character animation.
              </p>
              <h1 className="full-width-heading text-4xl sm:text-6xl md:text-[15vw] font-black uppercase leading-none tracking-tighter w-full text-center">
                DIGITAL HUMANITY
              </h1>
            </div>
          </div>
        </section>

        {/* Globe Section */}
        <section className="absolute top-[550vh] left-0 w-full h-[300vh] z-40">
          <div className="sticky top-0 w-full h-screen">
            <Suspense fallback={<div className="flex items-center justify-center w-full h-full bg-white text-black">Loading Globe...</div>}>
              <GlobeSection />
            </Suspense>
          </div>
        </section>

        {/* Cylinder Slider Section */}
        <section className="absolute top-[850vh] left-0 w-full h-[300vh] z-50">
          <div className="sticky top-0 w-full h-screen">
            <Suspense fallback={<div className="flex items-center justify-center w-full h-full bg-black text-white">Loading Slider...</div>}>
              <CylinderSlider />
            </Suspense>
          </div>
        </section>

        {/* Decorative label */}
        <div className="hidden md:block fixed bottom-10 right-10 z-40 text-white/10 text-xs uppercase tracking-widest pointer-events-none">
          Zencoder / Cinematic Showcase v2.4
        </div>
      </div>
    </main>
  )
}
