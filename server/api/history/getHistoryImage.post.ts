const runtimeConfig = useRuntimeConfig()
const apiURL = runtimeConfig.historyImageApiUrl

export default defineEventHandler(async (event) => {
    const data = await readBody(event)
    
    const paramsText = new URLSearchParams({
        id: "tesutoyou"
    }).toString()

    const imageText = await fetch(`${apiURL}?${paramsText}`, {
        method: "get"
    })
        .then(async (res) => await res.text())
        .catch((e) => {
            console.warn(e)
        })

    return imageText
})