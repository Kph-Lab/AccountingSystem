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
        <div class="bg-zinc-800 h-1 rounded-full">
          <div
            class="h-full bg-green-400 rounded-full"
            :style="{ width: `${ Math.round((1 - used_money / BUDGET) * 10000) / 100 }%` }"/>
        </div>
      </div>
      <History
        v-for="history in histories"
        :history="history"
        :includeHistoryImage="historyImageNames.includes(`${history.id.toString()}.png`)"
        @updateImages="updateHistoryImageReferences"/>
    </div>
  </div>
  <CreateHistory
    v-if="role == 'Admin'"
    @created="updateHistories"/>
</template>
<script setup lang="ts">
import useAuth from "~/util/useAuth";
import useHistory from "../hooks/useHistory"
import { BUDGET } from "../util/config"
import { getStorage, ref as reference, listAll } from "firebase/storage";

const { auth } = useAuth()
if( !auth.currentUser?.email ) throw new Error("ユーザーのアドレスがないです！")
const { email } = auth.currentUser

const admins = await $fetch("/api/admin/get")
const myData = admins.find(admin => admin.mail == email)
if( !myData ) throw new Error("管理者じゃないです！")
const { role } = myData


const { histories, used_money, updateHistories } = useHistory()

const { historyImageFolderName } = useRuntimeConfig().public
const storage = getStorage();
const historyImagesFolderRef = reference(storage, historyImageFolderName)

const historyImageNames = ref<string[]>([])
async function updateHistoryImageReferences(){
  historyImageNames.value = (await listAll(historyImagesFolderRef)).items.map(reference => reference.name)
}

updateHistories()
updateHistoryImageReferences()

definePageMeta({
  middleware: ["auth"]
})
</script>