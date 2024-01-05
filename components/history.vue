<template>
    <div
        class="flex flex-col gap-2 p-2 rounded-lg"
        :class="{
            'bg-orange-100': isBunkasaiYosan
        }">
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
</template>
<script setup lang="ts">
import type { History } from '~/model/history';

const { history } = defineProps<{
    history: History
}>()

const isBunkasaiYosan = history.memo == "文化祭予算"
</script>