import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../database'

interface CreateUserRequestBody {
  name: string;
  email: string;
  password: string;
}
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

  static async store(request: FastifyRequest, reply: FastifyReply) {

    const {name, email, password} = request.body as CreateUserRequestBody

    const userExists = await prisma.user.findUnique({where: {email}})

    if(userExists) {
      return reply.status(400).send({error: "user already exists!"})
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    })

    return newUser
  }
}

export default UserController
