import { FastifyInstance } from 'fastify'
import { pool } from '../database/connection'

export async function webhookRoutes(app: FastifyInstance) {
  app.post('/webhooks/receiver', async (request, reply) => {
    const body = request.body as any

    // Validação mínima obrigatória
    if (!body?.event || !body?.id) {
      return reply.status(400).send({
        error: 'Invalid payload. "event" and "id" are required.'
      })
    }

    try {
      await pool.query(
        `
        INSERT INTO webhook_events
        (provider, event_type, external_id, payload)
        VALUES ($1, $2, $3, $4)
        `,
        ['fyhub', body.event, body.id, body]
      )

      return reply.status(200).send({ received: true })
    } catch (error) {
      app.log.error({ error }, 'Failed to store webhook')

      return reply.status(500).send({
        error: 'Failed to persist webhook'
      })
    }
  })
}