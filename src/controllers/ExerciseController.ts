import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../database";

interface ParamsExercise {
    workoutId: number,
    id: number
}

interface RequestExersice {
    name: string,
    sets: number,
    repetitions: number,
    workoutId: number
}


class ExerciseController {

    static async index(request: FastifyRequest<{Params: ParamsExercise}>, reply: FastifyReply) {

       //const user = request.user
       const {workoutId} = request.params


        const exercises = await prisma.exercise.findMany({
            where: {
                workoutId: workoutId
            }
        })

        return reply.status(200).send(exercises)
    }

    static async store(request: FastifyRequest<{Body: RequestExersice}>, reply: FastifyReply) {
        
        //const workoutId = request.user.workoutId.id

        const {name, sets, repetitions, workoutId} = request.body

        const newExercise = await prisma.exercise.create({
            data: {
                name,
                sets,
                repetitions,
                workoutId
            }
        })

        return reply.status(200).send(newExercise)
    }

    static async delete(request: FastifyRequest<{Params: ParamsExercise}>, reply: FastifyReply) {

        const {id, workoutId} = request.params

        const idNumber = Number(id)

        if(!workoutId) {
            return reply.status(400).send({error: "Workout doesn't exist!"})
        }

        const deletedExercise = await prisma.exercise.delete({
            where: {
                id: idNumber
            }
        })

        return reply.status(200).send({
            id: deletedExercise.id
        })
    }
}

export default ExerciseController