'use client'

import { useRef, useState, useEffect } from 'react'

const PROJECTS = [
  { num: '01', title: 'Cyber Reality',  tags: 'Web · Branding',  year: '2025', image: '/images/slider/slide-1.png' },
  { num: '02', title: 'Neural Link',    tags: 'Web · Software',  year: '2025', image: '/images/slider/slide-2.png' },
  { num: '03', title: 'Neon Pulse',     tags: 'Website',          year: '2025', image: '/images/slider/slide-3.png' },
  { num: '04', title: 'Void Walker',    tags: 'Web · Branding',  year: '2024', image: '/images/slider/slide-4.png' },
  { num: '05', title: 'Data Stream',    tags: 'Web · SEO',       year: '2024', image: '/images/slider/slide-5.png' },
  { num: '06', title: 'Ghost Shell',    tags: 'Website',          year: '2024', image: '/images/slider/slide-6.png' },
]

export default function WhatWeBuilt() {
  const [hoveredIdx, setHoveredIdx]   = useState<number | null>(null)
  const [imgVisible, setImgVisible]   = useState(false)
  const imgRef   = useRef<HTMLDivElement>(null)
  const rafRef   = useRef<number>(0)
  const targetPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.25)
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.25)

      if (imgRef.current) {
        imgRef.current.style.left = currentPos.current.x + 'px'
        imgRef.current.style.top  = currentPos.current.y + 'px'
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const onMouseMove = (e: React.MouseEvent) => {
    targetPos.current = { x: e.clientX, y: e.clientY }
  }

  const headingChars = 'WHAT WE\'VE BUILT.'.split('')

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black text-white overflow-hidden"
      onMouseMove={onMouseMove}
    >
      {/* Top rule */}
      <div className="w-full h-px bg-white/10" />

      <div className="px-6 md:px-12 lg:px-20 py-24 md:py-36">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-16 md:mb-24">
          <span className="font-mono text-[10px] text-white/25 tracking-widest uppercase">[02]</span>
          <span className="font-mono text-[10px] text-white/25 tracking-widest uppercase">Selected Work / 2024 — 2025</span>
        </div>

        {/* Heading — char-by-char stagger via CSS */}
        <h2 className="text-[13vw] sm:text-[11vw] md:text-[9vw] font-black uppercase tracking-tighter leading-[0.88] mb-20 md:mb-32 overflow-hidden">
          {headingChars.map((ch, i) => (
            <span
              key={i}
              className="inline-block animate-slide-up"
              style={{
                animationDelay: `${i * 28}ms`,
                animationFillMode: 'both',
                whiteSpace: ch === ' ' ? 'pre' : 'normal',
              }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </h2>

        {/* Project rows */}
        <div className="relative">
          {PROJECTS.map((project, i) => (
            <a
              key={i}
              href="#"
              className="group relative flex items-center gap-4 sm:gap-8 border-t border-white/10 py-5 sm:py-7 md:py-9 transition-colors duration-300 hover:border-[#ff6600]/30 cursor-none"
              onMouseEnter={() => { setHoveredIdx(i); setImgVisible(true) }}
              onMouseLeave={() => { setHoveredIdx(null); setImgVisible(false) }}
            >
              {/* Number */}
              <span className="font-mono text-[10px] text-white/25 tracking-widest w-6 flex-shrink-0">
                {project.num}
              </span>

              {/* Title with vertical roll */}
              <div className="flex-1 flex whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-4 md:group-hover:translate-x-8">
                {project.title.split('').map((char, charIdx) => (
                  <div 
                    key={charIdx} 
                    className="relative overflow-hidden"
                    style={{ 
                      height: '1.6em',
                      transitionDelay: `${charIdx * 15}ms`,
                      padding: '0 0.01em'
                    }}
                  >
                    <span 
                      className="block text-2xl sm:text-4xl md:text-[3.2vw] font-black uppercase tracking-tighter leading-[1.6] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
                      style={{ transitionDelay: 'inherit' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                    <span 
                      className="absolute top-0 left-0 block text-2xl sm:text-4xl md:text-[3.2vw] font-black uppercase tracking-tighter leading-[1.6] text-[#ff6600] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0"
                      style={{ transitionDelay: 'inherit' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-white/30 w-32 flex-shrink-0 text-right">
                {project.tags}
              </span>

              {/* Year */}
              <span className="hidden md:block font-mono text-[10px] text-white/20 w-10 flex-shrink-0 text-right">
                {project.year}
              </span>

              {/* Arrow */}
              <span className="text-base text-white/20 flex-shrink-0 transition-all duration-300 group-hover:text-[#ff6600] group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>

              {/* Hover line accent */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-[#ff6600] transition-all duration-500 group-hover:w-full" />
            </a>
          ))}

          {/* Bottom rule */}
          <div className="border-t border-white/10" />
        </div>

        {/* Bottom count */}
        <div className="mt-10 md:mt-14 flex items-center justify-between text-white/15 font-mono text-[10px] uppercase tracking-widest">
          <span>06 Projects</span>
          <span>2024 — 2025</span>
        </div>
      </div>

      {/* Cursor-following image preview */}
      <div
        ref={imgRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          transform: 'translate(-50%, -60%)',
          opacity: imgVisible ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      >
        <div
          className="overflow-hidden shadow-2xl border border-white/10"
          style={{
            width: 280,
            aspectRatio: '16/9',
            transform: imgVisible ? 'scale(1)' : 'scale(0.85)',
            transition: 'transform 0.4s cubic-bezier(0.76,0,0.24,1)',
          }}
        >
          {hoveredIdx !== null && (
            <img
              src={PROJECTS[hoveredIdx].image}
              alt={PROJECTS[hoveredIdx].title}
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.1) contrast(1.05)' }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(60%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.7s cubic-bezier(0.76, 0, 0.24, 1);
        }
      `}</style>
    </section>
  )
}
