"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

const features = [
    { icon: "📅", title: "カレンダー記録", desc: "トレーニングをカレンダーで管理。いつ何をやったか一目でわかる。" },
    { icon: "📊", title: "成長グラフ", desc: "種目ごとの重量推移を折れ線グラフで確認。月平均で成長を実感。" },
    { icon: "💪", title: "種目ライブラリ", desc: "部位別に種目を一覧表示。正しいフォームの参考に。" },
]

const LandingPage = () => {
    const router = useRouter()

    const handleDemo = async () => {
        const res = await fetch("/api/user/demo", { method: "POST" })
        const { token } = await res.json()
        localStorage.setItem("token", token)
        router.push("/home")
    }

    return (
        <div>
            {/* Hero */}
            <div style={{
                background: "linear-gradient(135deg, #FF63A4 0%, #FFD873 100%)",
                borderRadius: "2rem",
                padding: "5rem 2.5rem",
                marginBottom: "4rem",
                color: "white",
                textAlign: "center",
            }}>
                <p style={{ fontSize: "1.4rem", opacity: 0.85, margin: "0 0 1rem" }}>
                    筋トレをもっとシンプルに
                </p>
                <h1 style={{
                    fontSize: "3.6rem",
                    fontWeight: "700",
                    lineHeight: "1.3",
                    margin: "0 0 1.5rem",
                }}>
                    記録して、<br />成長を見よう 💪
                </h1>
                <p style={{ fontSize: "1.5rem", opacity: 0.9, margin: "0 0 3rem", lineHeight: "1.8" }}>
                    日々のトレーニングを記録し、<br />自分の成長をグラフで確認できるアプリ。
                </p>
                <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link
                        href="/user/register"
                        style={{
                            padding: "1.2rem 3rem",
                            background: "white",
                            color: "#FF63A4",
                            borderRadius: "10rem",
                            fontSize: "1.6rem",
                            fontWeight: "700",
                            textDecoration: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                    >
                        無料で始める
                    </Link>
                    <Link
                        href="/user/login"
                        style={{
                            padding: "1.2rem 3rem",
                            background: "rgba(255,255,255,0.2)",
                            color: "white",
                            borderRadius: "10rem",
                            fontSize: "1.6rem",
                            fontWeight: "600",
                            textDecoration: "none",
                            border: "1.5px solid rgba(255,255,255,0.6)",
                        }}
                    >
                        ログイン
                    </Link>
                </div>
                <button
                    onClick={handleDemo}
                    style={{
                        marginTop: "1.5rem",
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "1.3rem",
                        cursor: "pointer",
                        textDecoration: "underline",
                    }}
                >
                    登録なしでデモを試す →
                </button>
            </div>

            {/* Features */}
            <div style={{ marginBottom: "4rem" }}>
                <h2 style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#333",
                    textAlign: "center",
                    margin: "0 0 2.5rem",
                }}>
                    できること
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    {features.map((f) => (
                        <div key={f.title} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "1.6rem",
                            background: "white",
                            border: "1px solid #f0f0f0",
                            borderRadius: "1.5rem",
                            padding: "2rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}>
                            <div style={{
                                fontSize: "2.4rem",
                                width: "4.8rem",
                                height: "4.8rem",
                                background: "linear-gradient(135deg, rgba(255,99,164,0.1), rgba(255,216,115,0.1))",
                                borderRadius: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}>
                                {f.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: "1.6rem", fontWeight: "700", color: "#333", margin: "0 0 0.5rem" }}>
                                    {f.title}
                                </p>
                                <p style={{ fontSize: "1.3rem", color: "#6b7280", margin: 0, lineHeight: "1.7" }}>
                                    {f.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div style={{
                background: "linear-gradient(135deg, rgba(255,99,164,0.08), rgba(255,216,115,0.08))",
                border: "1px solid #f0f0f0",
                borderRadius: "2rem",
                padding: "4rem 2.5rem",
                textAlign: "center",
                marginBottom: "2rem",
            }}>
                <h2 style={{ fontSize: "2.2rem", fontWeight: "700", color: "#333", margin: "0 0 1rem" }}>
                    今日から記録を始めよう
                </h2>
                <p style={{ fontSize: "1.4rem", color: "#6b7280", margin: "0 0 2.5rem" }}>
                    無料で使えます。
                </p>
                <Link
                    href="/user/register"
                    style={{
                        display: "inline-block",
                        padding: "1.2rem 4rem",
                        background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                        color: "white",
                        borderRadius: "10rem",
                        fontSize: "1.6rem",
                        fontWeight: "700",
                        textDecoration: "none",
                        boxShadow: "0 4px 16px rgba(255,99,164,0.3)",
                    }}
                >
                    無料で始める
                </Link>
            </div>
        </div>
    )
}

export default LandingPage
