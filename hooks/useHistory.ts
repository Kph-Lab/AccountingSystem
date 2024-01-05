import type { History } from "../model/history"

export default () => {
    const histories = ref<History[]>([])
    
    const used_money = computed(() => {
      let money = 0
      histories.value.forEach(history => {
        if (history.memo != "文化祭予算") money += history.price
      })
      return money
    })
    
    async function getHistories() {
      const histories = await $fetch("/api/history/get", { method: "GET" }) as unknown as History[]
      return histories
    }
    
    async function updateHistories() {
      histories.value = await getHistories()
    }

    return { histories, used_money,  updateHistories }
}