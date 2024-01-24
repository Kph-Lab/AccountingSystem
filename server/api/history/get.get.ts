import { PrismaClient } from "@prisma/client"
import { History } from "~/model/history"

const prisma = new PrismaClient()

async function findMember(id: number){
    const member = await prisma.member.findUnique({ where: { id } }) ?? { id }
    return member
}

export const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    return `${yyyy}/${mm}/${dd}`;
}

export default defineEventHandler(async () => {
    const histories = await prisma.history.findMany()

    const adjustedHistories = await Promise.all(histories.map(async (history): Promise<History> => {
        const toolOrArtwork: "工具" | "作品" = history.toolOrArtwork == "Tool" ? "工具" : "作品"
        return {
            id: history.id,
            buyer: await findMember(history.buyerId),
            price: history.price,
            purchaceName: history.purchaseName,
            toolOrArtwork,
            date: formatDate(history.date),
            reason: history.reason,
            memo: history.memo ?? undefined,
            shop: history.shopNameOrURL
        }
    }))

    return adjustedHistories.reverse()
})