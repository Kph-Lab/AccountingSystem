<template>
  <div class="flex flex-row">
    <header class="bg-slate-100 px-4 py-8 flex flex-col gap-8">
      <button>
        <Icon
          name="bi:card-checklist"
          class="text-2xl"/>
      </button>
      <button>
        <Icon
          name="bi:people"
          class="text-2xl"/>
      </button>
      <div class="grow"/>
      <button @click="downloadData">
        <Icon
          name="bi:cloud-download"
          class="text-2xl"/>
      </button>
    </header>
    <main class="p-4 pb-10 grow h-screen flex flex-col items-center">
      <div class="max-h-full overflow-y-auto w-full">
        <div class="flex flex-col gap-4 mx-auto max-w-2xl">
          <div class="flex flex-row items-end gap-2 font-semibold">
            <p>残り</p>
            <h3 class="text-3xl">{{ BUDGET - used_money }}</h3>
            <p class="mb-1">/</p>
            <h5 class="text-sm"><span class="text-3xl">{{ BUDGET }}</span> 円</h5>
            <p class="text-black/40">{{ Math.round((1 - used_money / BUDGET) * 10000) / 100 }}%</p>
          </div>
          <History
            v-for="history in histories"
            :history="history"/>
        </div>
      </div>
      <CreateHistory
        @created="updateHistories"/>
    </main>
  </div>
</template>
<script setup lang="ts">
import type { History } from "./model/history"

const histories = ref<History[]>([])
const BUDGET = 401384

const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();

    return `${yyyy}/${mm}/${dd}_${hh}:${mi}`;
}

const used_money = computed(() => {
  let money = 0
  histories.value.forEach(history => {
    if( history.memo != "文化祭予算" ) money += history.price
  })
  return money
})

async function getHistories(){
  const histories = await $fetch("/api/history/get", { method: "GET" }) as unknown as History[]
  return histories
}

async function updateHistories(){
  histories.value = await getHistories()
}

function downloadJSON(fileName: string, data: Object){
  const blob = new Blob([JSON.stringify(data)], {type: "application/json"})
  const url = URL.createObjectURL(blob)

  const downloadLink = document.createElement("a")
  downloadLink.download = `${fileName}_${formatDate(new Date())}.json`
  downloadLink.href = url

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}

async function downloadData(){
  const { histories, members } = await $fetch("/api/downloadData", { method: "GET" })
  downloadJSON("histories", histories)
  downloadJSON("members", members)
}

updateHistories()
</script>