"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LogOut, Plus } from "lucide-react"

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"))
    }, [])

    const hideHeaderPaths = ["/user/login", "/user/register"]
    if (hideHeaderPaths.includes(pathname)) return null

    const handleLogout = () => {
        localStorage.removeItem("token")
        setIsLoggedIn(false)
        router.push("/user/login")
    }

    return (
        <header style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.8rem 0 1.2rem",
            marginBottom: "0.5rem",
        }}>
            <Link href="/" style={{ textDecoration: "none" }}>
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
                {isLoggedIn ? (
                    <>
                        {pathname === "/records" && (
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
                    </>
                ) : (
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
