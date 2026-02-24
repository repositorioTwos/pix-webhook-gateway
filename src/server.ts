import { app } from './app'
import dotenv from 'dotenv'

dotenv.config()

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3005,
      host: '0.0.0.0'
    })

    console.log('Webhook server running')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()