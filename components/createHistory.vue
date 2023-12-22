<template>
    <div class="flex flex-row gap-4 items-end bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-2xl">
        <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-4 items-center">
                <input
                    type="text"
                    placeholder="物品名"
                    v-model="purchaseName"
                    class="text-xl grow bg-transparent outline-none">
                <RadioGroup v-model="toolOrArtwork" class="flex flex-row gap-2">
                    <RadioGroupOption
                        v-slot="{ checked }"
                        v-for="option in [
                            { label: '作品', value: 'Artwork' },
                            { label: '工具', value: 'Tool' }
                        ]"
                        :value="option.value">
                        <div
                            class="flex flex-row gap-2 items-center"
                            :class="{ 'opacity-40': !checked }">
                            <span class="h-8 w-8 grid place-content-center bg-blue-200 rounded-full">
                                <Icon name="bi:tools" v-if="option.label == '工具'"/>
                                <Icon name="bi:stars" v-if="option.label == '作品'"/>
                            </span>
                            {{ option.label }}
                        </div>
                    </RadioGroupOption>
                </RadioGroup>
            </div>
            <input type="text" placeholder="購入目的" v-model="reason" class="bg-transparent outline-none">
            <input type="text" placeholder="備考" v-model="memo" class="bg-transparent outline-none">
            <div class="flex flex-row gap-2">
                <Combobox v-model="selectedMember">
                    <ComboboxInput
                        @change="memberQuery = $event.target.value"
                        :display-value="(member) => `${(member as Member).codeNumber} ${(member as Member).name}`"
                        placeholder="購入者"
                        class="bg-transparent outline-none"/>
                    <ComboboxOptions
                        class="bg-white shadow-2xl shadow-black/10 p-4 max-h-40 rounded-xl overflow-y-auto flex flex-col gap-3 absolute -translate-y-[calc(100%+12px)]">
                        <ComboboxOption
                            v-for="member in filteredMembers"
                            :key="member.id"
                            :value="member"
                            class="flex flex-row gap-2 items-center">
                            <img
                                :src="`https://source.boringavatars.com/marble/120/${member.id}?colors=610AFA,FA0AF2,B00AFA,0E05FC,FF005C`"
                                alt="buyer icon"
                                class="h-5 w-5 -mt-0.5">
                            <p class="-mt-0.5">{{ member.codeNumber }} {{ member.name }}</p>
                        </ComboboxOption>
                    </ComboboxOptions>
                </Combobox>
                <input type="text" placeholder="店名 or URL" v-model="shopName" class="bg-transparent outline-none">
                <input type="date" placeholder="購入日" v-model="selectedDate" class="bg-transparent outline-none">
                <input
                    type="number"
                    placeholder="金額"
                    :value="price"
                    @input="(a) => price = Number((a as any).target.value as string)"
                    class="bg-transparent outline-none">
            </div>
        </div>
        <button @click="createHistoryFromInputedData"
            class="bg-blue-600/90 border-2 border-blue-600 h-8 w-8 grid place-content-center rounded-full text-white">
            <Icon name="bi:plus" class="text-xl" />
        </button>
    </div>
</template>
<script setup lang="ts">
import type { History, Member } from "@prisma/client"
import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    RadioGroup,
    RadioGroupOption,
} from '@headlessui/vue'

const emit = defineEmits<{
    ( e: "created" ): void
}>()

const purchaseName = ref<string>()
const reason = ref<string>()
const memo = ref<string>()
const shopName = ref<string>()
const selectedDate = ref<string>()
const price = ref<number>()
const toolOrArtwork = ref<"Tool" | "Artwork">()

const members = (await $fetch("/api/member/get", { method: "GET" }) as unknown as Member[]).sort(({ codeNumber: a }, { codeNumber: b }) => b-a)
const selectedMember = ref<typeof members[number] | undefined>()

const memberQuery = ref<string>("")
const filteredMembers = computed(() =>
    memberQuery.value === ''
      ? members
      : members.filter(({ id, name, codeNumber }) => {
          return id.toString().includes(memberQuery.value) || codeNumber.toString().includes(memberQuery.value) || name.includes(memberQuery.value)
        })
)

async function createHistory(newHistory: Omit<Omit<History, "id">, "returned">) {
    await $fetch("/api/history/create", {
        method: "POST",
        body: newHistory
    })
}

async function createHistoryFromInputedData() {
    if( !purchaseName.value ) throw new Error("商品名が入力されてないです！")
    if( !price.value ) throw new Error("金額が入力されてないです！")
    if( price.value <= 0, price.value % 1 != 0 ) throw new Error("金額は自然数である必要があります！")
    if( !reason.value ) throw new Error("目的が入力されてないです！")
    if( !shopName.value ) throw new Error("購入場所が入力されてないです！")
    if( !selectedDate.value ) throw new Error("日付が入力されてないです！")
    if( !selectedMember.value ) throw new Error("購入者が入力されてないです！")
    if( !toolOrArtwork.value ) throw new Error("作品か工具かが入力されてないです！")

    await createHistory({
        buyerId: selectedMember.value?.id,
        date: new Date(selectedDate.value),
        price: price.value,
        purchaseName: purchaseName.value,
        toolOrArtwork: toolOrArtwork.value,
        reason: reason.value,
        shopNameOrURL: shopName.value,
        memo: memo.value ?? null
    })

    purchaseName.value = undefined
    price.value = undefined
    reason.value = undefined
    shopName.value = undefined
    selectedDate.value = undefined
    selectedMember.value = undefined
    toolOrArtwork.value = undefined

    emit("created")
}
</script>