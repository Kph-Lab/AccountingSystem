<template>
    <div class="max-h-full overflow-y-auto w-full">
        <div class="flex flex-col gap-4 mx-auto max-w-2xl">
            <div
                v-for="member in members"
                class="flex flex-col gap-2">
                <div class="p-4 flex flex-row gap-2 items-center">
                    <img
                        :src="`https://source.boringavatars.com/marble/120/${member.id}?colors=610AFA,FA0AF2,B00AFA,0E05FC,FF005C`"
                        alt="buyer icon"
                        class="h-5 w-5 -mt-0.5">
                    <p class="text-xl -mt-1">{{ member.codeNumber }} {{ member.name }}</p>
                    <p>{{ Math.round((member.used_yen / BUDGET) * 10000) / 100 }}%</p>
                </div>
                <div class="bg-slate-200 h-1 rounded-full">
                    <div
                        class="h-full bg-green-400 rounded-full"
                        :style="{ width: `${ Math.round((member.used_yen / BUDGET) * 10000) / 100 }%` }"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const BUDGET = 401384

const members = (await $fetch("/api/member/get",{
    method: "POST",
    body: {
        with_used_yens: true
    }
})).sort(( { used_yen: a }, { used_yen: b } ) => b-a)

definePageMeta({
  middleware: ["auth"]
})
</script>