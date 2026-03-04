require('dotenv').config()

const express = require('express')
const webhookRoutes = require('./routes/webhook.routes')

const app = express()

// 🔥 CRÍTICO: Buffer puro para assinatura
app.use(express.raw({ type: '*/*' }))

app.use(webhookRoutes)

const PORT = process.env.PORT || 3005

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Webhook server rodando na porta ${PORT}`)
})