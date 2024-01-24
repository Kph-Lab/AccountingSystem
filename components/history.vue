<template>
    <div
        class="flex flex-row gap-4 items-center p-4 rounded-lg"
        :class="{
            'bg-orange-500/30': isBunkasaiYosan,
            'bg-black': !isBunkasaiYosan
        }">
        <div class="flex flex-col gap-2 grow">
            <div class="flex flex-col">
                <p class="text-lg font-semibold">
                    {{ history.purchaceName }}
                    <span class="text-sm font-normal">({{ history.toolOrArtwork }})</span>
                </p>
                <p class="text-xs text-white/60 pl-0.5">{{ history.reason }}</p>
                </div>
                <div class="flex flex-row gap-4 pl-1 text-sm text-white/80">
                <p>
                    <Icon name="bi:currency-yen" class="text-sm -mt-1 text-white/60"/>
                    {{ history.price }}
                </p>
                <p>
                    <Icon name="bi:calendar" class="text-sm -mt-1 text-white/60"/>
                    {{ history.date }}
                </p>
                <p>
                    <Icon name="bi:shop" class="text-sm -mt-1 text-white/60"/>
                    {{ history.shop }}
                </p>
                <button
                    @click="getHistoryImage"
                    class="flex flex-row items-baseline">
                    <Icon name="bi:file-earmark-text" class="text-sm -mt-1 text-white/60"/>
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
            class="w-12 h-12 rounded-full text-white grid place-content-center text-xl"
            @click="uploadHistoryImage">
            <Icon name="bi:cloud-upload"/>
        </button>
    </div>
    <div 
        class="top-0 left-0 fixed w-screen h-screen z-10"
        v-if="historyImageURL"
        @click="historyImageURL = undefined">
        <div class="w-full h-full bg-black/40"/>
        <img
            :src="historyImageURL"
            class="fixed max-w-sm w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    </div>
</template>
<script setup lang="ts">
import type { History } from '~/model/history';
import { getStorage, ref as reference, getDownloadURL, uploadBytes } from "firebase/storage";

const historyImageURL = ref<string>()

const props = defineProps<{
    history: History
}>()

const folderName = "2023年度"
const isBunkasaiYosan = props.history.memo == "文化祭予算"

const storage = getStorage();
const historyImageRef = computed(() => {
    return reference(storage, `${folderName}/Ampoi.png`)
})

const getHistoryImage = async () => {
    historyImageURL.value = await getDownloadURL(historyImageRef.value)
}

const canvasToBlob = (canvas: HTMLCanvasElement) => new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve)
})

const uploadHistoryImage = async () => {
    const imageInputElement = document.createElement("input")
    imageInputElement.type = "file"
    imageInputElement.accept = "image/**"
    
    imageInputElement.addEventListener("change", async () => {
        if( !imageInputElement.files ) throw new Error("ファイルが入力されてません")
        const file = imageInputElement.files[0]
        if( file && file.type.startsWith("image/") ){
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = async () => {
                    const width = img.width;
                    const height = img.height;

                    const convertCanvas = document.createElement("canvas")
                    convertCanvas.width = width
                    convertCanvas.height = height

                    const ctx = convertCanvas.getContext("2d")
                    if( !ctx ) throw new Error("?????")
                    ctx.drawImage(img, 0, 0)

                    const blob = await canvasToBlob(convertCanvas)
                    if( !blob ) throw new Error("blobがnullです！")
                    await uploadBytes(historyImageRef.value, blob)
                }

                if( typeof e.target?.result != "string" ) throw new Error("???")
                img.src = e.target.result
            };
            reader.readAsDataURL(file);
        }else{
            console.error("選択された画像はファイルではないです")
        }
    })

    imageInputElement.click()
}
</script>