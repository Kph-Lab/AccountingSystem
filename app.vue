<template>
  <div class="flex flex-row">
    <header class="bg-slate-100 px-4 py-8 flex flex-col gap-8">
      <NuxtLink to="/">
        <Icon name="bi:card-checklist" class="text-2xl" />
      </NuxtLink>
      <NuxtLink to="/members">
        <Icon name="bi:people" class="text-2xl" />
      </NuxtLink>
      <div class="grow" />
      <button @click="logout">
        <Icon name="bi:box-arrow-left" class="text-2xl" />
      </button>
      <button @click="downloadData">
        <Icon name="bi:cloud-download" class="text-2xl" />
      </button>
    </header>
    <main class="p-4 pb-10 grow h-screen flex flex-col items-center">
      <NuxtPage />
    </main>
  </div>
</template>
<script setup lang="ts">
import useAuth from './util/useAuth';

const { logout } = useAuth()

const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const mi = date.getMinutes();

  return `${yyyy}/${mm}/${dd}_${hh}:${mi}`;
}

function downloadJSON(fileName: string, data: Object) {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const downloadLink = document.createElement("a")
  downloadLink.download = `${fileName}_${formatDate(new Date())}.json`
  downloadLink.href = url

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}

async function downloadData() {
  const { histories, members } = await $fetch("/api/downloadData", { method: "GET" })
  downloadJSON("histories", histories)
  downloadJSON("members", members)
}
</script>