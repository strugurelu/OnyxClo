import { useEffect, useMemo, useState } from 'react'

const dropDate = new Date(new Date().getFullYear(), 6, 30, 23, 59, 59)

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

const faqs = [
  ['¿Hacen envíos internacionales?', 'Sí, enviamos a más de 40 países con tracking.'],
  ['¿Cuándo cobra la preventa?', 'Solo se cobra al confirmar tu pedido en el checkout.'],
  ['¿Cómo elijo talla?', 'Te enviaremos la guía de tallas detallada por correo antes del drop.']
]

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
  const [waitlistCount, setWaitlistCount] = useState(1294)
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
    const saved = JSON.parse(localStorage.getItem('onyx_waitlist') || '[]')
    setWaitlistCount(1294 + saved.length)
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.includes('@')) {
      setMessage('Escribe un correo válido para desbloquear acceso.')
      return
    }

    const normalized = email.toLowerCase().trim()
    const existing = JSON.parse(localStorage.getItem('onyx_waitlist') || '[]')

    if (existing.includes(normalized)) {
      setMessage('Ese correo ya está en la lista VIP. Revisa tu bandeja de entrada.')
      return
    }

    const updated = [...existing, normalized]
    localStorage.setItem('onyx_waitlist', JSON.stringify(updated))
    setWaitlistCount(1294 + updated.length)
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
      </main>
    </div>
  )
}
