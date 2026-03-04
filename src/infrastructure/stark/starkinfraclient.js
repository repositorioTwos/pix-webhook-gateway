const starkinfra = require('starkinfra')

let userInstance = null

function getUser() {
  if (!userInstance) {
    userInstance = new starkinfra.Project({
      environment: process.env.FYHUB_ENVIRONMENT || 'sandbox',
      id: process.env.FYHUB_PROJECT_ID,
      privateKey: process.env.FYHUB_PRIVATE_KEY
    })

    starkinfra.user = userInstance
  }

  return userInstance
}

async function parseInboundPixRequest(content, signature) {
  getUser()

  return await starkinfra.pixRequest.parse({
    content,
    signature
  })
}

function buildInboundPixResponse(status, reason) {
  getUser()

  return starkinfra.pixRequest.response({
    status,
    reason
  })
}

module.exports = {
  getUser,
  parseInboundPixRequest,
  buildInboundPixResponse
}