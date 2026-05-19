import 'dotenv/config'
import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'onyxclo-backend-private' })
})

app.get('/private/config', (_req, res) => {
  const hasSecrets = Boolean(process.env.BACKEND_API_KEY && process.env.JWT_SECRET)
  res.json({
    hasSecrets,
    adminEmail: process.env.ADMIN_EMAIL || null
  })
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`Private backend running on http://localhost:${port}`)
})
