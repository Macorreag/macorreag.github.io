import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faPhone,
  faEnvelope,
  faShieldHalved,
  faMicrochip,
  faServer,
  faCloudBolt,
  faUserSecret,
} from '@fortawesome/free-solid-svg-icons';
import { faReact, faNodeJs, faAws } from '@fortawesome/free-brands-svg-icons';

const GITHUB_AVATAR = 'https://github.com/macorreag.png';

export default () => (
  <div className="dark">
    <style
      dangerouslySetInnerHTML={{
        __html: `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
      
      body {
          font-family: 'Space Grotesk', sans-serif;
      }
      
      .slate-border {
          border: 1px solid rgba(0, 255, 65, 0.5);
      }
      
      .slate-glow {
          box-shadow: 0 0 25px rgba(0, 255, 65, 0.4), 0 0 40px rgba(0, 255, 65, 0.2);
      }
      
      .slate-glow-intense {
          box-shadow: 0 0 40px rgba(0, 255, 65, 0.6), 0 0 60px rgba(0, 255, 65, 0.35), inset 0 0 20px rgba(0, 255, 65, 0.1);
      }
      
      .hero-gradient {
          background: radial-gradient(circle at 70% 30%, rgba(0, 255, 65, 0.08), transparent 50%),
                      radial-gradient(circle at 30% 70%, rgba(15, 23, 42, 1), transparent 50%);
          background-color: #020617;
      }
      
      .neo-scanline {
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 255, 65, 0.02) 50%);
          background-size: 100% 4px;
      }
    `,
      }}
    />

    <div
      className="relative min-h-screen flex flex-col bg-[#000409] font-display text-white selection:bg-[#00FF41]/30 antialiased hero-gradient neo-scanline"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Main Content */}
      <main className="flex-grow flex items-center pt-10">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-20 pb-14">
          {/* Content */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div
                className="flex items-center gap-3"
                style={{ color: '#00FF41', textShadow: '0 0 10px rgba(0, 255, 65, 0.6)' }}
              >
                <span
                  className="h-px w-12"
                  style={{
                    backgroundColor: '#00FF41',
                    boxShadow: '0 0 10px rgba(0, 255, 65, 0.8)',
                  }}
                ></span>
                <span className="text-xs font-bold uppercase tracking-[0.4em]">
                  Senior Systems Architect
                </span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-bold leading-[0.9] tracking-tighter">
                Miller{' '}
                <span
                  style={{
                    color: '#00FF41',
                    textShadow: '0 0 20px rgba(0, 255, 65, 0.8), 0 0 40px rgba(0, 255, 65, 0.4)',
                  }}
                >
                  Correa
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
              Specializing in high-performance distributed systems and neo-cybernetic web
              interfaces. Crafting clean code in a neon world through precision engineering and
              minimalist design.
            </p>

            <div className="flex items-center gap-6 mt-2">
              <a
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-500 hover:text-[#00FF41] transition-colors"
                href="tel:+573210000000"
              >
                <FontAwesomeIcon icon={faPhone} className="text-[#00FF41] text-[10px]" />{' '}
                647-621-2486
              </a>
              <a
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-500 hover:text-[#00FF41] transition-colors"
                href="mailto:hrshtpnt@gmail.com"
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-[#00FF41] text-[10px]" />{' '}
                hrshtpnt@gmail.com
              </a>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="px-8 py-4 text-[#020617] font-bold rounded-sm slate-glow-intense hover:translate-y-[-2px] transition-all flex items-center gap-3 group uppercase text-sm tracking-widest"
                style={{ backgroundColor: '#00FF41' }}
              >
                Explore Repository
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                className="px-8 py-4 border font-bold rounded-sm hover:bg-[#00FF41]/10 transition-all uppercase text-sm tracking-widest bg-transparent"
                style={{
                  borderColor: 'rgba(0, 255, 65, 0.5)',
                  color: '#00FF41',
                  textShadow: '0 0 8px rgba(0, 255, 65, 0.5)',
                }}
              >
                Technical Bio
              </button>
            </div>

            <div
              className="grid grid-cols-3 gap-8 pt-12 border-t"
              style={{ borderColor: 'rgba(0, 255, 65, 0.2)' }}
            >
              <div>
                <div
                  className="text-3xl font-bold tracking-tighter"
                  style={{ color: '#00FF41', textShadow: '0 0 15px rgba(0, 255, 65, 0.6)' }}
                >
                  08<span style={{ textShadow: '0 0 10px rgba(0, 255, 65, 0.8)' }}>+</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                  Years XP
                </div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold tracking-tighter"
                  style={{ color: '#00FF41', textShadow: '0 0 15px rgba(0, 255, 65, 0.6)' }}
                >
                  42<span style={{ textShadow: '0 0 10px rgba(0, 255, 65, 0.8)' }}>+</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                  Deployments
                </div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold tracking-tighter"
                  style={{ color: '#00FF41', textShadow: '0 0 15px rgba(0, 255, 65, 0.6)' }}
                >
                  2.4k
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                  Commits/YR
                </div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="lg:col-span-5 relative">
            <div
              className="absolute inset-0 rounded-full blur-[40px] animate-pulse z-0"
              style={{
                backgroundColor: 'rgba(0, 255, 65, 0.35)',
                boxShadow: '0 0 60px rgba(0, 255, 65, 0.4)',
              }}
            ></div>
            <div
              className="relative z-10 aspect-square overflow-hidden shadow-2xl group slate-glow rounded-full"
              style={{
                border: '2px solid rgba(0, 255, 65, 0.6)',
                boxShadow: '0 0 30px rgba(0, 255, 65, 0.5)',
              }}
            >
              <div
                className="absolute inset-0 mix-blend-overlay group-hover:bg-transparent transition-colors"
                style={{ backgroundColor: 'rgba(0, 255, 65, 0.15)' }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent z-10"
                style={{
                  backgroundImage: 'linear-gradient(to top, rgba(2, 6, 23, 0.9), transparent)',
                }}
              ></div>
              <img
                alt="Miller Correa - Holographic Profile"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 rounded-full"
                src={GITHUB_AVATAR}
              />

              {/* Internal Image Badges */}
              <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 px-4 py-2 border rounded-full"
                style={{
                  backgroundColor: 'rgba(2, 6, 23, 0.95)',
                  borderColor: 'rgba(0, 255, 65, 0.4)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: '#00FF41',
                      boxShadow: '0 0 8px rgba(0, 255, 65, 0.8)',
                    }}
                  ></span>
                  <span
                    className="text-[10px] font-bold tracking-[0.3em] uppercase"
                    style={{ color: '#00FF41', textShadow: '0 0 10px rgba(0, 255, 65, 0.7)' }}
                  >
                    AI Software
                  </span>
                </div>
                <span
                  className="text-[8px] tracking-[0.2em] uppercase whitespace-nowrap"
                  style={{ color: 'rgba(0, 255, 65, 0.6)' }}
                >
                  Building Big Ideas
                </span>
              </div>
            </div>

            {/* System Verified Badge - Overlay flotante */}
            <div
              className="absolute z-20 p-3 rounded-lg border backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(0, 255, 65, 0.6)',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.4), 0 0 40px rgba(0, 255, 65, 0.15)',
                bottom: '12%',
                right: '5%',
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="p-2 rounded-sm"
                  style={{
                    backgroundColor: 'rgba(0, 255, 65, 0.2)',
                    color: '#00FF41',
                    boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
                  }}
                >
                  <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                </div>
                <div>
                  <h4
                    className="font-bold text-[9px] uppercase tracking-wider leading-tight"
                    style={{ color: '#00FF41', textShadow: '0 0 8px rgba(0, 255, 65, 0.6)' }}
                  >
                    System
                    <br />
                    Verified
                  </h4>
                  <p className="text-[8px]" style={{ color: 'rgba(0, 255, 65, 0.6)' }}>
                    Lead Protocol
                  </p>
                </div>
              </div>
            </div>

            {/* Background Glows */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 blur-[100px] rounded-full"
              style={{
                backgroundColor: 'rgba(0, 255, 65, 0.12)',
                boxShadow: '0 0 80px rgba(0, 255, 65, 0.3)',
              }}
            ></div>
            <div
              className="absolute -bottom-20 -left-20 w-80 h-80 blur-[120px] rounded-full"
              style={{
                backgroundColor: 'rgba(0, 255, 65, 0.12)',
                boxShadow: '0 0 100px rgba(0, 255, 65, 0.25)',
              }}
            ></div>
          </div>
        </div>
      </main>

      {/* Technical Expertise Row */}
      <section className="max-w-7xl mx-auto px-6 w-full -mt-4 pb-40 relative z-10">
        <div className="flex flex-wrap justify-center gap-4">
          {/* Frontend Badge */}
          <div
            className="px-4 py-3 border hover:bg-[#00FF41]/8 transition-all flex items-center gap-3 group"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(0, 255, 65, 0.5)',
              boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)',
            }}
          >
            <FontAwesomeIcon
              icon={faMicrochip}
              className="text-sm"
              style={{ color: '#00FF41', textShadow: '0 0 6px rgba(0, 255, 65, 0.8)' }}
            />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">
              Frontend Arch
            </span>
          </div>

          {/* React Badge */}
          <div
            className="px-4 py-3 border hover:bg-[#00FF41]/8 transition-all flex items-center gap-3 group"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(0, 255, 65, 0.5)',
              boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)',
            }}
          >
            <FontAwesomeIcon
              icon={faReact}
              className="text-sm"
              style={{ color: '#00FF41', textShadow: '0 0 6px rgba(0, 255, 65, 0.8)' }}
            />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">
              React.js
            </span>
          </div>

          {/* Backend Badge */}
          <div
            className="px-4 py-3 border hover:bg-[#00FF41]/8 transition-all flex items-center gap-3 group"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(0, 255, 65, 0.5)',
              boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)',
            }}
          >
            <FontAwesomeIcon
              icon={faServer}
              className="text-sm"
              style={{ color: '#00FF41', textShadow: '0 0 6px rgba(0, 255, 65, 0.8)' }}
            />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">
              Backend Core
            </span>
          </div>

          {/* Node Badge */}
          <div
            className="px-4 py-3 border hover:bg-[#00FF41]/8 transition-all flex items-center gap-3 group"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(0, 255, 65, 0.5)',
              boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)',
            }}
          >
            <FontAwesomeIcon
              icon={faNodeJs}
              className="text-sm"
              style={{ color: '#00FF41', textShadow: '0 0 6px rgba(0, 255, 65, 0.8)' }}
            />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">
              Node.js
            </span>
          </div>

          {/* Cloud Badge */}
          <div
            className="px-4 py-3 border hover:bg-[#00FF41]/8 transition-all flex items-center gap-3 group"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(0, 255, 65, 0.5)',
              boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)',
            }}
          >
            <FontAwesomeIcon
              icon={faCloudBolt}
              className="text-sm"
              style={{ color: '#00FF41', textShadow: '0 0 6px rgba(0, 255, 65, 0.8)' }}
            />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">
              Cloud Infra
            </span>
          </div>

          {/* AWS Badge */}
          <div
            className="px-4 py-3 border hover:bg-[#00FF41]/8 transition-all flex items-center gap-3 group"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(0, 255, 65, 0.5)',
              boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)',
            }}
          >
            <FontAwesomeIcon
              icon={faAws}
              className="text-sm"
              style={{ color: '#00FF41', textShadow: '0 0 6px rgba(0, 255, 65, 0.8)' }}
            />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">
              AWS/K8s
            </span>
          </div>

          {/* Cybersecurity Badge */}
          <div
            className="px-4 py-3 border hover:bg-[#00FF41]/8 transition-all flex items-center gap-3 group"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(0, 255, 65, 0.5)',
              boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)',
            }}
          >
            <FontAwesomeIcon
              icon={faUserSecret}
              className="text-sm"
              style={{ color: '#00FF41', textShadow: '0 0 6px rgba(0, 255, 65, 0.8)' }}
            />
            <span className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">
              Cybersecurity
            </span>
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50">
        <span
          className="text-[9px] uppercase tracking-[0.5em] font-bold"
          style={{ color: 'rgba(0, 255, 65, 0.5)' }}
        >
          Initiating Scroll Sequence
        </span>
        <div
          className="w-px h-12"
          style={{
            background: 'linear-gradient(to bottom, #00FF41, transparent)',
            opacity: 0.8,
            boxShadow: '0 0 10px rgba(0, 255, 65, 0.6)',
          }}
        ></div>
      </div>
    </div>
  </div>
);
