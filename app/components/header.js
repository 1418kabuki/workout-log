"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LogOut, Plus } from "lucide-react"

const decodeJwtEmail = (token) => {
    try {
        const payload = token.split(".")[1]
        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))).email
    } catch {
        return null
    }
}

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isDemo, setIsDemo] = useState(false)
    const [isDemoHovered, setIsDemoHovered] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const token = localStorage.getItem("token")
        setIsLoggedIn(!!token)
        setIsDemo(!!token && decodeJwtEmail(token) === "demo@workout.app")
    }, [])

    const hideHeaderPaths = ["/user/login", "/user/register"]
    if (hideHeaderPaths.includes(pathname)) return null

    const handleLogout = () => {
        localStorage.removeItem("token")
        setIsLoggedIn(false)
        router.push("/user/login")
    }

    const handleDemo = async () => {
        const res = await fetch("/api/user/demo", { method: "POST" })
        const { token } = await res.json()
        localStorage.setItem("token", token)
        window.location.href = "/home"
    }

    return (
        <header style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.8rem 0 1.2rem",
            marginBottom: "0.5rem",
        }}>
            <Link href={isLoggedIn ? "/home" : "/"} style={{ textDecoration: "none" }}>
                <span style={{
                    fontSize: "2.2rem",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}>
                    WorkoutLog
                </span>
            </Link>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {isLoggedIn && pathname === "/records" && (
                    <Link
                        href="/menu/create"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.7rem 1.6rem",
                            background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                            color: "white",
                            borderRadius: "10rem",
                            fontSize: "1.4rem",
                            fontWeight: "500",
                            textDecoration: "none",
                        }}
                    >
                        <Plus size={15} />
                        追加
                    </Link>
                )}

                {isLoggedIn && !isDemo && (
                    <button
                        onClick={handleLogout}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            background: "none",
                            border: "1px solid #e5e7eb",
                            borderRadius: "10rem",
                            padding: "0.7rem 1.4rem",
                            cursor: "pointer",
                            fontSize: "1.3rem",
                            color: "#6b7280",
                            width: "auto",
                        }}
                    >
                        <LogOut size={14} />
                        ログアウト
                    </button>
                )}

                {(!isLoggedIn || isDemo) && pathname === "/" && (
                    <button
                        onClick={handleDemo}
                        onMouseEnter={() => setIsDemoHovered(true)}
                        onMouseLeave={() => setIsDemoHovered(false)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            background: "none",
                            border: "none",
                            borderRadius: "10rem",
                            padding: "0.7rem 1.6rem",
                            cursor: "pointer",
                            fontSize: "1.4rem",
                            color: "#6b7280",
                            width: "auto",
                            opacity: 1,
                            boxShadow: isDemoHovered ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
                            transition: "box-shadow 0.2s",
                        }}
                    >
                        デモを見る
                    </button>
                )}

                {(!isLoggedIn || isDemo) && (
                    <>
                        <Link
                            href="/user/login"
                            style={{
                                fontSize: "1.4rem",
                                color: "#6b7280",
                                textDecoration: "none",
                                padding: "0.7rem 1.6rem",
                                border: "1px solid #e5e7eb",
                                borderRadius: "10rem",
                            }}
                        >
                            ログイン
                        </Link>
                        <Link
                            href="/user/register"
                            style={{
                                fontSize: "1.4rem",
                                color: "white",
                                textDecoration: "none",
                                padding: "0.7rem 1.6rem",
                                background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                                borderRadius: "10rem",
                                fontWeight: "500",
                            }}
                        >
                            登録
                        </Link>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
