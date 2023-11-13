import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import { prisma } from '../database'
import UserController from './controllers/UserController'
import WorkoutController from './controllers/WorkoutController'
import ExerciseController from './controllers/ExerciseController'
import { AuthController } from './controllers/AuthController'
import fjwt from '@fastify/jwt'

export const fastify = Fastify({
  logger: true,
})

declare module 'fastify' {
  export interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Authentication: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number,
      workoutId: {
        id: number
      }
    },
    
  }

}

fastify.register(cors, {
  origin: '*',
})


fastify.register(fjwt,
  {
  secret: 'dsdsdadsad'
})

fastify.decorate('Authentication',async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify()
  } catch (error) {
    reply.send(error)
  }
})

fastify.get('/users', UserController.index)
fastify.post('/users', UserController.store)
fastify.delete('/users/:id', UserController.delete)


fastify.get('/users/workouts',
{preHandler: [fastify.Authentication]},
WorkoutController.index)

fastify.get('/users/workouts/:id',
{preHandler: [fastify.Authentication]},
WorkoutController.find
)
fastify.post(
  '/users/workouts', 
  {preHandler: [fastify.Authentication]},
  WorkoutController.store,
  )
fastify.put('/users/workouts/:id',
{preHandler: [fastify.Authentication]},
WorkoutController.update
)
fastify.delete('/users/workouts/:id',
{preHandler: [fastify.Authentication]},
WorkoutController.delete)



fastify.get('/exercises/:workoutId', 
{preHandler: [fastify.Authentication]},
ExerciseController.index)
fastify.post('/exercises', 
  {preHandler: [fastify.Authentication]},
  ExerciseController.store,
)
fastify.put('/exercises/:id',
{preHandler: [fastify.Authentication]},
ExerciseController.update
)
fastify.delete(
  '/exercises/:id',
  {preHandler: [fastify.Authentication]},
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
