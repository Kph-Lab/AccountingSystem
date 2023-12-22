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
    <main class="p-4 relative grow h-screen overflow-y-auto">
      <CreateHistory
        class="fixed bottom-10 left-1/2 -translate-x-1/2"
        @created="updateHistories"/>
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
import type { History } from "./model/history"

const histories = ref<History[]>([])

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
  downloadLink.download = `${fileName}.json`
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