'use client'

import Scene from '../components/Scene'

export default function Home() {
  return (
    <main className="bg-black text-white">

      {/* HERO SECTION */}
      <section className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="uppercase tracking-[0.4em] text-sm mb-6 opacity-70">
            Immersive Experience
          </p>

          <h1 className="text-7xl font-bold leading-none">
            Cinematic <br />
            Scroll Story
          </h1>
        </div>
      </section>

      {/* 3D STORY SECTION */}
      <section className="h-[400vh] relative">

        <Scene />

        {/* TEXT OVERLAY 1 */}
        <div className="absolute top-[20%] left-20 z-10">
          <h2 className="text-6xl font-bold">
            Precision
          </h2>

          <p className="mt-6 max-w-md text-white/70">
            Designed with premium motion and cinematic storytelling.
          </p>
        </div>

        {/* TEXT OVERLAY 2 */}
        <div className="absolute top-[55%] right-20 z-10 text-right">
          <h2 className="text-6xl font-bold">
            Motion
          </h2>

          <p className="mt-6 max-w-md text-white/70">
            Smooth transitions powered by GSAP and Three.js.
          </p>
        </div>

      </section>

      {/* FINAL SECTION */}
      <section className="h-screen flex items-center justify-center">
        <h2 className="text-6xl font-bold">
          The End
        </h2>
      </section>

    </main>
  )
}