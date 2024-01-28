<template>
    <div
        class="flex flex-row gap-4 items-center p-4 rounded-lg"
        :class="{
            'bg-orange-500/30': isBunkasaiYosan,
            'bg-black': !isBunkasaiYosan
        }"
        @click="showHistoryModal = true">
        <div class="flex flex-col gap-2 grow">
            <div class="flex flex-col">
                <p class="text-lg font-semibold">
                    {{ history.purchaceName }}
                    <span class="text-sm font-normal">({{ history.toolOrArtwork }})</span>
                </p>
                <p class="text-xs text-white/60 pl-0.5">{{ history.reason }}</p>
            </div>
            <div class="flex flex-row gap-4 pl-1 text-sm text-white/80">
                <p class="basis-1/5 overflow-hidden text-ellipsis whitespace-nowrap">
                    <Icon name="bi:currency-yen" class="text-sm -mt-1 text-white/60"/>
                    {{ history.price }}
                </p>
                <p class="basis-1/5 overflow-hidden text-ellipsis whitespace-nowrap">
                    <Icon name="bi:calendar" class="text-sm -mt-1 text-white/60"/>
                    {{ history.date }}
                </p>
                <p class="basis-1/5 overflow-hidden text-ellipsis whitespace-nowrap">
                    <Icon name="bi:shop" class="text-sm -mt-1 text-white/60"/>
                    {{ history.shop }}
                </p>
                <p
                    class="flex flex-row items-baseline basis-1/5 overflow-hidden text-ellipsis whitespace-nowrap"
                    :class="{
                        'text-white/60': !includeHistoryImage,
                        'text-blue-500': includeHistoryImage
                    }">
                    <Icon name="bi:file-earmark-text" class="text-sm -mt-1"/>
                    <p>領収書</p>
                </p>
                <div class="flex flex-row gap-1 items-center basis-1/5 overflow-hidden text-ellipsis whitespace-nowrap">
                    <img
                        :src="`https://source.boringavatars.com/marble/120/${history.buyer.id}?colors=610AFA,FA0AF2,B00AFA,0E05FC,FF005C`"
                        alt="buyer icon"
                        class="h-4 w-4 -mt-0.5">
                    <p>{{ history.buyer.name }}</p>
                </div>
            </div>
            <p
                v-if="history.memo"
                style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;"
                class="grow pl-1 text-white/60 text-xs"
            >{{history.memo}}</p>
        </div>
    </div>
    <HistoryModal
        v-if="showHistoryModal"
        v-model:show="showHistoryModal"
        :history="history"
        @updateImage="onImageUpdated"/>
</template>
<script setup lang="ts">
import type { History } from '~/model/history';

const showHistoryModal = ref(false)

const props = defineProps<{
    history: History
    includeHistoryImage: boolean
}>()

const isBunkasaiYosan = props.history.memo == "文化祭予算"

const onImageUpdated = async () => {
    emit("updateImages")
}

const emit = defineEmits<{
    (e: "updateImages"): void
}>()
</script>