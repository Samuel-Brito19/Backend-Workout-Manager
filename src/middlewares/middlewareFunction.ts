import { FastifyReply, FastifyRequest, fastify } from "fastify";
import { verify } from "jsonwebtoken";

    
const server = fastify()
const secreteKey = `${process.env.SECRET_JWT}`

const authenticateJWT =async (request: FastifyRequest, reply: FastifyReply) {
    try {
        const token = request.headers.authorization

        if(!token) {
            return reply.status(401).send({message: 'Token JWT ausente'})
        }

        const decoded = verify(token, secreteKey)

        //Aparentemente precisamos criar uma request personalizada e não sei como faz isso
        //request.user = decoded
    } catch (error) {
        reply.status(401).send({ message: 'Token JWT inválido' })
    }
}






