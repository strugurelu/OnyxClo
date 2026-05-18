import { motion, useInView } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

const targetDate = new Date(new Date().getFullYear(), 6, 30, 23, 59, 59)

const apparelCards = [
  { title: 'SHELL JACKET // 01', subtitle: 'WATERPROOF - MATTE BLACK' },
  { title: 'UTILITY CARGO // 02', subtitle: 'TAPERED - STRUCTURED CUT' },
  { title: 'SECOND SKIN TEE // 03', subtitle: 'OVERSIZED - CLEAN SEAM' },
  { title: 'TACTICAL VEST // 04', subtitle: 'MULTI-LAYER SYSTEM' }
]

const editorial = [
  'ENGINEERED FOR URBAN MOVEMENT',
  'DESIGNED IN SILENCE, BUILT FOR IMPACT',
  'MINIMAL LINES. MAXIMUM PRESENCE.',
  'LIMITED UNITS. UNLIMITED ATTITUDE.'
]

function useCountdown(endDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime()
      const diff = endDate.getTime() - now
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [endDate])

  return timeLeft
}

const FadeSection = ({ children, className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default function App() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const time = useCountdown(targetDate)

  const displayDate = useMemo(
    () =>
      targetDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
    []
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.includes('@')) {
      setMessage('Enter a valid email to unlock access.')
      return
    }

    const existing = JSON.parse(localStorage.getItem('onyx_waitlist') || '[]')
    const updated = [...new Set([...existing, email.toLowerCase().trim()])]
    localStorage.setItem('onyx_waitlist', JSON.stringify(updated))

    setMessage('Access secured. You are now on the ONYXCLO waitlist.')
    setEmail('')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-zinc-900">
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-size:3px_3px] bg-grain" />

      <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200/70 bg-white/70 px-5 py-4 backdrop-blur-xl md:px-10">
        <div className="text-xl font-black tracking-[0.35em]">ONYXCLO</div>
        <div className="rounded-full border border-zinc-300 px-4 py-1 text-xs font-semibold tracking-[0.18em]">
          DROP 001
        </div>
      </header>

      <main className="pt-20">
        <section className="relative flex min-h-screen items-center justify-center px-6 py-24">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-8 top-24 hidden h-56 w-56 rounded-full bg-zinc-100 blur-3xl md:block"
          />
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-black uppercase leading-none tracking-[0.08em] md:text-8xl"
            >
              LAUNCHING SOON
            </motion.h1>
            <p className="max-w-xl text-sm tracking-[0.2em] text-zinc-600 md:text-base">
              ACCESS OPENS IN · {displayDate} · LUXURY TECHWEAR FOR THE NEXT ERA
            </p>

            <div className="grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(time).map(([label, value]) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-soft backdrop-blur"
                >
                  <div className="text-4xl font-black md:text-6xl">{String(value).padStart(2, '0')}</div>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-7xl font-black tracking-[0.25em] md:text-9xl">ØX</div>
          </div>
        </section>

        <FadeSection className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-24 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-premium">
            <p className="text-xs font-bold tracking-[0.3em] text-zinc-500">LIMITED EARLY ACCESS</p>
            <h2 className="mt-4 text-3xl font-black uppercase md:text-4xl">JOIN THE WAITLIST</h2>
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="rounded-2xl border border-zinc-300 bg-white px-5 py-4 text-sm outline-none transition focus:border-zinc-900"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-zinc-900 px-5 py-4 text-xs font-bold uppercase tracking-[0.24em] text-white"
              >
                Request Early Access
              </motion.button>
            </form>
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-zinc-600"
            >
              {message}
            </motion.p>
          </div>

          <div className="flex items-center justify-center rounded-3xl border border-zinc-200 bg-white p-8 shadow-soft">
            <div className="text-center">
              <p className="text-xs font-bold tracking-[0.3em] text-zinc-500">SIGNATURE IDENTITY</p>
              <div className="mt-6 text-[clamp(6rem,20vw,14rem)] font-black leading-none tracking-[0.1em]">ONYX</div>
            </div>
          </div>
        </FadeSection>

        <FadeSection className="pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <h3 className="mb-6 text-xl font-black uppercase tracking-[0.2em]">APPAREL PREVIEW</h3>
            <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2">
              {apparelCards.map((item) => (
                <motion.article
                  key={item.title}
                  whileHover={{ y: -8 }}
                  className="min-w-[280px] snap-start rounded-3xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-100 p-6 shadow-soft md:min-w-[360px]"
                >
                  <div className="mb-20 h-48 rounded-2xl border border-zinc-300 bg-zinc-200/60" />
                  <h4 className="text-lg font-black">{item.title}</h4>
                  <p className="mt-2 text-xs tracking-[0.2em] text-zinc-500">{item.subtitle}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </FadeSection>

        <FadeSection className="mx-auto max-w-6xl px-6 pb-28">
          <div className="grid gap-4 md:grid-cols-2">
            {editorial.map((line) => (
              <article key={line} className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-soft">
                <p className="text-2xl font-black uppercase leading-tight md:text-3xl">{line}</p>
              </article>
            ))}
          </div>
        </FadeSection>
      </main>

      <footer className="border-t border-zinc-200 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 md:flex-row">
          <span>© 2026 ONYXCLO</span>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-zinc-900">Instagram</a>
            <a href="#" className="transition hover:text-zinc-900">TikTok</a>
            <a href="#" className="transition hover:text-zinc-900">X</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
