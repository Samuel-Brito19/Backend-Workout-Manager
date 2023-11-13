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
        console.log(workoutId)

        const exercises = await prisma.exercise.findMany({
            where: {
                workoutId: Number(workoutId)
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

    static async update(request: FastifyRequest<{Params: ParamsExercise, Body: RequestExersice}>, reply: FastifyReply) {

        const id = request.params.id
        const newName = request.body.name
        const newSet = request.body.sets
        const newRepetitions = request.body.repetitions
        const newWorkoutId = request.body.workoutId

        const updatedExercise = await prisma.exercise.update({
            where: {id: Number(id)},
            data: {
                name: newName,
                sets: newSet,
                repetitions: newRepetitions,
                workoutId: newWorkoutId
            }
        })

        reply.status(200).send(updatedExercise)
    }

    static async delete(request: FastifyRequest<{Params: ParamsExercise}>, reply: FastifyReply) {

        const {id} = request.params

        const idNumber = Number(id)


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