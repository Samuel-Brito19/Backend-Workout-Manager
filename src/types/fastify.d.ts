import { FastifyRequest } from 'fastify'

declare interface FastifyRequestWithUserId extends FastifyRequest {
  userId?: number

}
