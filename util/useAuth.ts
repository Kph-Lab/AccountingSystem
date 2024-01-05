import { getAuth, onAuthStateChanged, type User, GoogleAuthProvider, signInWithPopup, type AuthError, signOut } from "firebase/auth"
import { firebaseApp } from "./firebase"

const provider = new GoogleAuthProvider();

export default () => {
    const auth = getAuth(firebaseApp);
    
    const checkLogin = () => !!auth.currentUser
    
    const observeLogin =  (
        loginCallback?: (user: User) => void,
        notLoginCallback?: () => void
    ) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                if( loginCallback ) loginCallback(user)
            } else {
                if( notLoginCallback ) notLoginCallback()
            }
        });
    }

    const login = async () => {
        await signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user
                console.log(user)
            }).catch((error: AuthError) => {
                throw new Error(error.message)
            });
    }

    const logout = async () => {
        await signOut(auth)
            .then(() => {
                const router = useRouter()
                router.push("/")
            })
            .catch((error) => {
                throw new Error(error)
            })
    }

    return { observeLogin, checkLogin, login, logout }
}