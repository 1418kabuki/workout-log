"use client"

import Link from "next/link"

const steps = [
    { num: "1", title: "記録する", desc: "種目・重量・回数を入力するだけ。複数種目もまとめて1回で保存できる。" },
    { num: "2", title: "グラフで見る", desc: "種目ごとの重量推移や、ワークアウト頻度を自動でグラフ化。" },
    { num: "3", title: "種目ライブラリ", desc: "部位別に整理された種目一覧から、正しいフォームをすぐ確認できる。" },
]

const heroStats = [
    { label: "総トレーニング回数", value: "128", unit: "回" },
    { label: "総ボリューム", value: "42.3", unit: "t" },
    { label: "連続記録日数", value: "6", unit: "日" },
]

const LandingPage = () => {
    const handleDemo = async () => {
        const res = await fetch("/api/user/demo", { method: "POST" })
        const { token } = await res.json()
        localStorage.setItem("token", token)
        window.location.href = "/home"
    }

    return (
        <div>
            {/* Hero */}
            <div style={{ padding: "5rem 0 2rem", textAlign: "center" }}>
                {/* <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1.4rem",
                    background: "rgba(255,99,164,0.08)",
                    borderRadius: "10rem",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "#FF63A4",
                    marginBottom: "2rem", 
                }}>
                    💪 筋トレ記録アプリ
                </div> */}

                <h1 style={{
                    fontSize: "4.2rem",
                    fontWeight: "700",
                    lineHeight: "1.25",
                    margin: "0 0 1.8rem",
                    color: "#222",
                }}>
                    記録して、<br />
                    <span style={{
                        background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        成長を実感しよう
                    </span>
                </h1>

                <p style={{
                    fontSize: "1.6rem",
                    color: "#6b7280",
                    margin: "0 auto 3rem",
                    lineHeight: "1.8",
                    maxWidth: "44rem",
                }}>
                    日々のトレーニングを記録するだけで、重量の推移や継続日数を自動でグラフ化。
                    <br />次の一歩がはっきり見えるようになります。
                </p>

                <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4.5rem" }}>
                    <Link
                        href="/user/register"
                        style={{
                            padding: "1.3rem 3.2rem",
                            background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                            color: "white",
                            borderRadius: "10rem",
                            fontSize: "1.6rem",
                            fontWeight: "700",
                            textDecoration: "none",
                            boxShadow: "0 8px 24px rgba(255,99,164,0.28)",
                        }}
                    >
                        無料で始める
                    </Link>
                    <button
                        onClick={handleDemo}
                        style={{
                            padding: "1.3rem 3.2rem",
                            background: "white",
                            color: "#333",
                            border: "1.5px solid #e5e7eb",
                            borderRadius: "10rem",
                            fontSize: "1.6rem",
                            fontWeight: "600",
                            textDecoration: "none",
                            cursor: "pointer",
                            width: "auto",
                        }}
                    >
                        デモを見る
                    </button>
                </div>

                {/* Hero visual: 実際の画面をイメージしたプレビュー */}
                <div style={{
                    maxWidth: "58rem",
                    margin: "0 auto",
                    background: "white",
                    border: "1px solid #f0f0f0",
                    borderRadius: "2rem",
                    padding: "2.8rem",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.09)",
                    textAlign: "left",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
                        <p style={{ fontSize: "1.4rem", fontWeight: "700", color: "#333", margin: 0 }}>
                            ベンチプレス の重量推移
                        </p>
                        <span style={{
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            color: "#34D399",
                            background: "rgba(52,211,153,0.1)",
                            padding: "0.3rem 0.9rem",
                            borderRadius: "10rem",
                        }}>
                            +22.5kg / 半年
                        </span>
                    </div>

                    <svg viewBox="0 0 400 110" style={{ width: "100%", height: "auto" }}>
                        <defs>
                            <linearGradient id="heroLineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#FF63A4" />
                                <stop offset="100%" stopColor="#FFD873" />
                            </linearGradient>
                        </defs>
                        <line x1="0" y1="95" x2="400" y2="95" stroke="#f0f0f0" strokeWidth="1" />
                        <line x1="0" y1="55" x2="400" y2="55" stroke="#f0f0f0" strokeWidth="1" />
                        <line x1="0" y1="15" x2="400" y2="15" stroke="#f0f0f0" strokeWidth="1" />
                        <polyline
                            points="10,95 75,82 140,78 205,52 270,38 380,12"
                            fill="none"
                            stroke="url(#heroLineGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {[[10, 95], [75, 82], [140, 78], [205, 52], [270, 38], [380, 12]].map(([x, y], i) => (
                            <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#FF63A4" strokeWidth="2" />
                        ))}
                    </svg>

                    <div className="landing-hero-stats" style={{ marginTop: "1.8rem", paddingTop: "1.8rem", borderTop: "1px solid #f5f5f5" }}>
                        {heroStats.map(s => (
                            <div key={s.label}>
                                <p style={{ fontSize: "1.1rem", color: "#9ca3af", margin: "0 0 0.3rem" }}>{s.label}</p>
                                <p style={{ fontSize: "1.8rem", fontWeight: "700", color: "#333", margin: 0 }}>
                                    {s.value}
                                    <span style={{ fontSize: "1.1rem", fontWeight: "400", color: "#9ca3af" }}> {s.unit}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features */}
            <div style={{ padding: "10rem 0 9rem" }}>
                <p style={{ textAlign: "center", fontSize: "1.3rem", fontWeight: "700", color: "#FF63A4", margin: "0 0 0.8rem", letterSpacing: "0.05em" }}>
                    FEATURES
                </p>
                <h2 style={{ textAlign: "center", fontSize: "2.6rem", fontWeight: "700", color: "#222", margin: "0 0 4rem" }}>
                    便利な3つの機能
                </h2>
                <div className="landing-3col-grid">
                    {steps.map(s => (
                        <div key={s.num} style={{ textAlign: "center" }}>
                            <div style={{
                                width: "5.6rem",
                                height: "5.6rem",
                                margin: "0 auto 1.6rem",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2.2rem",
                                fontWeight: "700",
                                color: "white",
                            }}>
                                {s.num}
                            </div>
                            <p style={{ fontSize: "1.7rem", fontWeight: "700", color: "#333", margin: "0 0 0.8rem" }}>
                                {s.title}
                            </p>
                            <p style={{ fontSize: "1.4rem", color: "#6b7280", margin: 10, lineHeight: "1.7" }}>
                                {s.desc}
                            </p>
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
                <h2 style={{ fontSize: "2.2rem", fontWeight: "700", color: "#333", margin: "0 0 2.5rem" }}>
                    継続して成長を実感しよう
                </h2>
                <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap" }}>
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
                    <button
                        onClick={handleDemo}
                        style={{
                            display: "inline-block",
                            padding: "1.2rem 4rem",
                            background: "white",
                            color: "#333",
                            border: "1.5px solid #e5e7eb",
                            borderRadius: "10rem",
                            fontSize: "1.6rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            width: "auto",
                        }}
                    >
                        デモを見る
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
