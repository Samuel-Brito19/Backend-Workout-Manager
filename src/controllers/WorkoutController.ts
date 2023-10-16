import { prisma } from "../../database";

class WorkoutController {

    static async index() {

        const workout = await prisma.workout.findMany({
            select: {
                id: true,
                title: true,
                user: true,
                userId: true
            }
        })
        return workout
    }
}

export default WorkoutController
