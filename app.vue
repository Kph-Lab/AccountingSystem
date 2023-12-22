<template>
  <div class="flex flex-row">
    <header class="bg-slate-100 p-4">
      aaa
    </header>
    <main class="p-4 relative grow h-screen overflow-y-auto">
      <div class="flex flex-row gap-2 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-2xl fixed bottom-10 left-1/2 -translate-x-1/2">
        <div class="flex flex-col gap-2">
          <input type="text" placeholder="購入した物品名">
          <input type="text" placeholder="備考">
          <input type="text" placeholder="購入者名">
          <input type="text" placeholder="購入した店名(オンラインの場合はURL)">
          <input type="date" placeholder="購入日">
          <input type="number" placeholder="金額">
        </div>
        <button
          @click="createHistoryFromInputedData"
          class="bg-blue-600/90 border-2 border-blue-600 h-8 w-8 grid place-content-center rounded-full text-white">
          <Icon name="bi:plus" class="text-xl"/>
        </button>
      </div>
      <div class="flex flex-col gap-4 max-w-2xl mx-auto">
        <div
          v-for="history in histories"
          class="flex flex-col gap-2 p-2 rounded-lg">
          <div class="flex flex-col">
            <p class="text-lg font-semibold">
              {{ history.purchaceName }}
              <span class="text-sm font-normal">({{ history.toolOrArtwork }})</span>
            </p>
            <p class="text-xs text-black/60 pl-0.5">{{ history.reason }}</p>
          </div>
          <div class="flex flex-row gap-4 pl-1 text-sm text-black/80">
            <p>
              <Icon name="bi:currency-yen" class="text-sm -mt-1 text-black/60"/>
              {{ history.price }}
            </p>
            <p>
              <Icon name="bi:calendar" class="text-sm -mt-1 text-black/60"/>
              {{ history.date }}
            </p>
            <p>
              <Icon name="bi:shop" class="text-sm -mt-1 text-black/60"/>
              {{ history.shop }}
            </p>
            <div class="flex flex-row gap-1 items-center">
              <img
                :src="`https://source.boringavatars.com/marble/120/${history.buyer.id}?colors=610AFA,FA0AF2,B00AFA,0E05FC,FF005C`"
                alt="buyer icon"
                class="h-4 w-4 -mt-0.5">
              <p>{{ history.buyer.name }}</p>
            </div>
            <p
              v-if="history.memo"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;"
            >{{ history.memo }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import type { History as PrismaHistory } from "@prisma/client"
import type { History } from "./model/history"

async function createHistory(newHistory: Omit<PrismaHistory, "id">){
  await $fetch("/api/history/create", {
    method: "POST",
    body: newHistory
  })
}

async function createHistoryFromInputedData(){
  await createHistory({
    buyerId: 12610204,
    date: new Date("2023/8/24"),
    price: 1445,
    purchaseName: "ドメイン",
    toolOrArtwork: "Tool",
    reason: "物理部公式ウェブサイトのドメイン購入のため",
    shopNameOrURL: "cloudflare"
  })
  await updateHistories()
}

const histories = ref<History[]>([])

async function getHistories(){
  const histories = await $fetch("/api/history/get", { method: "GET" }) as unknown as History[]
  return histories
}

async function updateHistories(){
  histories.value = await getHistories()
}

updateHistories()
</script>