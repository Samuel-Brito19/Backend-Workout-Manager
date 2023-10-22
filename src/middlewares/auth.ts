import { FastifyReply, DoneFuncWithErrOrRes } from 'fastify'
import { verify } from 'jsonwebtoken'
import { FastifyRequestWithUserId } from '../types/fastify'

const secretKey = `${process.env.SECRET_JWT}`

export const authenticateJWT = async (
  request: FastifyRequestWithUserId,
  reply: FastifyReply,
  done: DoneFuncWithErrOrRes,
) => {
  try {
    const token = request.headers.authorization

    if (!token) {
      return reply.status(401).send({ message: 'Token JWT ausente' })
    }

    interface Decoded {
      userId: number
    }

    const [, tokenValue] = token.split(' ')

    const decoded = verify(tokenValue, secretKey) as Decoded

    request.userId = decoded.userId
    done()
  } catch (error) {
    reply.status(401).send({ message: 'Token JWT inválido' })
  }
}
