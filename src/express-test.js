const starkinfra = require('starkinfra')
const express = require('express')
require('dotenv').config()

const app = express()

// 🔥 BODY COMO BUFFER PURO
app.use(express.raw({ type: '*/*' }))

// 🔥 Inicializa usuário
starkinfra.user = new starkinfra.Project({
  environment: process.env.FYHUB_ENVIRONMENT || 'sandbox',
  id: process.env.FYHUB_PROJECT_ID,
  privateKey: process.env.FYHUB_PRIVATE_KEY,
})

app.post('/webhooks/receiver', async (req, res) => {

  try {

    console.log('IS BUFFER:', Buffer.isBuffer(req.body))
    console.log('RAW LENGTH:', req.body.length)

    let event = await starkinfra.event.parse({
      content: req.body.toString(),
      signature: req.headers['digital-signature']
    })

    console.log('✅ EVENT VALIDADO 2')
    console.log('SUBSCRIPTION:', event)

    res.status(200).end()

  } catch (err) {

    console.log('❌ ERRO:')
    console.log(err.message)

    res.status(400).end()
  }
})

const PORT = process.env.PORT || 3005

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express test rodando na porta ${PORT}`)
})