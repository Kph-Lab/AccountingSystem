<template>
    <div
        class="flex flex-row gap-4 items-center p-4 rounded-lg"
        :class="{
            'bg-orange-500/30': isBunkasaiYosan,
            'bg-black': !isBunkasaiYosan
        }"
        @click="() => {
            getHistoryImage()
            showHistoryModal = true
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
    <div 
        class="top-0 left-0 fixed w-screen h-screen z-10"
        v-if="showHistoryModal">
        <div
            class="w-full h-full bg-black/40"
            @click="showHistoryModal = false"/>
        <div class="rounded-3xl flex flex-col gap-4 bg-zinc-900 p-8 fixed max-w-xl w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div class="flex flex-row gap-2 text-3xl font-semibold items-baseline">
                <p>{{ history.purchaceName }}</p>
                <p class="text-white/30 text-2xl">#{{ history.id }}</p>
            </div>
            <div class="flex flex-col gap-4">
                <div class="flex flex-row gap-3 items-center">
                    <Icon name="bi:currency-yen" class="text-lg -mt-1 text-white/60"/>
                    <p>{{ history.price }}</p>
                </div>
                <div class="flex flex-row gap-3 items-center">
                    <Icon name="bi:calendar" class="text-lg -mt-1 text-white/60"/>
                    <p>{{ history.date }}</p>
                </div>
                <div class="flex flex-row gap-3 items-center">
                    <Icon name="bi:shop" class="text-lg -mt-1 text-white/60"/>
                    <p>{{ history.shop }}</p>
                </div>
                <div class="flex flex-row gap-1 items-center">
                    <img
                        :src="`https://source.boringavatars.com/marble/120/${history.buyer.id}?colors=610AFA,FA0AF2,B00AFA,0E05FC,FF005C`"
                        alt="buyer icon"
                        class="h-4 w-4 -mt-0.5">
                    <p>{{ history.buyer.name }}</p>
                </div>
            </div>
            <div class="flex flex-row gap-4 pl-1 text-sm text-white/80">
                <p
                    v-if="history.memo"
                    style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;"
                >{{ history.memo }}</p>
            </div><!--TODO:ここのUI改善-->
            <div class="min-h-40 max-h-[400px] overflow-y-auto">
                <img
                    v-if="historyImageURL"
                    :src="historyImageURL"
                    class="w-full">
                <div
                    v-else
                    class="w-full h-40 border-white/40 bg-zinc-800/40 text-white/40 border-2 border-dotted rounded-xl grid place-content-center">
                    <div class="flex flex-row gap-4 items-center text-2xl">
                        <Icon name="bi:receipt"/>
                        <div
                            class="flex flex-col"
                            @paste="registerReceiptWithPaste">
                            <p>領収書をペースト</p>
                            <button
                                class="text-xs"
                                @click="registerReceiptWithDialog">
                                またはここをクリックしてファイルを選択
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { History } from '~/model/history';
import { getStorage, ref as reference, getDownloadURL, uploadBytes } from "firebase/storage";

const historyImageURL = ref<string>()
const showHistoryModal = ref(false)

const props = defineProps<{
    history: History
    includeHistoryImage: boolean
}>()

const isBunkasaiYosan = props.history.memo == "文化祭予算"

const { historyImageFolderName } = useRuntimeConfig().public
const storage = getStorage();
const historyImageRef = computed(() => {
    return reference(storage, `${historyImageFolderName}/${props.history.id}.png`)
})

const getHistoryImage = async () => {
    historyImageURL.value = await getDownloadURL(historyImageRef.value)
}

const canvasToBlob = (canvas: HTMLCanvasElement) => new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve)
})

const emit = defineEmits<{
    (e: "updateImages"): void
}>()

const registerReceiptWithDialog = () => {
    const imageInputElement = document.createElement("input")
    imageInputElement.type = "file"
    imageInputElement.accept = "image/**"
    
    imageInputElement.addEventListener("change", async () => {
        if( !imageInputElement.files ) throw new Error("ファイルが入力されてません")
        const file = imageInputElement.files[0]
        registerReceipt(file)
    })

    imageInputElement.click()
}

const registerReceiptWithPaste = (event: ClipboardEvent) => {
    if( event.clipboardData ){
        const item = event.clipboardData.items[0]
        const file = item.getAsFile()
        registerReceipt(file)
    }
}

const registerReceipt = async (file: File | null) => {
    if( !file || !file.type.startsWith("image/") ) throw new Error("ファイルは画像じゃないです！")
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

            emit("updateImages")
            await getHistoryImage()
        }

        if( typeof e.target?.result != "string" ) throw new Error("???")
        img.src = e.target.result
    };
    reader.readAsDataURL(file);
}
</script>