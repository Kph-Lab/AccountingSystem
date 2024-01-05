import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const { with_used_yens } = await readBody(event) as { [key: string]: boolean }

    const members = await prisma.member.findMany()
    if( with_used_yens ){
        const member_with_used_yens = await Promise.all(members.map(async (member) => {
            const hisotries = await prisma.history.findMany({
                where: {
                    buyerId: member.id
                }
            })
            let sum = 0
            hisotries.forEach(({ price }) => sum += price)
    
            return { ...member, ...{ used_yen: sum } }
        }))
    
        return member_with_used_yens
    }
    
    return members
})