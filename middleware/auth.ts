import useAuth from "~/util/useAuth"

export default defineNuxtRouteMiddleware(async () => {
    const { auth } = useAuth()
    if( auth.currentUser ){
        const admins = await $fetch("/api/admin/get")
        const isAdmin = !!admins.find(admin => admin.mail == auth.currentUser?.email )
        
        if( isAdmin ) return
    }
    return navigateTo("/login")
})  