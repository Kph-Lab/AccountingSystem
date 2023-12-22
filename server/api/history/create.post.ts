import { History, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const data: History = await readBody(event)

    await prisma.history.create({
        data: data
    })
})