"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { jwtVerify } from "jose"

const AuthGuard = ({ children }) => {
    const router = useRouter()

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token")

            if (!token) {
                router.push("/user/login")
                return
            }

            try {
                const secretKey = new TextEncoder().encode("workout-app")
                const decodedJwt = await jwtVerify(token, secretKey)
                setLoginUserEmail(decodedJwt.payload.email)
            } catch (error) {
                router.push("/user/login")
            }
        }
        checkToken()
    }, [router])

    return children
}

export default AuthGuard
