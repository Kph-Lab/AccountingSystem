<template>
    <div class="flex flex-row gap-2 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-2xl">
        <div class="flex flex-col gap-2">
            <input type="text" placeholder="購入した物品名">
            <input type="text" placeholder="備考">
            <input type="text" placeholder="購入者名">
            <input type="text" placeholder="購入した店名(オンラインの場合はURL)">
            <input type="date" placeholder="購入日">
            <input type="number" placeholder="金額">
        </div>
        <button @click="createHistoryFromInputedData"
            class="bg-blue-600/90 border-2 border-blue-600 h-8 w-8 grid place-content-center rounded-full text-white">
            <Icon name="bi:plus" class="text-xl" />
        </button>
    </div>
</template>
<script setup lang="ts">
import type { History } from "@prisma/client"

const emit = defineEmits<{
    ( e: "created" ): void
}>()

async function createHistory(newHistory: Omit<History, "id">) {
    await $fetch("/api/history/create", {
        method: "POST",
        body: newHistory
    })
}

async function createHistoryFromInputedData() {
    await createHistory({
        buyerId: 12610204,
        date: new Date("2023/8/24"),
        price: 1445,
        purchaseName: "ドメイン",
        toolOrArtwork: "Tool",
        reason: "物理部公式ウェブサイトのドメイン購入のため",
        shopNameOrURL: "cloudflare"
    })
    emit("created")
}
</script>