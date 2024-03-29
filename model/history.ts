export type History = {
    id: number
    buyer: {
        id: number
        codeNumber?: number
        name?: string
    };
    price: number
    purchaceName: string
    toolOrArtwork: "工具" | "作品"
    date: string
    reason: string
    shop: string
    memo?: string
}