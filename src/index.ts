import Fastify from 'fastify'
import { prisma } from '../database'
import UserController from './controllers/UserController'
const fastify = Fastify({
  logger: true,
})

fastify.get('/users', UserController.index)

fastify.listen({ port: 3000 }, async error => {
  if (error) {
    fastify.log.error(error)
    await prisma.$disconnect()
    process.exit(1)
  }
})
