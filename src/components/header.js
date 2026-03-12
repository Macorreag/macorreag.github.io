import React from 'react';
import Form from './contact.form';

const GITHUB_AVATAR = 'https://github.com/macorreag.png';

export default () => (
  <header
    className="w-full relative overflow-hidden"
    style={{ backgroundColor: '#0d0d14', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
  >
    {/* Grid background */}
    <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-30" />

    {/* Corner decorations */}
    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60 z-30" />
    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-teal/60 z-30" />
    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-teal/60 z-30" />
    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/60 z-30" />

    <div className="relative z-20 max-w-6xl mx-auto px-4 pt-8">
      {/* Terminal window card */}
      <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
        {/* Terminal title bar */}
        <div className="border-b border-white/10 px-4 py-2 flex justify-between items-center bg-black/20">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-teal/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          </div>
          <span
            className="text-xs font-bold font-mono uppercase tracking-widest hidden sm:block"
            style={{ color: 'rgba(0, 245, 255, 0.5)' }}
          >
            macorreag@portfolio:~$ whoami
          </span>
        </div>

        {/* Main content */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          {/* Profile image + status */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <div
                className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden"
                style={{
                  border: '2px solid rgba(255, 111, 97, 0.5)',
                  boxShadow: '0 0 20px rgba(255, 111, 97, 0.2)',
                }}
              >
                <img
                  src={GITHUB_AVATAR}
                  alt="Miller Correa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap font-mono">
                DEV
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-500 font-mono uppercase tracking-widest">Online</span>
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <h1 className="font-display text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-1">
              Miller Correa
            </h1>
            <p className="text-primary font-mono text-xs md:text-sm tracking-widest uppercase mb-4 font-bold">
              {'// FULL_STACK_DEVELOPER & AI_ENGINEER'}
            </p>
            <p className="text-white/60 text-sm leading-relaxed font-mono mb-6 max-w-lg">
              Desarrollador Full Stack con experiencia en arquitectura de microservicios, IA aplicada y
              sistemas distribuidos. Apasionado por construir soluciones escalables con impacto real.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-4 text-xs font-mono mb-6">
              <a
                href="https://github.com/macorreag"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white/40 hover:text-teal transition-colors"
              >
                <span className="text-teal">{'{ '}</span>
                github.com/macorreag
                <span className="text-teal">{' }'}</span>
              </a>
              <span className="flex items-center gap-1 text-white/40">
                <span className="text-primary">#</span> Colombia, CO
              </span>
            </div>

            {/* Contact form */}
            <Form />
          </div>
        </div>
      </div>
    </div>

    {/* Status bar */}
    <div className="relative z-20 border-t border-white/10 px-4 py-2 mt-8 bg-black/40 flex justify-between items-center">
      <div className="text-xs text-teal font-mono flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-teal rounded-full animate-pulse shadow-[0_0_6px_#00f5ff]" />
        SYSTEM: ACTIVE_SESSION
      </div>
      <div className="text-xs text-primary/60 font-mono">PORTFOLIO_v2.0</div>
    </div>
  </header>
);
