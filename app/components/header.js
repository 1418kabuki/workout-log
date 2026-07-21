"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

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

    const pillButton = "h-auto rounded-full px-[1.6rem] py-[0.7rem] text-[1.4rem] font-medium"

    return (
        <header className="mb-[0.5rem] flex items-center justify-between py-[1.8rem] pb-[1.2rem]">
            <Link href={isLoggedIn ? "/home" : "/"}>
                <span className="text-[2.2rem] font-bold text-primary">
                    WorkoutLog
                </span>
            </Link>

            <div className="flex items-center gap-[1rem]">
                {isLoggedIn && !isDemo && (
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className={`${pillButton} font-normal text-muted-foreground`}
                    >
                        <LogOut className="size-[1.4rem]" />
                        ログアウト
                    </Button>
                )}

                {(!isLoggedIn || isDemo) && pathname === "/" && (
                    <Button
                        variant="ghost"
                        onClick={handleDemo}
                        className={`${pillButton} font-normal text-muted-foreground`}
                    >
                        デモを見る
                    </Button>
                )}

                {(!isLoggedIn || isDemo) && (
                    <>
                        <Button asChild variant="outline" className={`${pillButton} font-normal text-muted-foreground`}>
                            <Link href="/user/login">ログイン</Link>
                        </Button>
                        <Button asChild className={pillButton}>
                            <Link href="/user/register">登録</Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
