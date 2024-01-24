// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-icon"],
  nitro: {
    preset: "vercel"
  },
  runtimeConfig: {
    historyImageApiUrl: "",
    public: {
      historyImageFolderName: "2023年度"
    }
  }
})