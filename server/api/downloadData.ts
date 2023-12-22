import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
    const histories = await prisma.history.findMany()
    const members = await prisma.member.findMany()
    
    return { histories, members }
})