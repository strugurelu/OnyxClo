import { useEffect, useMemo, useState } from 'react'

const targetDate = new Date(new Date().getFullYear(), 6, 30, 23, 59, 59)

function useCountdown(endDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => {
      const now = Date.now()
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

export default function App() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const time = useCountdown(targetDate)

  const displayDate = useMemo(
    () =>
      targetDate.toLocaleDateString('es-MX', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
    []
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.includes('@')) {
      setMessage('Escribe un correo válido para desbloquear acceso.')
      return
    }

    const existing = JSON.parse(localStorage.getItem('onyx_waitlist') || '[]')
    const updated = [...new Set([...existing, email.toLowerCase().trim()])]
    localStorage.setItem('onyx_waitlist', JSON.stringify(updated))

    setMessage('Acceso asegurado. Ya estás en la lista ONYXCLO.')
    setEmail('')
  }

  return (
    <div className="page">
      <header className="header">
        <strong>ONYXCLO</strong>
        <span>DROP 001</span>
      </header>

      <main className="container">
        <h1>LANZAMOS PRONTO</h1>
        <p>El acceso abre el {displayDate}.</p>

        <section className="countdown">
          {Object.entries(time).map(([label, value]) => (
            <article key={label} className="card">
              <div className="value">{String(value).padStart(2, '0')}</div>
              <div className="label">{label}</div>
            </article>
          ))}
        </section>

        <form className="waitlist" onSubmit={handleSubmit}>
          <label htmlFor="email">Únete a la lista de espera</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
          />
          <button type="submit">Solicitar acceso</button>
          {message ? <p className="message">{message}</p> : null}
        </form>
      </main>
    </div>
  )
}
