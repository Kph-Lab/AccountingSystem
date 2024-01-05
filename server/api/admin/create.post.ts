import { Admin, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const data: Admin = await readBody(event)

    await prisma.admin.create({
        data: data
    })
})