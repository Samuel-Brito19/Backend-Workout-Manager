import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../database";

interface ParamsId {
    userId: number,
    id: number
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

    static async delete(request: FastifyRequest<{Params: ParamsId}>, reply: FastifyReply) {

        const {id, userId} = request.params
        
        const idAsNumber = Number(id)

        if(!userId) {
            return reply.status(400).send({error: "no user found!"})
        }

        const noWorkout = await prisma.workout.findUnique({where: {id: idAsNumber}})

        if(!noWorkout) {
            return reply.status(400).send({error: "Workout doesn't exist!"})
        }

        const deleteWorkout = await prisma.workout.delete({
            where: {
                id: idAsNumber
            }
        })

        return reply.status(200).send({
            id: deleteWorkout.id
        })
    }
}

export default WorkoutController
