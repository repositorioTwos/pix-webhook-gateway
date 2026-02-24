import Fastify from 'fastify'
import { webhookRoutes } from './routes/webhook.routes'

export const app = Fastify({
  logger: true
})

app.register(webhookRoutes)