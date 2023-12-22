<template>
  <main class="p-4">
    <button @click='() => createHistory({
  buyerId: 12610204,
  date: new Date("2023/8/24"),
  price: 1445,
  purchaseName: "ドメイン",
  toolOrArtwork: "Tool",
  reason: "物理部公式ウェブサイトのドメイン購入のため",
  shopNameOrURL: "cloudflare"
})'>aaaa</button>
    <div class="flex flex-col gap-4 max-w-2xl mx-auto">
      <div
        v-for="history in histories"
        class="flex flex-col gap-1 p-2 rounded-lg shadow-xl shadow-slate-600/5">
        <p class="text-lg font-semibold">{{ history.purchaceName }}</p>
        <div class="flex flex-row gap-4 px-1 text-sm">
          <p>¥{{ history.price }}</p>
          <div class="flex flex-row gap-1 items-center">
            <img
              :src="`https://source.boringavatars.com/marble/120/${history.buyer.id}?colors=610AFA,FA0AF2,B00AFA,0E05FC,FF005C`"
              alt="buyer icon"
              class="h-4 w-4 -mt-0.5">
            <p>{{ history.buyer.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import type { History as PrismaHistory } from "@prisma/client"
//import type { History } from "./model/history"

async function createHistory(newHistory: Omit<PrismaHistory, "id">){
  await $fetch("/api/history/create", {
    method: "POST",
    body: newHistory
  })
}

async function getHistories(){
  const histories = await $fetch("/api/history/get", { method: "GET" })
  return histories
}

const histories = await getHistories()
</script>