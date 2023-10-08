import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../database'

class UserController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
    return users
  }
}

export default UserController
