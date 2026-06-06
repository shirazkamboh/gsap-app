'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const NavButton = ({ label }: { label: string }) => (
  <Link 
    href="#" 
    className="px-4 py-2 border border-transparent hover:bg-[#ff6600] hover:text-black transition-all duration-300 uppercase text-sm tracking-widest font-medium"
  >
    {label}
  </Link>
)

const MobileNavButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Link
    href="#"
    onClick={onClick}
    className="text-[#ff6600] text-2xl font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
  >
    {label}
  </Link>
)

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference py-6 md:py-8 px-6 md:px-12 text-[#ff6600]">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Side - hidden on mobile */}
          <div className="hidden md:flex gap-8 lg:gap-12 flex-1 items-center">
            <NavButton label="About" />
            <NavButton label="Journal" />
          </div>

          {/* Hamburger - visible on mobile only */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 z-10"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-[#ff6600] transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#ff6600] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#ff6600] transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          {/* Center Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <Image 
                src="/globe.svg" 
                alt="Logo" 
                width={40} 
                height={40} 
                className="invert"
                style={{ filter: 'invert(52%) sepia(91%) saturate(2714%) hue-rotate(360deg) brightness(101%) contrast(105%)' }}
              />
            </Link>
          </div>

          {/* Right Side - hidden on mobile */}
          <div className="hidden md:flex gap-8 lg:gap-12 flex-1 items-center justify-end">
            <NavButton label="Blog" />
            <NavButton label="Shop" />
          </div>
        </nav>
      </header>

      {/* Mobile Full-screen Menu - separate element to avoid mix-blend-difference */}
      <div
        className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <MobileNavButton label="About" onClick={() => setMenuOpen(false)} />
        <MobileNavButton label="Journal" onClick={() => setMenuOpen(false)} />
        <MobileNavButton label="Blog" onClick={() => setMenuOpen(false)} />
        <MobileNavButton label="Shop" onClick={() => setMenuOpen(false)} />
      </div>
    </>
  )
}
