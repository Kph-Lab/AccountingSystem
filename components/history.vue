<template>
    <div
        class="flex flex-row gap-4 items-center p-2 rounded-lg"
        :class="{
            'bg-orange-100': isBunkasaiYosan
        }">
        <div class="flex flex-col gap-2 grow">
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
                <button
                    @click="getImage"
                    class="flex flex-row items-baseline">
                    <Icon name="bi:file-earmark-text" class="text-sm -mt-1 text-black/60"/>
                    <p class="decoration-dotted decoration-black">領収書</p>
                </button>
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
        <button
            class="w-12 h-12 rounded-full bg-slate-100 text-slate-500 grid place-content-center text-xl">
            <Icon name="bi:three-dots"/>
        </button>
    </div>
    <div 
        class="top-0 left-0 fixed w-screen h-screen z-10"
        v-if="historyImageURL"
        @click="historyImageURL = undefined">
        <div class="w-full h-full bg-black/20"/>
        <img
            :src="historyImageURL"
            class="drop-shadow-xl fixed max-w-sm w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    </div>
</template>
<script setup lang="ts">
import type { History } from '~/model/history';
import { getStorage, ref as reference, getDownloadURL } from "firebase/storage";

const storage = getStorage();
const spaceRef = reference(storage, 'Ampoi.png');

const historyImageURL = ref<string>()

const { history } = defineProps<{
    history: History
}>()

const isBunkasaiYosan = history.memo == "文化祭予算"

const getImage = async () => {
    historyImageURL.value = await getDownloadURL(spaceRef)
}
</script>