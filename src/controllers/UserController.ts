import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../database'
import { hash } from 'bcryptjs'

interface CreateUserRequestBody {
  name: string
  email: string
  password: string
}

class UserController {
  static async index() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
    return users
  }

  static async store(
    request: FastifyRequest<{
      Body: CreateUserRequestBody
    }>,
    reply: FastifyReply,
  ) {
    const { name, email, password } = request.body

    if (!email.includes('@')) {
      return reply.status(400).send({ error: "You're missing the '@'!" })
    }

    if (password.length < 6) {
      return reply.status(400).send({ error: 'Password too short!' })
    }

    if (name === null || name === undefined || name.trim() === '') {
      return reply.status(400).send({ error: 'Invalid name!' })
    } else if (email === null || email === undefined || email.trim() === '') {
      return reply.status(400).send({ error: 'Invalid email!' })
    } else if (
      password === null ||
      password === undefined ||
      password.trim() === ''
    ) {
      return reply.status(400).send({ error: 'Invalid password!' })
    }

    const userExists = await prisma.user.findUnique({ where: { email } })

    if (userExists) {
      return reply.status(400).send({ error: 'user already exists!' })
    }

    const hashPassword = await hash(password, 8)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    })

    return newUser
  }
}

export default UserController
