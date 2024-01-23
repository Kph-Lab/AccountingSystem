<template>
  <div class="flex flex-row">
    <header class="bg-black px-4 py-8 flex flex-col gap-8 text-white">
      <NuxtLink to="/">
        <Icon name="bi:card-checklist" class="text-2xl" />
      </NuxtLink>
      <NuxtLink to="/members">
        <Icon name="bi:people" class="text-2xl" />
      </NuxtLink>
      <NuxtLink to="/settings">
        <Icon name="bi:building" class="text-2xl" />
      </NuxtLink>
      <div class="grow" />
      <button @click="logout">
        <Icon name="bi:box-arrow-left" class="text-2xl" />
      </button>
    </header>
    <main class="p-4 pb-10 grow h-screen flex flex-col items-center bg-zinc-900 text-white">
      <NuxtPage />
    </main>
  </div>
</template>
<script setup lang="ts">
import useAuth from './util/useAuth';

const { logout } = useAuth()
</script>