"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, ChevronRight } from "lucide-react"
import AuthGuard from "./auth-guard"

const HomePage = () => {
    const [total, setTotal] = useState(0)
    const [recent, setRecent] = useState([])
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) { router.push("/user/login"); return }

        fetch("/api/menu/readall", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(({ data }) => {
                if (!data) return
                setTotal(data.length)
                setRecent([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3))
            })
    }, [router])

    return (
        <AuthGuard>
        <div>
            {/* Hero / Greeting */}
            <div style={{
                background: "linear-gradient(135deg, #FF63A4 0%, #FFD873 100%)",
                borderRadius: "2rem",
                padding: "3rem 2.5rem 2.5rem",
                marginBottom: "2.5rem",
                color: "white",
            }}>
                <p style={{ fontSize: "1.4rem", opacity: 0.85, marginBottom: "0.4rem" }}>
                    おかえりなさい！
                </p>
                <h1 style={{
                    fontSize: "2.8rem",
                    fontWeight: "700",
                    lineHeight: "1.3",
                    margin: "0 0 2rem",
                }}>
                    今日も<br />鍛えていこう 💪
                </h1>
                <Link
                    href="/menu/create"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "1rem 2.5rem",
                        background: "white",
                        color: "#FF63A4",
                        borderRadius: "10rem",
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        textDecoration: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                >
                    <Plus size={18} strokeWidth={2.5} />
                    今日の記録を追加
                </Link>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div style={{
                    background: "white",
                    border: "1px solid #f0f0f0",
                    borderRadius: "1.5rem",
                    padding: "2rem 1.8rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}>
                    <p style={{ fontSize: "1.2rem", color: "#9ca3af", margin: "0 0 0.6rem" }}>累計記録</p>
                    <p style={{ fontSize: "0", margin: 0 }}>
                        <span style={{ fontSize: "3.2rem", fontWeight: "700", color: "#FF63A4" }}>{total}</span>
                        <span style={{ fontSize: "1.4rem", color: "#9ca3af", marginLeft: "0.4rem" }}>件</span>
                    </p>
                </div>
                <div style={{
                    background: "white",
                    border: "1px solid #f0f0f0",
                    borderRadius: "1.5rem",
                    padding: "2rem 1.8rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}>
                    <p style={{ fontSize: "1.2rem", color: "#9ca3af", margin: "0 0 0.6rem" }}>種目数</p>
                    <p style={{ fontSize: "0", margin: 0 }}>
                        <span style={{ fontSize: "3.2rem", fontWeight: "700", color: "#FFD873" }}>
                            {new Set(recent.map(r => r.exercise)).size}
                        </span>
                        <span style={{ fontSize: "1.4rem", color: "#9ca3af", marginLeft: "0.4rem" }}>種</span>
                    </p>
                </div>
            </div>

            {/* Recent Records */}
            <div>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: "700", margin: 0, color: "#333" }}>
                        最近の記録
                    </h2>
                    <Link
                        href="/records"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.3rem",
                            color: "#FF63A4",
                            textDecoration: "none",
                            fontWeight: "500",
                        }}
                    >
                        すべて見る
                        <ChevronRight size={15} />
                    </Link>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {recent.map(record => (
                        <Link
                            key={record.id}
                            href={`/menu/readsingle/${record.id}`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "white",
                                border: "1px solid #f0f0f0",
                                borderRadius: "1.5rem",
                                padding: "1.6rem 2rem",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
                                <div style={{
                                    width: "4.2rem",
                                    height: "4.2rem",
                                    background: "linear-gradient(135deg, rgba(255,99,164,0.12), rgba(255,216,115,0.12))",
                                    borderRadius: "1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "2rem",
                                    flexShrink: 0,
                                }}>
                                    💪
                                </div>
                                <div>
                                    <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", margin: 0 }}>
                                        {record.exercise}
                                    </p>
                                    <p style={{ fontSize: "1.2rem", color: "#9ca3af", margin: "0.3rem 0 0" }}>
                                        {new Date(record.createdAt).toLocaleDateString("ja-JP", {
                                            month: "numeric", day: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ fontSize: "1.8rem", fontWeight: "700", color: "#FF63A4", margin: 0 }}>
                                    {record.weight}kg
                                </p>
                                <p style={{ fontSize: "1.2rem", color: "#9ca3af", margin: "0.2rem 0 0" }}>
                                    {record.reps}回
                                </p>
                            </div>
                        </Link>
                    ))}

                    {recent.length === 0 && (
                        <div style={{
                            textAlign: "center",
                            padding: "5rem 2rem",
                            background: "white",
                            borderRadius: "1.5rem",
                            border: "2px dashed #e5e7eb",
                        }}>
                            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏋️</p>
                            <p style={{ fontSize: "1.6rem", color: "#9ca3af", margin: "0 0 1.5rem" }}>
                                まだ記録がありません
                            </p>
                            <Link
                                href="/menu/create"
                                style={{
                                    fontSize: "1.4rem",
                                    color: "#FF63A4",
                                    textDecoration: "none",
                                    fontWeight: "500",
                                }}
                            >
                                最初の記録を追加しよう →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </AuthGuard>
    )
}

export default HomePage
