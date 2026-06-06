'use client'

import { useRef, useState, useEffect } from 'react'

const COUNT = 6
const NUM_STRIPS = 10
const IMAGE_ARC_DEG = 54
const STRIP_ARC_DEG = IMAGE_ARC_DEG / NUM_STRIPS
const RADIUS = 760
const STRIP_W = Math.ceil(2 * RADIUS * Math.tan((STRIP_ARC_DEG / 2) * (Math.PI / 180)))
const IMG_W = STRIP_W * NUM_STRIPS
const CARD_H = Math.round(IMG_W * 9 / 16)

// Local images from /public/images/slider/
const IMAGES = Array.from({ length: COUNT }, (_, i) =>
  `/images/slider/slide-${i + 1}.png`
)

const CONTENT = [
  { title: 'Cyber Reality', subtitle: 'Immersive digital worlds' },
  { title: 'Neural Link', subtitle: 'Connecting mind and machine' },
  { title: 'Neon Pulse', subtitle: 'Electronic heartbeat' },
  { title: 'Void Walker', subtitle: 'Exploring the unknown' },
  { title: 'Data Stream', subtitle: 'Flowing through information' },
  { title: 'Ghost Shell', subtitle: 'Ethereal presence' },
]

function DotGrid({ mouse }: { mouse: React.MutableRefObject<{ x: number, y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const dots: { x: number, y: number, ox: number, oy: number }[] = []
    const spacing = 40

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      dots.length = 0
      for (let x = 0; x < canvas.width + spacing; x += spacing) {
        for (let y = 0; y < canvas.height + spacing; y += spacing) {
          dots.push({ x, y, ox: x, oy: y })
        }
      }
    }

    window.addEventListener('resize', resize)
    resize()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      
      const mx = mouse.current.x * canvas.width
      const my = mouse.current.y * canvas.height

      dots.forEach(dot => {
        const dx = mx - dot.ox
        const dy = my - dot.oy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const force = Math.max(0, (200 - dist) / 200)
        
        dot.x = dot.ox + dx * force * 0.2
        dot.y = dot.oy + dy * force * 0.2

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [mouse])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

export default function CylinderSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const isDraggingRef = useRef(false)
  const rotationRef = useRef(0)
  const targetRef = useRef(0)
  const scaleRef = useRef(1)
  const modeRef = useRef<'idle' | 'snap'>('idle')
  const idleStartRef = useRef(0)
  const lastTimeRef = useRef(0)
  const lastXRef = useRef(0)
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })
  const parallaxRef = useRef({ x: 0, y: 0 })

  const cylinderRef = useRef<HTMLDivElement>(null)
  const scaleWrapRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const stripsRef = useRef<HTMLElement[]>([])
  const viewportScaleRef = useRef(1)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const updateViewportScale = () => {
      const w = window.innerWidth
      if (w < 480) viewportScaleRef.current = 0.52
      else if (w < 640) viewportScaleRef.current = 0.64
      else if (w < 768) viewportScaleRef.current = 0.76
      else if (w < 1024) viewportScaleRef.current = 0.88
      else viewportScaleRef.current = 1
    }
    updateViewportScale()
    window.addEventListener('resize', updateViewportScale)
    return () => window.removeEventListener('resize', updateViewportScale)
  }, [])

  useEffect(() => {
    idleStartRef.current = performance.now()
    lastTimeRef.current = performance.now()
    let raf: number

    const tick = (now: number) => {
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = now

      if (!isDraggingRef.current) {
        if (modeRef.current === 'idle') {
          targetRef.current -= delta * 1.2

          if (now - idleStartRef.current >= 6000) {
            const seg = 360 / COUNT
            targetRef.current = Math.round(targetRef.current / seg) * seg - seg
            modeRef.current = 'snap'
          }
        }
      }

      const lerp = modeRef.current === 'snap' ? 0.12 : 0.04
      rotationRef.current += (targetRef.current - rotationRef.current) * lerp

      if (modeRef.current === 'snap' && Math.abs(targetRef.current - rotationRef.current) < 0.25) {
        rotationRef.current = targetRef.current
        modeRef.current = 'idle'
        idleStartRef.current = performance.now()
      }

      // Parallax smooth
      const px = (mousePosRef.current.x - 0.5) * 15
      const py = (mousePosRef.current.y - 0.5) * 10
      parallaxRef.current.x += (px - parallaxRef.current.x) * 0.05
      parallaxRef.current.y += (py - parallaxRef.current.y) * 0.05

      const ts = isDraggingRef.current ? 0.86 : 1
      scaleRef.current += (ts - scaleRef.current) * 0.08

      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `rotateZ(${-15 + parallaxRef.current.y}deg) rotateY(${rotationRef.current + parallaxRef.current.x}deg)`
        
        // Dynamic Lighting/Brightness
        stripsRef.current.forEach(strip => {
            if (!strip) return
            const angle = parseFloat(strip.dataset.angle || '0')
            const totalAngle = (angle + rotationRef.current + parallaxRef.current.x) % 360
            const normAngle = (totalAngle + 360) % 360
            
            // Brightest at 0 (front), darkest at 180 (back)
            const brightness = 0.2 + 0.9 * Math.max(0, Math.cos(normAngle * Math.PI / 180))
            strip.style.filter = `brightness(${brightness}) contrast(1.1)`
        })
      }
      
      if (scaleWrapRef.current) {
        scaleWrapRef.current.style.transform = `scale(${scaleRef.current * viewportScaleRef.current})`
      }

      const seg = 360 / COUNT
      const norm = ((-rotationRef.current % 360) + 360) % 360
      setActiveIndex(Math.round(norm / seg) % COUNT)

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const moveCursor = (e: React.PointerEvent) => {
    if (!cursorRef.current || !containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    cursorRef.current.style.transform = `translate(${x - 36}px, ${y - 36}px)`
    mousePosRef.current = { x: x / r.width, y: y / r.height }
  }

  const onDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true
    setIsDragging(true)
    lastXRef.current = e.clientX
    if (e.pointerType !== 'touch') {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    moveCursor(e)
  }

  const onMove = (e: React.PointerEvent) => {
    moveCursor(e)
    if (!isDraggingRef.current) return
    targetRef.current += (e.clientX - lastXRef.current) * 0.28
    lastXRef.current = e.clientX
  }

  const onUp = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    const seg = 360 / COUNT
    targetRef.current = Math.round(targetRef.current / seg) * seg
    modeRef.current = 'idle'
    idleStartRef.current = performance.now()
  }

  const activeContent = CONTENT[activeIndex] ?? CONTENT[0]

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden select-none"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={() => {
        onUp()
        if (cursorRef.current) cursorRef.current.style.opacity = '0'
      }}
      onPointerEnter={(e) => {
        if (cursorRef.current) cursorRef.current.style.opacity = '1'
        moveCursor(e)
      }}
      style={{ cursor: 'none', touchAction: 'pan-y' }}
    >
      <DotGrid mouse={mousePosRef} />

      <header className="fixed top-0 left-0 w-full z-50 md:mix-blend-difference py-6 md:py-8 px-6 md:px-12 text-[#ff6600]">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="hidden md:flex gap-8 lg:gap-12 flex-1 items-center">
            <a className="px-4 py-2 border border-transparent hover:bg-[#ff6600] hover:text-black transition-all duration-300 uppercase text-sm tracking-widest font-medium" href="#" style={{ cursor: 'none' }}>About</a>
            <a className="px-4 py-2 border border-transparent hover:bg-[#ff6600] hover:text-black transition-all duration-300 uppercase text-sm tracking-widest font-medium" href="#" style={{ cursor: 'none' }}>Journal</a>
          </div>
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(prev => !prev)}
            style={{ cursor: 'none' }}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-[#ff6600] transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#ff6600] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#ff6600] transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
          <div className="flex justify-center">
            <a href="/" style={{ cursor: 'none' }}>
              <img alt="Logo" loading="lazy" width="40" height="40" decoding="async" data-nimg="1" className="invert" style={{ color: 'transparent', filter: 'invert(52%) sepia(91%) saturate(2714%) hue-rotate(360deg) brightness(101%) contrast(105%)' }} src="/globe.svg" />
            </a>
          </div>
          <div className="hidden md:flex gap-8 lg:gap-12 flex-1 items-center justify-end">
            <a className="px-4 py-2 border border-transparent hover:bg-[#ff6600] hover:text-black transition-all duration-300 uppercase text-sm tracking-widest font-medium" href="#" style={{ cursor: 'none' }}>Blog</a>
            <a className="px-4 py-2 border border-transparent hover:bg-[#ff6600] hover:text-black transition-all duration-300 uppercase text-sm tracking-widest font-medium" href="#" style={{ cursor: 'none' }}>Shop</a>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ cursor: 'none' }}
      >
        {['About', 'Journal', 'Blog', 'Shop'].map(label => (
          <a
            key={label}
            href="#"
            onClick={() => setMenuOpen(false)}
            className="text-[#ff6600] text-2xl font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
            style={{ cursor: 'none' }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Original Gradient Blur Overlays */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-48 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_20%,transparent)]" />
        <div className="absolute bottom-0 left-0 w-full h-48 backdrop-blur-md [mask-image:linear-gradient(to_top,black_20%,transparent)]" />
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1400px' }}
      >
        <div ref={scaleWrapRef} style={{ transformStyle: 'preserve-3d' }}>
          <div
            ref={cylinderRef}
            style={{
              position: 'relative',
              width: 0,
              height: 0,
              transformStyle: 'preserve-3d',
              transform: 'rotateZ(-15deg) rotateY(0deg)',
            }}
          >
            {IMAGES.flatMap((url, imgIdx) =>
              Array.from({ length: NUM_STRIPS }, (_, s) => {
                const base = (imgIdx / COUNT) * 360
                const angle = base + (s - (NUM_STRIPS - 1) / 2) * STRIP_ARC_DEG
                const globalIdx = imgIdx * NUM_STRIPS + s
                return (
                  <div
                    key={`${imgIdx}-${s}`}
                    ref={(el) => { if (el) stripsRef.current[globalIdx] = el }}
                    className="cylinder-strip"
                    data-angle={angle}
                    style={{
                      position: 'absolute',
                      width: STRIP_W,
                      height: CARD_H,
                      top: -CARD_H / 2,
                      left: -STRIP_W / 2,
                      transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                      backgroundImage: `url(${url})`,
                      backgroundSize: `${IMG_W}px ${CARD_H}px`,
                      backgroundPosition: `${-s * STRIP_W}px 0`,
                      backgroundRepeat: 'no-repeat',
                      transition: 'filter 0.1s ease-out',
                    }}
                  />
                )
              })
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 md:bottom-16 md:left-16 z-30 pointer-events-none"
        style={{
          transform: isDragging ? 'scale(0.92) translateY(8px)' : 'scale(1) translateY(0)',
          opacity: isDragging ? 0.5 : 1,
          transition: 'transform 0.4s ease, opacity 0.4s ease',
        }}
      >
        <div className="max-w-xs sm:max-w-sm md:max-w-md text-white">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase leading-none mb-1 md:mb-2 tracking-tighter">
            {activeContent.title}
          </h2>
          <p className="text-xs sm:text-sm font-medium tracking-[0.4em] uppercase text-white/60 mb-4 md:mb-8">
            {activeContent.subtitle}
          </p>
          <button
            className="pointer-events-auto bg-white text-black px-5 py-2 sm:px-8 sm:py-3 text-xs font-black uppercase tracking-widest hover:bg-[#ff6600] hover:text-white transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: 'none' }}
          >
            Explore Project
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 md:bottom-16 md:right-16 z-30 text-white/20 font-mono text-xs sm:text-sm pointer-events-none">
        {String(activeIndex + 1).padStart(2, '0')} / 06
      </div>

      <div
        ref={cursorRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: isDragging ? '#ff6600' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          pointerEvents: 'none',
          transform: 'translate(-200px,-200px)',
          zIndex: 9999,
          opacity: 0,
          transition: 'opacity 0.2s ease, background-color 0.25s ease',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M7.5 1L1.5 5.5L7.5 10" stroke={isDragging ? 'white' : 'black'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M3.5 1L9.5 5.5L3.5 10" stroke={isDragging ? 'white' : 'black'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}
