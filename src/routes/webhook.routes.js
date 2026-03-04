const express = require('express')
const starkinfra = require('starkinfra')
const { pool } = require('../database/connection')

const {
  parseInboundPixRequest,
  buildInboundPixResponse,
  getUser
} = require('../infrastructure/stark/starkinfraclient')

const router = express.Router()

// 🔥 BODY COMO BUFFER PURO (IMPORTANTE)
router.use(express.raw({ type: '*/*' }))

// 🔥 Inicializa StarkInfra UMA VEZ
starkinfra.user = new starkinfra.Project({
  environment: process.env.FYHUB_ENVIRONMENT || 'sandbox',
  id: process.env.FYHUB_PROJECT_ID,
  privateKey: process.env.FYHUB_PRIVATE_KEY,
})

const agora = new Date();
const dataFormatada = agora.toLocaleString('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  dateStyle: 'short',
  timeStyle: 'medium'
});



router.post('/webhooks/receiver', async (req, res) => {
  try {

    console.log(`🔥 [${dataFormatada}] WEBHOOK HIT`);
    console.log('IS BUFFER:', Buffer.isBuffer(req.body))
    console.log('RAW LENGTH:', req.body.length)

    const signature = req.headers['digital-signature']
    const rawBody = req.body

    if (!rawBody || !rawBody.length) {
      return res.status(400).end()
    }

    if (!signature) {
      return res.status(400).end()
    }

    // 🔥 SEM SIMULAÇÃO
    const event = await starkinfra.event.parse({
      content: rawBody.toString(),
      signature: signature
    })

    console.log('✅ EVENT VALIDADO')
    console.log('✅ PIXREQUEST VALIDADO')
    console.log(`BODY`, rawBody.toString())
    const pixRequest = JSON.parse(rawBody.toString());

    // 🔹 SALVA WEBHOOK
    await pool.query(
      `
      INSERT INTO webhook_events
      (provider, event_type, external_id, payload)
      VALUES ($1, $2, $3, $4)
      `,
      [
        'starkinfra',
        pixRequest.flow == 'in' ? 'pix-request.in' : 'pix-request.out',
        pixRequest?.id || null,
        pixRequest
      ]
    )

      console.log(`==================================`)
      console.log(pixRequest)
      console.log(`==================================`)

    // 🔹 AUTORIZAÇÃO INBOUND
    if (pixRequest.flow === 'in') {

      const response = await buildInboundPixResponse('approved')

      console.log(`2==================================`)
      console.log(response)
      console.log(`2==================================`)

      return res
        .status(200)
        .type('application/json')
        .send(response)
    }

    return res.status(200).end()

  } catch (error) {

    console.error('Inbound Pix processing error', error)

    const response = await buildInboundPixResponse(
      'denied',
      'internalError'
    )

    return res
      .status(200)
      .type('application/json')
      .send(response)
  }
})

router.post('/v2/webhooks/receiver', async (req, res) => {
  try {

    console.log(`🔥 [${dataFormatada}] WEBHOOK HIT`);
    console.log('IS BUFFER:', Buffer.isBuffer(req.body))
    console.log('RAW LENGTH:', req.body.length)

    const signature = req.headers['digital-signature']
    const rawBody = req.body

    if (!rawBody || !rawBody.length) {
      return res.status(400).end()
    }

    if (!signature) {
      return res.status(400).end()
    }

    // 🔥 SEM SIMULAÇÃO
    const event = await starkinfra.event.parse({
      content: rawBody.toString(),
      signature: signature
    })

    console.log('✅ EVENT VALIDADO')
    console.log('✅ PIXREQUEST VALIDADO')
    console.log(`BODY`, rawBody.toString())
    const pixRequest = JSON.parse(rawBody.toString());

    // 🔹 SALVA WEBHOOK
    await pool.query(
      `
      INSERT INTO webhook_events
      (provider, event_type, external_id, payload)
      VALUES ($1, $2, $3, $4)
      `,
      [
        'starkinfra',
        pixRequest.flow == 'in' ? 'pix-request.in' : 'pix-request.out',
        pixRequest?.id || null,
        pixRequest
      ]
    )

      console.log(`==================================`)
      console.log(pixRequest)
      console.log(`==================================`)

    // 🔹 AUTORIZAÇÃO INBOUND
    if (pixRequest.flow === 'in') {

      const response = await buildInboundPixResponse('approved')

      console.log(`2==================================`)
      console.log(response)
      console.log(`2==================================`)

      return res
        .status(200)
        .type('application/json')
        .send(response)
    }

    return res.status(200).end()

  } catch (error) {

    console.error('Inbound Pix processing error', error)

    const response = await buildInboundPixResponse(
      'denied',
      'internalError'
    )

    return res
      .status(200)
      .type('application/json')
      .send(response)
  }
})

router.post('/webhooks', (_, res) => {
  return res.status(200).json({ received: true })
})

module.exports = router