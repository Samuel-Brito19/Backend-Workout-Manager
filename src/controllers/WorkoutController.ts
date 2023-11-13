import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../database";



interface ParamsId {
    userId: number,
    id: number,
    workoutId: number
}

interface BodyWorkout {
    title: string,
}
class WorkoutController {

    static async index(request: FastifyRequest<{Params: ParamsId}>, reply: FastifyReply) {

        const user = request.user

        const workouts = await prisma.workout.findMany({
            where: {
                userId: user.id
            }
        })
        
        return reply.status(200).send(workouts)
    }

    static async store(request: FastifyRequest<{Body: BodyWorkout} >, reply: FastifyReply) {

        const user = request.user
        console.log(user)
        

        const {title} = request.body

        const newWorkout = await prisma.workout.create({
            data: {
                title,
                userId: user.id
            }
        })

        return reply.status(201).send(
            newWorkout
        )
        
    }

    static async update(request: FastifyRequest<{Body: BodyWorkout, Params: ParamsId}>, reply: FastifyReply) {

        const workoutId = request.params.id
        const title = request.body.title

        const editedWorkout = await prisma.workout.update({
            where: {id: Number(workoutId)}, 
            data: {title}
        })

        return reply.status(200).send(editedWorkout)
    }

    static async find(request: FastifyRequest<{Params: ParamsId}>, reply: FastifyReply) {
        const {id} = request.params
        
        const idAsNumber = Number(id)

        const findWorkout = await prisma.workout.findUnique({where: {id: idAsNumber}})

        return reply.status(200).send(findWorkout)
    }

    static async delete(request: FastifyRequest<{Params: ParamsId}>, reply: FastifyReply) {

        const {id} = request.params
        
        const idAsNumber = Number(id)


        const noWorkout = await prisma.workout.findUnique({where: {id: idAsNumber}})

        if(!noWorkout) {
            return reply.status(400).send({error: "Workout doesn't exist!"})
        }

        const deleteWorkout = await prisma.workout.delete({
            where: {
                id: idAsNumber
            }
        })

        return reply.status(200).send(
            {id: deleteWorkout.id }
        )
    }
}

export default WorkoutController
