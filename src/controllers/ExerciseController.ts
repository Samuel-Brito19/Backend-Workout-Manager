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
}


class ExerciseController {

    static async index(request: FastifyRequest<{Params: ParamsExercise}>, reply: FastifyReply) {

        const {workoutId} = request.params

        const workoutIdNumber = Number(workoutId)

        if(!workoutIdNumber) {
            return reply.status(400).send({erro: "Workout doesn't exist!"})
        }

        const exercises = await prisma.exercise.findMany({
            where: {
                workoutId: workoutIdNumber
            }
        })

        return exercises
    }

    static async store(request: FastifyRequest<{Params: ParamsExercise, Body: RequestExersice}>, reply: FastifyReply) {
        
        const {workoutId} = request.params

        const workoutIdNumber = Number(workoutId)
        
        if(!workoutIdNumber) {
            return reply.status(400).send({erro: "Workout doesn't exist!"})
        }

        const {name, sets, repetitions} = request.body

        const newExercise = await prisma.exercise.create({
            data: {
                name,
                sets,
                repetitions,
                workoutId
            }
        })

        return newExercise
    }

    static async delete(request: FastifyRequest<{Params: ParamsExercise}>, reply: FastifyReply) {

        const {id, workoutId} = request.params

        const idNumber = Number(id)

        if(!workoutId) {
            return reply.status(400).send({erro: "Workout doesn't exist!"})
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