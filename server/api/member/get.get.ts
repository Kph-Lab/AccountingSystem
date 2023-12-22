import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
    const members = await prisma.member.findMany()

    return members
})