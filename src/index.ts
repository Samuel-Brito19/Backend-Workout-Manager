import Fastify from 'fastify'
import { prisma } from '../database'
import UserController from './controllers/UserController'
import WorkoutController from './controllers/WorkoutController'
import ExerciseController from './controllers/ExerciseController'
import { AuthController } from './controllers/AuthController'
import { authenticateJWT } from './middlewares/auth'

const fastify = Fastify({
  logger: true,
})

fastify.get('/users', UserController.index)
fastify.post('/users', UserController.store)
fastify.delete('/users/:id', UserController.delete)


fastify.get('/users/:userId/workouts', WorkoutController.index)
fastify.post('/users/:userId/workouts', {
  preHandler: authenticateJWT,
  handler: WorkoutController.store,
})
fastify.delete('/users/:userId/workouts/:id', WorkoutController.delete)

fastify.get('/users/workouts/:workoutId/exercises', ExerciseController.index)
fastify.post('/users/workouts/:workoutId/exercises', ExerciseController.store)
fastify.delete(
  '/users/workouts/:workoutId/exercises/:id',
  ExerciseController.delete,
)

fastify.post('/auth', AuthController.autenticate)

fastify.listen({ port: 3000 }, async error => {
  if (error) {
    fastify.log.error(error)
    await prisma.$disconnect()
    process.exit(1)
  }
})
