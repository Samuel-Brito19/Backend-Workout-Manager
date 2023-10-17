import Fastify from 'fastify'
import { prisma } from '../database'
import UserController from './controllers/UserController'
import WorkoutController from './controllers/WorkoutController'

const fastify = Fastify({
  logger: true,
})

fastify.get('/users', UserController.index)
fastify.post('/users', UserController.store)
fastify.delete('/users/:id', UserController.delete)

fastify.get('/users/:userId/workout', WorkoutController.index)
fastify.post('/users/:userId/workout', WorkoutController.store)
fastify.delete('/users/:userId/workout/:id', WorkoutController.delete)


fastify.listen({ port: 3000 }, async error => {
  if (error) {
    fastify.log.error(error)
    await prisma.$disconnect()
    process.exit(1)
  }
})
