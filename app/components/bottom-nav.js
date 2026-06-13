"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Dumbbell, TrendingUp } from "lucide-react"

const tabs = [
    { href: "/", label: "ホーム", icon: Home },
    { href: "/records", label: "記録", icon: Calendar },
    { href: "/exercises", label: "種目", icon: Dumbbell },
    { href: "/progress", label: "変化", icon: TrendingUp },
]

const hideNavPaths = ["/user/login", "/user/register"]

const BottomNav = () => {
    const pathname = usePathname()

    if (hideNavPaths.includes(pathname)) return null

    return (
        <nav style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderTop: "1px solid #e5e7eb",
            zIndex: 50,
        }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex" }}>
                {tabs.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "1.2rem 0 1rem",
                                gap: "0.3rem",
                                textDecoration: "none",
                                color: isActive ? "#FF63A4" : "#9ca3af",
                                transition: "color 0.2s",
                                fontSize: "1rem",
                            }}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                            <span style={{ fontSize: "1.1rem", fontWeight: isActive ? "600" : "400" }}>
                                {label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

export default BottomNav
