import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../database";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import 'dotenv/config'

interface TypeBody {
    email: string,
    password: string
}

export class AuthController {

    static async autenticate(request: FastifyRequest<{Body:TypeBody}>, reply: FastifyReply) {

        const {email, password} = request.body

        const user = await prisma.user.findUnique({where: {email}})

        if(!user) {
            return reply.status(400).send({error: "User dont exist!"})
        }

        const isValidPassword = await compare(password, user.password)

        if(!isValidPassword) {
            return reply.status(400).send({erro: "Invalid password!"})
        }

        const token = sign({id: user.id}, `${process.env.SECRET_JWT}`, {expiresIn: "1d"})

        return reply.send({user,  token})
    }
}