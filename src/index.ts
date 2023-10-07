import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.get('/', async function handler(request, reply) {
  return { hello: 'Samuel' }
})

fastify.listen({ port: 3000 }, (error) => {
  if (error) {
    fastify.log.error(error)
    process.exit(1)
  }
})
