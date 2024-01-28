<template>
    <div 
        class="top-0 left-0 fixed w-screen h-screen z-10">
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
import { getStorage, ref as reference, getDownloadURL, uploadBytes } from "firebase/storage";

import { type History } from "../../model/history"

const showHistoryModal = defineModel<boolean>("show", { required: true })
const historyImageURL = ref<string>()

const { historyImageFolderName } = useRuntimeConfig().public
const storage = getStorage();

const historyImageRef = computed(() => {
    return reference(storage, `${historyImageFolderName}/${props.history.id}.png`)
})

const getHistoryImage = async () => {
    historyImageURL.value = await getDownloadURL(historyImageRef.value)
}

const props = defineProps<{
    history: History
}>()

const emit = defineEmits<{
    (e: "updateImage"): void
}>()

const canvasToBlob = (canvas: HTMLCanvasElement) => new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve)
})

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

            emit("updateImage")
            await getHistoryImage()
        }

        if( typeof e.target?.result != "string" ) throw new Error("???")
        img.src = e.target.result
    };
    reader.readAsDataURL(file);
}

onMounted(() => {
    getHistoryImage()
})
</script>