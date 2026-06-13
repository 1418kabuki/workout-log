"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, UserPlus } from "lucide-react"
import Link from "next/link"

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`/api/user/register`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })
            const jsonData = await response.json()
            alert(jsonData.message)
            router.push("/user/login")
        } catch {
            alert("ユーザー登録失敗")
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
                    一緒に記録を始めよう 💪
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
                    新規登録
                </h1>

                <form onSubmit={handleSubmit}>
                    {/* 名前 */}
                    <div style={{ marginBottom: "1.8rem" }}>
                        <label style={{
                            fontSize: "1.3rem",
                            fontWeight: "600",
                            color: "#555",
                            display: "block",
                            marginBottom: "0.8rem",
                        }}>
                            名前
                        </label>
                        <div style={{ position: "relative" }}>
                            <User size={16} style={{
                                position: "absolute",
                                left: "1.4rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9ca3af",
                                pointerEvents: "none",
                            }} />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="お名前を入力"
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

                    {/* 登録ボタン */}
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
                        <UserPlus size={18} />
                        登録する
                    </button>
                </form>

                {/* ログインリンク */}
                <p style={{
                    textAlign: "center",
                    marginTop: "2rem",
                    fontSize: "1.3rem",
                    color: "#9ca3af",
                    marginBottom: 0,
                }}>
                    すでにアカウントをお持ちの方は
                    <Link
                        href="/user/login"
                        style={{
                            color: "#FF63A4",
                            fontWeight: "600",
                            marginLeft: "0.5rem",
                            textDecoration: "none",
                        }}
                    >
                        ログイン
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
