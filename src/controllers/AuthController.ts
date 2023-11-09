import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../database'
import { compare } from 'bcryptjs'
//import { sign } from 'jsonwebtoken'
import 'dotenv/config'
import { fastify } from '..'

interface AuthenticationBody {
  email: string
  password: string
}

export class AuthController {
  static async autenticate(
    request: FastifyRequest<{ Body: AuthenticationBody }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return reply.status(400).send({ error: 'User dont exist!' })
    }

    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      return reply.status(400).send({ error: 'Invalid password!' })
    }

  

    const token = fastify.jwt.sign({ id: user.id }, {
      expiresIn: "7d"
    })

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    })
  }
}
