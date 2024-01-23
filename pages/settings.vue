<template>
  <div class="max-h-full overflow-y-auto w-full">
    <div class="flex flex-col gap-4 mx-auto max-w-2xl grow">
      <div
        v-for="admin in admins"
        class="flex flex-col p-2">
        <div class="flex flex-row gap-2 items-center">
          <h1 class="text-xl font-semibold">{{ admin.name }}</h1>
          <Icon
            v-if="admin.role == 'Admin'"
            class="text-xl text-purple-500"
            name="bi:person-circle"/>
        </div>
        <p class="text-white/30">{{ admin.mail }}</p>
      </div>
    </div>
  </div>
  <div class="absolute bottom-12 left-1/2 -translate-x-1/2">
    <input
      type="text"
      placeholder="名前"
      v-model="newAdmin.name">
    <input
      type="text"
      placeholder="メールアドレス"
      v-model="newAdmin.mail">
    <button
      @click="addAdmin">
      追加
    </button>
  </div>
</template>
<script setup lang="ts">
import type { Admin } from '@prisma/client';

const updateAdmins = async () => {
  const newAdmins = await $fetch("/api/admin/get");
  admins.value = newAdmins
}

const admins = ref<Admin[]>([])
updateAdmins()

const newAdmin = reactive<Partial<Pick<Admin, "mail" | "name" | "role">>>({})

const addAdmin = async () => {
  await $fetch("/api/admin/create", {
    method: "POST",
    body: newAdmin
  })
  newAdmin.name = undefined
  newAdmin.mail = undefined
  newAdmin.role = undefined
  
  updateAdmins()
}

definePageMeta({
  middleware: ["auth"]
});
</script>