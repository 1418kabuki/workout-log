"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Dumbbell, TrendingUp } from "lucide-react"

const tabs = [
    { href: "/home", label: "ホーム", icon: Home },
    { href: "/records", label: "記録", icon: Calendar },
    { href: "/exercises", label: "種目", icon: Dumbbell },
    { href: "/progress", label: "成長", icon: TrendingUp },
]

const hideNavPaths = ["/user/login", "/user/register", "/"]

const BottomNav = () => {
    const pathname = usePathname()

    if (hideNavPaths.includes(pathname)) return null

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card">
            <div className="mx-auto flex max-w-[110rem]">
                {tabs.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-1 flex-col items-center gap-[0.3rem] py-[1.2rem] pb-[1rem] transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                            <span className={`text-[1.1rem] ${isActive ? "font-semibold" : "font-normal"}`}>
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
