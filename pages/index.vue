<template>
  <div class="max-h-full overflow-y-auto w-full">
    <div class="flex flex-col gap-4 mx-auto max-w-2xl">
      <div class="flex flex-col gap-2">
        <div class="flex flex-row items-end gap-2 font-semibold">
          <p>残り</p>
          <h3 class="text-3xl">{{ BUDGET - used_money }}</h3>
          <p class="mb-1">/</p>
          <h5 class="text-sm"><span class="text-3xl">{{ BUDGET }}</span> 円</h5>
          <p class="text-black/40">{{ Math.round((1 - used_money / BUDGET) * 10000) / 100 }}%</p>
        </div>
        <div class="bg-slate-200 h-1 rounded-full">
          <div
            class="h-full bg-green-400 rounded-full"
            :style="{ width: `${ Math.round((1 - used_money / BUDGET) * 10000) / 100 }%` }"/>
        </div>
      </div>
      <History v-for="history in histories" :history="history" />
    </div>
  </div>
  <CreateHistory @created="updateHistories" />
</template>
<script setup lang="ts">
import type { History } from "../model/history"

const histories = ref<History[]>([])
const BUDGET = 401384

const used_money = computed(() => {
  let money = 0
  histories.value.forEach(history => {
    if (history.memo != "文化祭予算") money += history.price
  })
  return money
})

async function getHistories() {
  const histories = await $fetch("/api/history/get", { method: "GET" }) as unknown as History[]
  return histories
}

async function updateHistories() {
  histories.value = await getHistories()
}

updateHistories()
</script>