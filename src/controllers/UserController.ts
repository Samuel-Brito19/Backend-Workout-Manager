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

    if (
      !name ||
      !email ||
      !password ||
      name.trim() === '' ||
      email.trim() === '' ||
      password.trim() === ''
    ) {
      return reply.status(400).send({
        error: 'name, email and password are required!',
      })
    }

    if (!email.includes('@')) {
      return reply.status(400).send({ error: 'Invalid e-mail!' })
    }

    if (password.length < 6) {
      return reply.status(400).send({ error: 'Password too short!' })
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

    return reply.status(201).send({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    })
  }
}

export default UserController
