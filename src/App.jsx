import { useEffect, useMemo, useState } from 'react'

const dropDate = new Date(new Date().getFullYear(), 6, 30, 23, 59, 59)
const WAITLIST_KEY = 'onyx_waitlist'
const BASE_WAITLIST = 1294

const products = [
  {
    name: 'ONYX HOODIE V1',
    price: '$89',
    detail: 'Algodón premium 420gsm, fit boxy y bordado de alta densidad.'
  },
  {
    name: 'SHADOW TEE',
    price: '$49',
    detail: 'Camiseta oversize 260gsm con tinta en relieve y lavado mineral.'
  },
  {
    name: 'STEEL CARGO',
    price: '$110',
    detail: 'Cargo técnico con 6 bolsillos funcionales y caída recta.'
  }
]

const collectionStats = [
  { label: 'Unidades del drop', value: '350' },
  { label: 'Ciudades con envíos', value: '40+' },
  { label: 'Nuevos diseños', value: '12' }
]

const siteLanguages = [
  {
    name: 'JavaScript',
    role: 'Lógica de la interfaz, validaciones y cuenta atrás en tiempo real.'
  },
  {
    name: 'HTML5',
    role: 'Estructura semántica para navegación, catálogo, formulario y FAQ.'
  },
  {
    name: 'CSS3',
    role: 'Estilos visuales, layout responsive y look premium de ONYXCLO.'
  }
]

const faqs = [
  ['¿Hacen envíos internacionales?', 'Sí, enviamos a más de 40 países con tracking.'],
  ['¿Cuándo cobra la preventa?', 'Solo se cobra al confirmar tu pedido en el checkout.'],
  ['¿Cómo elijo talla?', 'Te enviaremos la guía de tallas detallada por correo antes del drop.']
]

function safeGetWaitlist() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    const raw = window.localStorage.getItem(WAITLIST_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

function safeSetWaitlist(waitlist) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(waitlist))
    return true
  } catch {
    return false
  }
}

function useCountdown(endDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => {
      const diff = endDate.getTime() - Date.now()

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

export default function App() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [waitlistCount, setWaitlistCount] = useState(BASE_WAITLIST)
  const time = useCountdown(dropDate)

  const displayDate = useMemo(
    () =>
      dropDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
    []
  )

  useEffect(() => {
    const saved = safeGetWaitlist()
    setWaitlistCount(BASE_WAITLIST + saved.length)
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.includes('@')) {
      setMessage('Escribe un correo válido para desbloquear acceso.')
      return
    }

    const normalized = email.toLowerCase().trim()
    const existing = safeGetWaitlist()

    if (existing.includes(normalized)) {
      setMessage('Ese correo ya está en la lista VIP. Revisa tu bandeja de entrada.')
      return
    }

    const updated = [...existing, normalized]
    const stored = safeSetWaitlist(updated)

    if (!stored) {
      setMessage('No pudimos guardar tu acceso en este navegador. Inténtalo de nuevo.')
      return
    }

    setWaitlistCount(BASE_WAITLIST + updated.length)
    setMessage('Acceso asegurado. Ya estás en la lista ONYXCLO.')
    setEmail('')
  }

  return (
    <div className="page">
      <header className="header">
        <strong>ONYXCLO</strong>
        <nav>
          <a href="#drop">Drop</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>

      <main className="container">
        <section className="hero" id="drop">
          <p className="eyebrow">DROP 001 · LIMITED RELEASE</p>
          <h1>EL NUEVO UNIFORME DE CALLE.</h1>
          <p className="lead">Diseños minimalistas, cortes premium y unidades ultra limitadas.</p>
          <p className="flash">✨ Actualización real: agregamos vista previa del drop y métricas de la colección.</p>
          <p>El acceso abre el <strong>{displayDate}</strong>.</p>

          <section className="countdown" aria-label="Cuenta atrás del drop">
            {Object.entries(time).map(([label, value]) => (
              <article key={label} className="card">
                <div className="value">{String(value).padStart(2, '0')}</div>
                <div className="label">{label}</div>
              </article>
            ))}
          </section>
        </section>

        <section className="stats" aria-label="Resumen de la colección">
          {collectionStats.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="split" id="catalogo">
          <div>
            <h2>Selección inicial</h2>
            <p>Prendas esenciales diseñadas para durar temporada tras temporada.</p>
            <ul className="productList">
              {products.map((product) => (
                <li key={product.name}>
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.detail}</p>
                  </div>
                  <span>{product.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <form className="waitlist" onSubmit={handleSubmit}>
            <h3>Lista de acceso anticipado</h3>
            <p>{waitlistCount} personas ya dentro.</p>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
            />
            <button type="submit">Reservar mi acceso</button>
            {message ? <p className="message">{message}</p> : null}
          </form>
        </section>

        <section id="faq" className="faq">
          <h2>Preguntas frecuentes</h2>
          {faqs.map(([question, answer]) => (
            <article key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </section>

        <section className="faq" aria-label="Lenguajes usados en el sitio">
          <h2>Lenguajes del sitio</h2>
          {siteLanguages.map((language) => (
            <article key={language.name}>
              <h3>{language.name}</h3>
              <p>{language.role}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
