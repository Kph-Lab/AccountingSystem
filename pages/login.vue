<template>
    <main class="w-full h-full grid place-content-center">
        <div class="max-w-xl w-full flex flex-col items-center gap-4 p-8">
            <Icon
                name="bi:shield-lock"
                class="text-8xl"/>
            <h2 class="text-4xl">ログイン</h2>
            <p class="text-center">ログインに使うGmailアドレスは<br>Discordで管理者に送信されたもののみ使用できます</p>
            <button
                class="border-2 border-black py-4 px-6 rounded-full"
                @click="login">
                Googleアカウントでログイン
            </button>
        </div>
    </main>
</template>
<script setup lang="ts">
import useAuth from '~/util/useAuth';

const { login } = useAuth()
</script>