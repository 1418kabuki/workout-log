"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, LogIn } from "lucide-react"
import Link from "next/link"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`/api/user/login`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            const jsonData = await response.json()

            if (jsonData.token) {
                localStorage.setItem("token", jsonData.token)
                window.location.href = "/"
            } else {
                alert(jsonData.message)
            }
        } catch {
            alert("ログイン失敗")
        }
    }

    return (
        <div style={{
            minHeight: "75vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            {/* ロゴ */}
            <div style={{ marginBottom: "3rem", textAlign: "center" }}>
                <p style={{
                    fontSize: "3rem",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    margin: 0,
                }}>
                    WorkoutLog
                </p>
                <p style={{ fontSize: "1.4rem", color: "#9ca3af", margin: "0.8rem 0 0" }}>
                    今日も鍛えていこう 💪
                </p>
            </div>

            {/* カード */}
            <div style={{
                background: "white",
                borderRadius: "2rem",
                padding: "3.5rem 3rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                width: "100%",
                maxWidth: "420px",
                border: "1px solid #f0f0f0",
            }}>
                <h1 style={{
                    fontSize: "2.2rem",
                    fontWeight: "700",
                    color: "#333",
                    margin: "0 0 2.5rem",
                    textAlign: "center",
                    lineHeight: 1,
                }}>
                    ログイン
                </h1>

                <form onSubmit={handleSubmit}>
                    {/* メールアドレス */}
                    <div style={{ marginBottom: "1.8rem" }}>
                        <label style={{
                            fontSize: "1.3rem",
                            fontWeight: "600",
                            color: "#555",
                            display: "block",
                            marginBottom: "0.8rem",
                        }}>
                            メールアドレス
                        </label>
                        <div style={{ position: "relative" }}>
                            <Mail size={16} style={{
                                position: "absolute",
                                left: "1.4rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9ca3af",
                                pointerEvents: "none",
                            }} />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                placeholder="example@email.com"
                                required
                                style={{
                                    width: "100%",
                                    padding: "1.2rem 1.4rem 1.2rem 4rem",
                                    border: "1.5px solid #e5e7eb",
                                    borderRadius: "1rem",
                                    fontSize: "1.5rem",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    marginBottom: 0,
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>
                    </div>

                    {/* パスワード */}
                    <div style={{ marginBottom: "2.5rem" }}>
                        <label style={{
                            fontSize: "1.3rem",
                            fontWeight: "600",
                            color: "#555",
                            display: "block",
                            marginBottom: "0.8rem",
                        }}>
                            パスワード
                        </label>
                        <div style={{ position: "relative" }}>
                            <Lock size={16} style={{
                                position: "absolute",
                                left: "1.4rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9ca3af",
                                pointerEvents: "none",
                            }} />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="パスワードを入力"
                                required
                                style={{
                                    width: "100%",
                                    padding: "1.2rem 1.4rem 1.2rem 4rem",
                                    border: "1.5px solid #e5e7eb",
                                    borderRadius: "1rem",
                                    fontSize: "1.5rem",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    marginBottom: 0,
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>
                    </div>

                    {/* ログインボタン */}
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "1.3rem",
                            background: "linear-gradient(135deg, #FF63A4, #FFD873)",
                            color: "white",
                            border: "none",
                            borderRadius: "1rem",
                            fontSize: "1.6rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.8rem",
                        }}
                    >
                        <LogIn size={18} />
                        ログイン
                    </button>
                </form>

                {/* 登録リンク */}
                <p style={{
                    textAlign: "center",
                    marginTop: "2rem",
                    fontSize: "1.3rem",
                    color: "#9ca3af",
                    marginBottom: 0,
                }}>
                    アカウントをお持ちでない方は
                    <Link
                        href="/user/register"
                        style={{
                            color: "#FF63A4",
                            fontWeight: "600",
                            marginLeft: "0.5rem",
                            textDecoration: "none",
                        }}
                    >
                        新規登録
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
