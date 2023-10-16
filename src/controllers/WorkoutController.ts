import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../database";

interface ParamsId {
    userId: number
}

interface BodyWorkout {
    title: string,
}
class WorkoutController {

    static async index(request: FastifyRequest<{Params: ParamsId}>, reply: FastifyReply) {

        const {userId} = request.params

        const idAsNumber = Number(userId)

        if(!idAsNumber) {
            return reply.status(400).send({error: "User dont exist!"})
        }

        const workouts = await prisma.workout.findMany({
            select: {
                id: true,
                title: true,
                user: true,
                userId: true
            }
        })
        
        return workouts
    }

    static async store(request: FastifyRequest<{Params: ParamsId, Body: BodyWorkout}>, reply: FastifyReply) {

        const {userId} = request.params

        const idAsNumber = Number(userId)

        if(!idAsNumber) {
            return reply.status(400).send({error: "User dont exist!"})
        }

        const {title} = request.body

        const newWorkout = await prisma.workout.create({
            data: {
                title,
                userId: idAsNumber
            }
        })

        return newWorkout
        
    }
}

export default WorkoutController
