import useAuth from "~/util/useAuth"

export default defineNuxtRouteMiddleware((to) => {
    const { checkLogin } = useAuth()
    if( !checkLogin() ){
        console.log("not login")
        return navigateTo("/login")
    }else{
        console.log("login")
    }
})  