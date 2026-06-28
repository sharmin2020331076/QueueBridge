'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Users, Clock, CircleCheck as CheckCircle, Monitor, ChartBar as BarChart3, Zap, Shield, Menu, X } from 'lucide-react'
import Lenis from "lenis";

/*
  DESIGN SYSTEM — locked tokens (unchanged from original)
  ────────────────────────────────────────────────────────
  Dark bg:      #0a0a0a
  Section bg:   #ffffff
  Tinted bg:    #f7faf8 / #f0fdf4
  Emerald:      #10b981  (ONE shade)
  Emerald dark: #059669
  Dot grid:     #d1d5db dots, 1.5px, 22px grid
  Shadows:      0 8px 32px -8px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)

  IMPROVEMENTS OVER ORIGINAL:
  1. Hero stats card — animated token ticker + live throughput bars
  2. Marquee — styled pill badges instead of plain text
  3. Features — staggered fade-up on scroll, accent glow on dark card
  4. How It Works — animated step connector line fill on scroll
  5. Analytics card — animated bar chart and progress bars on scroll
  6. All sections — scroll-triggered fade-up via IntersectionObserver
  7. Section spacing rhythmically varied (some tight, some open)
  8. Hover states enriched on feature cards
*/

const DOT_GRID = {
  backgroundImage: 'radial-gradient(circle, #d1d5db 1.5px, transparent 1.5px)',
  backgroundSize: '22px 22px',
} as const

const CARD_SHADOW = '0 8px 32px -8px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)'

/* ── Scroll-reveal hook ── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ── Animated hero stats card ── */
function HeroStatsCard() {
  const tokens = ['A-044', 'A-045', 'A-046', 'A-047']
  const [tokenIdx, setTokenIdx] = useState(3)
  const [waiting, setWaiting] = useState(12)
  const [served, setServed] = useState(47)
  const [bars, setBars] = useState([40,65,50,80,60,90,75,85,70,95])
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true)
      setTimeout(() => {
        setTokenIdx(i => (i + 1) % tokens.length)
        setWaiting(w => Math.max(8, w + (Math.random() > 0.5 ? 1 : -1)))
        setServed(s => s + 1)
        setBars(prev => {
          const next = [...prev.slice(1), Math.floor(Math.random() * 55) + 40]
          return next
        })
        setFlash(false)
      }, 180)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="lg:col-span-2 relative">
      <div className="absolute pointer-events-none" style={{
        inset: '-10px', borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(209,250,229,0.08) 60%, transparent 100%)',
        filter: 'blur(10px)',
      }} />
      <div
        className="relative bg-white border border-neutral-200 rounded-xl p-8 border-l-4 border-l-gray-500/80"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Live Stats</span>
          <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#10b981' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
            Active
          </span>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-neutral-400 mb-1">Currently serving</p>
            <span
              className="text-5xl font-mono font-bold tracking-tight text-neutral-900 transition-all duration-150"
              style={{ opacity: flash ? 0.3 : 1, transform: flash ? 'translateY(-4px)' : 'translateY(0)' }}
            >
              {tokens[tokenIdx]}
            </span>
          </div>
          <div className="flex items-end gap-1 h-8">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all duration-700"
                style={{
                  height: `${h}%`,
                  background: i >= bars.length - 3 ? '#10b981' : '#e5e7eb',
                  opacity: i >= bars.length - 3 ? 0.85 : 1,
                }}
              />
            ))}
          </div>
          <p className="text-[10px] text-neutral-400 -mt-4">Throughput today</p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
            <div>
              <p className="text-xs text-neutral-400 mb-1">Waiting</p>
              <p className="text-2xl font-semibold font-mono transition-all duration-300">{waiting}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-1">Avg Wait</p>
              <p className="text-2xl font-semibold font-mono">8<span className="text-sm font-normal text-neutral-400">m</span></p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-1">Served</p>
              <p className="text-2xl font-semibold font-mono transition-all duration-300">{served}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Animated analytics card ── */
function AnalyticsCard() {
  const { ref, visible } = useScrollReveal(0.2)
  const barHeights = [20, 35, 55, 70, 90, 85, 60, 45, 30, 20, 15, 10]

  return (
    <div ref={ref} className="order-2 lg:order-1">
      <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #e5e7eb', boxShadow: CARD_SHADOW }}>
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-medium">Daily Analytics</h4>
          <span className="text-xs text-neutral-400">Today</span>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-500">Completion rate</span>
              <span className="font-medium">87%</span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ background: '#10b981', width: visible ? '87%' : '0%' }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-500">No-show rate</span>
              <span className="font-medium text-rose-500">8%</span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out delay-150"
                style={{ width: visible ? '8%' : '0%' }}
              />
            </div>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-2">Hourly traffic</p>
            <div className="flex items-end gap-1 h-12">
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all ease-out"
                  style={{
                    height: visible ? `${h}%` : '0%',
                    background: i === 4 ? '#10b981' : '#e5e7eb',
                    transitionDuration: `${600 + i * 60}ms`,
                    transitionDelay: visible ? `${i * 40}ms` : '0ms',
                  }}
                  title={`${8 + i}:00`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>8:00</span><span>Peak 13:00</span><span>20:00</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
            <div><p className="text-xs text-neutral-400 mb-1">Peak Hour</p><p className="text-xl font-semibold font-mono">13:00</p></div>
            <div><p className="text-xs text-neutral-400 mb-1">Avg Wait</p><p className="text-xl font-semibold font-mono">12 <span className="text-sm font-normal text-neutral-400">min</span></p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Fade-up wrapper ── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ── How it works — animated connector ── */
function HowItWorksFlow() {
  const { ref, visible } = useScrollReveal(0.2)

  return (
    <div ref={ref} className="relative">
      <div
        className="bg-white rounded-2xl p-8 overflow-hidden"
        style={{ border: '1px solid #d1fae5', boxShadow: CARD_SHADOW }}
      >
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-8">Flow overview</p>
        <div className="flex flex-col">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0 transition-all duration-500"
                style={{ boxShadow: visible ? '0 0 0 4px rgba(16,185,129,0.15)' : 'none' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {/* Animated connector line */}
              <div className="w-px my-2 overflow-hidden" style={{ minHeight: '36px', background: '#f0fdf4' }}>
                <div
                  className="w-full transition-all duration-700 delay-300"
                  style={{ height: visible ? '100%' : '0%', background: '#10b981', minHeight: '36px' }}
                />
              </div>
            </div>
            <div
              className="pb-10 pt-1.5 transition-all duration-500"
              style={{ opacity: visible ? 1 : 0.3, transitionDelay: '100ms' }}
            >
              <p className="text-sm font-medium text-neutral-900 mb-1">Set up your office</p>
              <p className="text-xs text-neutral-400">Add services, time slots & counters</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-500 delay-300"
                style={{
                  background: visible ? '#fff' : '#f3f4f6',
                  borderColor: visible ? '#10b981' : '#e5e7eb',
                  boxShadow: visible ? '0 0 0 4px rgba(16,185,129,0.1)' : 'none',
                }}
              >
                <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div className="w-px my-2 overflow-hidden" style={{ minHeight: '36px', background: '#f0fdf4' }}>
                <div
                  className="w-full transition-all duration-700"
                  style={{ height: visible ? '100%' : '0%', background: '#10b981', minHeight: '36px', transitionDelay: '500ms' }}
                />
              </div>
            </div>
            <div
              className="pb-10 pt-1.5 transition-all duration-500"
              style={{ opacity: visible ? 1 : 0.3, transitionDelay: '350ms' }}
            >
              <p className="text-sm font-medium text-neutral-900 mb-1">Citizens book & get tokens</p>
              <p className="text-xs text-neutral-400">Online booking or walk-in, instant QR ticket</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 delay-700"
                style={{
                  background: visible ? '#10b981' : '#d1d5db',
                  boxShadow: visible ? '0 0 0 4px rgba(16,185,129,0.2)' : 'none',
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <div
              className="pt-1.5 transition-all duration-500"
              style={{ opacity: visible ? 1 : 0.3, transitionDelay: '600ms' }}
            >
              <p className="text-sm font-medium text-neutral-900 mb-1">Manage & complete</p>
              <p className="text-xs text-neutral-400">Call next, track analytics, done</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-700"
              style={{ background: '#10b981', boxShadow: visible ? '0 0 12px rgba(16,185,129,0.4)' : 'none' }}
            >
              <span className="text-white text-xs font-mono font-bold">A</span>
            </div>
            <div>
              <p className="text-xs font-mono font-semibold text-neutral-900">A-047</p>
              <p className="text-[10px] text-neutral-400">Now serving</p>
            </div>
          </div>
          <span className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ color: '#059669', background: '#d1fae5' }}>Active</span>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-neutral-900 antialiased">

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-neutral-900 rounded-md flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="text-lg font-semibold text-neutral-900">QueueBridge</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">How it works</Link>
            <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Admin</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/citizen" className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 transition-colors">
              Book Appointment
            </Link>
            <button
              className="md:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-4 flex flex-col gap-4">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors py-1">Features</Link>
            <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors py-1">How it works</Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors py-1">Admin</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            ...DOT_GRID,
            maskImage: 'radial-gradient(ellipse 60% 80% at 82% 50%, black 10%, transparent 68%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 80% at 82% 50%, black 10%, transparent 68%)',
          }}
        />
        <div className="absolute pointer-events-none" style={{
          top: '-60px', right: '-60px',
          width: '440px', height: '440px', borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.06) 45%, transparent 70%)',
          filter: 'blur(32px)',
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-3 space-y-8">
              <div
                className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider"
                style={{ animation: 'fadeUp 0.5s ease both' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Queue Management System
              </div>
              <h1
                className="text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]"
                style={{ animation: 'fadeUp 0.5s ease 80ms both' }}
              >
                Stop the chaos in your{' '}
                <span className="text-neutral-400 italic">waiting room.</span>
              </h1>
              <p
                className="text-lg text-neutral-500 max-w-lg leading-relaxed"
                style={{ animation: 'fadeUp 0.5s ease 160ms both' }}
              >
                A minimal, powerful queue management system for offices and healthcare facilities.
                Real-time tracking, instant notifications, zero friction.
              </p>
              <div
                className="flex items-center gap-4 pt-4"
                style={{ animation: 'fadeUp 0.5s ease 240ms both' }}
              >
                <Link href="/admin" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-medium rounded-md hover:bg-neutral-800 transition-colors group">
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-3 text-neutral-600 font-medium hover:text-neutral-900 transition-colors">
                  See how it works
                </Link>
              </div>
              <div
                className="flex flex-wrap items-center gap-6 pt-4 text-sm text-neutral-400"
                style={{ animation: 'fadeUp 0.5s ease 320ms both' }}
              >
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /><span>Free tier available</span></div>
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /><span>Setup in minutes</span></div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-500" /><span>Trusted by 500+ offices</span></div>
              </div>
            </div>

            {/* Animated stats card */}
            <HeroStatsCard />
          </div>
        </div>
      </section>

      {/* ── MARQUEE — styled pill badges ── */}
      <section className="py-12 border-y border-neutral-100 overflow-hidden relative" style={{ background: '#f9fafb' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ ...DOT_GRID, opacity: 0.35 }} />
        <p className="text-center text-xs font-medium text-neutral-400 uppercase tracking-widest mb-6 relative z-10">Trusted by modern offices</p>
        <div className="relative z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10" style={{ background: 'linear-gradient(to right, #f9fafb, transparent)' }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10" style={{ background: 'linear-gradient(to left, #f9fafb, transparent)' }} />
          <div className="animate-marquee">
            {[...Array(4)].map((_, si) => (
              <div key={si} className="flex items-center" aria-hidden={si > 0}>
                {['City Health', 'Metro Services', 'QuickCare', 'OfficeHub', 'FastTrack', 'MediCore', 'CivicPlus', 'SwiftLine'].map((name, i) => (
                  <span key={`${si}-${i}`} className="inline-flex items-center gap-6 px-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-neutral-500 bg-white border border-neutral-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                      {name}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none" style={{
          ...DOT_GRID,
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 50%, black 20%, transparent 75%)',
          opacity: 0.7,
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Everything you need</h2>
            <p className="text-neutral-500 max-w-lg mx-auto">Simple tools that work together seamlessly. No bloat, no learning curve.</p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-4">

            {/* ── DISPLAY BOARD — dark card, overlapping screen rectangles ── */}
            <FadeUp className="md:col-span-2" delay={0}>
              <div
                className="text-white rounded-2xl p-8 md:p-10 group hover:brightness-110 transition-all duration-300 min-h-[300px] flex flex-col justify-between relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 60%, #0d2016 100%)',
                  boxShadow: '0 16px 48px -12px rgba(0,0,0,0.30), 0 4px 12px -4px rgba(0,0,0,0.18)',
                }}
              >
                {/* Abstract shape — stacked display screens (rectangles at angles) */}
                <svg className="absolute right-0 bottom-0 pointer-events-none" width="220" height="200" viewBox="0 0 220 200" fill="none" aria-hidden="true">
                  {/* back screen */}
                  <rect x="60" y="30" width="130" height="90" rx="10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" transform="rotate(-8 125 75)" />
                  {/* mid screen */}
                  <rect x="40" y="55" width="130" height="90" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" transform="rotate(-4 105 100)" />
                  {/* front screen — emerald tint */}
                  <rect x="20" y="80" width="130" height="90" rx="10" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" />
                  {/* screen content lines */}
                  <rect x="36" y="102" width="60" height="5" rx="2.5" fill="rgba(16,185,129,0.4)" />
                  <rect x="36" y="114" width="40" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
                  <rect x="36" y="124" width="50" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
                  {/* token number suggestion */}
                  <rect x="36" y="138" width="32" height="20" rx="4" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
                </svg>
                {/* Dot grid overlay */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" style={{ ...DOT_GRID, opacity: 0.07 }} />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 uppercase tracking-wider mb-6">
                    <Monitor className="w-3.5 h-3.5" />Display Board
                  </div>
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-3">Put up a display. Done.</h3>
                  <p className="text-neutral-400 max-w-sm leading-relaxed">
                    A beautiful, auto-updating display board for your waiting area.
                    Shows who's being served, estimated wait times, and keeps everyone informed.
                  </p>
                </div>
                <Link href="/admin/display-board" className="relative inline-flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors group mt-6">
                  View Display Board <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </FadeUp>

            {/* ── BOOKING — emerald card, concentric arcs (token ticket shape) ── */}
            <FadeUp delay={80}>
              <div
                className="rounded-2xl p-8 min-h-[300px] flex flex-col justify-between group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #f0fdf6 0%, #dcfce7 100%)',
                  border: '1px solid #bbf7d0',
                  boxShadow: '0 4px 20px -4px rgba(16,185,129,0.18), 0 1px 4px -1px rgba(16,185,129,0.10)',
                }}
              >
                {/* Abstract shape — concentric quarter-circles (ticket/token) */}
                <svg className="absolute right-0 bottom-0 pointer-events-none" width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
                  <circle cx="150" cy="150" r="55" fill="none" stroke="rgba(16,185,129,0.18)" strokeWidth="1.5" />
                  <circle cx="150" cy="150" r="80" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="1.5" />
                  <circle cx="150" cy="150" r="108" fill="none" stroke="rgba(16,185,129,0.07)" strokeWidth="1.5" />
                  <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(16,185,129,0.04)" strokeWidth="1.5" />
                  {/* solid inner filled circle */}
                  <circle cx="150" cy="150" r="30" fill="rgba(16,185,129,0.15)" />
                </svg>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider mb-6" style={{ color: '#059669' }}>
                    <Users className="w-3.5 h-3.5" />Booking
                  </div>
                  <h3 className="text-xl font-medium tracking-tight mb-3 text-neutral-900">Simple booking flow</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#065f46' }}>
                    Citizens book in under a minute. Get a unique token, track position in real-time.
                  </p>
                </div>
                <Link href="/citizen" className="relative inline-flex items-center gap-2 text-sm font-medium transition-colors group-hover:gap-3 mt-6" style={{ color: '#059669' }}>
                  Try booking <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </FadeUp>

            {/* ── REAL-TIME — ripple/wave rings ── */}
            <FadeUp delay={0}>
              <div
                className="rounded-2xl p-8 min-h-[220px] flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group relative overflow-hidden"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.07)' }}
              >
                {/* Abstract shape — signal ripple (wifi/broadcast rings) */}
                <svg className="absolute right-0 bottom-0 pointer-events-none" width="120" height="110" viewBox="0 0 120 110" fill="none" aria-hidden="true">
                  <circle cx="110" cy="100" r="30" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
                  <circle cx="110" cy="100" r="50" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
                  <circle cx="110" cy="100" r="72" fill="none" stroke="#f3f4f6" strokeWidth="1.5" />
                  <circle cx="110" cy="100" r="12" fill="#e5e7eb" />
                  <circle cx="110" cy="100" r="5" fill="#9ca3af" />
                </svg>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4"><Zap className="w-3.5 h-3.5" />Real-time</div>
                  <h3 className="text-lg font-medium tracking-tight mb-2">Instant updates</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">WebSocket-powered live tracking. Know immediately when it's your turn.</p>
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-neutral-200 w-fit">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                    <span className="text-xs font-mono text-neutral-600">&lt; 200ms latency</span>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* ── ETA — hourglass / flowing diamond shapes ── */}
            <FadeUp delay={80}>
              <div
                className="rounded-2xl p-8 min-h-[220px] flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group relative overflow-hidden"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.07)' }}
              >
                {/* Abstract shape — stacked rotated squares (hourglass/time) */}
                <svg className="absolute right-0 bottom-0 pointer-events-none" width="120" height="110" viewBox="0 0 120 110" fill="none" aria-hidden="true">
                  <rect x="68" y="48" width="44" height="44" rx="8" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1.5" transform="rotate(20 90 70)" />
                  <rect x="80" y="58" width="44" height="44" rx="8" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" transform="rotate(20 102 80)" />
                  <rect x="92" y="68" width="44" height="44" rx="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1" transform="rotate(20 114 90)" />
                </svg>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4"><Clock className="w-3.5 h-3.5" />ETA Estimates</div>
                  <h3 className="text-lg font-medium tracking-tight mb-2">Accurate wait times</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">Smart algorithms calculate wait times based on actual service duration.</p>
                </div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold font-mono text-neutral-800">~8</span>
                  <span className="text-sm text-neutral-400">min avg error</span>
                </div>
              </div>
            </FadeUp>

            {/* ── SECURE — interlocking shield/lock hexagons ── */}
            <FadeUp delay={160}>
              <div
                className="rounded-2xl p-8 min-h-[220px] flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group relative overflow-hidden"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.07)' }}
              >
                {/* Abstract shape — overlapping hexagons (security/honeycomb) */}
                <svg className="absolute right-0 bottom-0 pointer-events-none" width="130" height="120" viewBox="0 0 130 120" fill="none" aria-hidden="true">
                  {/* hex 1 */}
                  <polygon points="95,10 115,22 115,46 95,58 75,46 75,22" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="1.5" />
                  {/* hex 2 — shifted down-left */}
                  <polygon points="75,42 95,54 95,78 75,90 55,78 55,54" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
                  {/* hex 3 — shifted down-right */}
                  <polygon points="115,42 135,54 135,78 115,90 95,78 95,54" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
                  {/* center dot */}
                  <circle cx="95" cy="66" r="5" fill="#9ca3af" />
                </svg>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4"><Shield className="w-3.5 h-3.5" />Secure</div>
                  <h3 className="text-lg font-medium tracking-tight mb-2">Data safe</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">End-to-end encryption, secure tokens, and privacy-first design.</p>
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-neutral-200 w-fit">
                    <Shield className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                    <span className="text-xs font-medium text-neutral-600">99.9% uptime SLA</span>
                  </div>
                </div>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden" style={{ background: '#f0fdf4' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #bbf7d0 1.5px, transparent 1.5px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 20%, transparent 80%)',
        }} />
        <div className="absolute pointer-events-none" style={{
          right: '-80px', top: '50%', transform: 'translateY(-50%)',
          width: '480px', height: '480px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 65%)',
          filter: 'blur(48px)',
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <span className="text-xs font-medium uppercase tracking-wider mb-4 block" style={{ color: '#10b981' }}>How it works</span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-neutral-900">
                Three steps to an organized queue
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-8">
                Get started in minutes. No complex setup, no training required. Your staff and citizens will thank you.
              </p>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Set up your office', desc: 'Add services, time slots, and counters in the admin dashboard.' },
                  { step: '02', title: 'Share the booking link', desc: 'Citizens can book online or walk-in and get a token instantly.' },
                  { step: '03', title: 'Manage the queue', desc: 'Call next, mark complete, view analytics. Rinse, repeat.' },
                ].map((item, i) => (
                  <div key={item.step} className="flex gap-6 items-start group">
                    <span
                      className="text-sm font-mono font-bold mt-0.5 w-6 shrink-0 transition-colors"
                      style={{ color: '#10b981' }}
                    >{item.step}</span>
                    <div>
                      <h4 className="font-medium mb-1 text-neutral-900">{item.title}</h4>
                      <p className="text-sm text-neutral-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Animated flow diagram */}
            <HowItWorksFlow />
          </div>
        </div>
      </section>

      {/* ── ANALYTICS ── */}
      <section className="py-24 px-6 relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none" style={{
          ...DOT_GRID,
          maskImage: 'radial-gradient(ellipse 55% 75% at 18% 55%, black 10%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(ellipse 55% 75% at 18% 55%, black 10%, transparent 68%)',
          opacity: 0.7,
        }} />
        <div className="absolute pointer-events-none" style={{
          left: '-60px', top: '50%', transform: 'translateY(-50%)',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Animated analytics card */}
            <AnalyticsCard />

            <FadeUp className="order-1 lg:order-2" delay={100}>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
                <BarChart3 className="w-3.5 h-3.5" />Analytics
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">Understand your operations</h2>
              <p className="text-neutral-500 leading-relaxed mb-8">
                Built-in analytics help you understand peak hours, track average wait times,
                and identify opportunities to improve efficiency.
              </p>
              <ul className="space-y-3">
                {[
                  'Identify peak hours for better staffing',
                  'Track real-time wait vs. service goals',
                  'Monitor and reduce no-show rates',
                  'Export reports for management review',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#10b981' }} />
                    <span className="text-neutral-600">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 80% 90% at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 50% 50%, black 30%, transparent 80%)',
        }} />
        <div className="absolute pointer-events-none" style={{
          top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '640px', height: '380px',
          background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.32) 0%, rgba(16,185,129,0.10) 45%, transparent 70%)',
          filter: 'blur(28px)',
        }} />

        <FadeUp className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider mb-6" style={{ color: '#10b981' }}>
            <Users className="w-3.5 h-3.5" />500+ offices already on board
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Ready to streamline your queue?
          </h2>
          <p className="mb-10 max-w-lg mx-auto" style={{ color: '#9ca3af' }}>
            Start managing your queue in minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/admin" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-neutral-900 font-medium rounded-md hover:bg-neutral-100 transition-colors group">
              Open Dashboard <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/citizen" className="inline-flex items-center gap-2 px-8 py-3.5 font-medium hover:text-white transition-colors" style={{ color: '#9ca3af' }}>
              Try booking flow
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs" style={{ color: '#6b7280' }}>
            {['No credit card', 'Free tier forever', 'Setup in 5 minutes'].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10b981' }} />{t}
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-neutral-900 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Q</span>
                </div>
                <span className="font-semibold text-neutral-900">QueueBridge</span>
              </Link>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
                Modern queue management for offices and healthcare facilities. Built for speed, designed for simplicity.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/citizen" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Citizen Booking</Link></li>
                <li><Link href="/admin" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Admin Dashboard</Link></li>
                <li><Link href="/admin/display-board" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Display Board</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">Use Cases</h4>
              <ul className="space-y-2">
                {['Healthcare Clinics', 'Government Offices', 'Banks & Finance', 'Service Centers'].map(t => (
                  <li key={t}><span className="text-sm text-neutral-600">{t}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">© 2026 QueueBridge. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Privacy</Link>
              <Link href="#" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── GLOBAL STYLES ── */}
      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }

        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </main>
  )
}
