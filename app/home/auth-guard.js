"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const AuthGuard = ({ children }) => {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/user/login")
        }
    }, [router])

    return children
}

export default AuthGuard
