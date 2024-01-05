import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
    const admins = await prisma.admin.findMany()
    
    return admins
})