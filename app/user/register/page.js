"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, UserPlus } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const inputClass = "mb-0 w-full rounded-[1rem] border border-border py-[1.2rem] pl-[4rem] pr-[1.4rem] text-[1.5rem] outline-none box-border focus:ring-2 focus:ring-ring/50 focus:border-ring"

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
        <div className="flex min-h-[75vh] flex-col items-center justify-center">
            {/* ロゴ */}
            <div className="mb-[3rem] text-center">
                <p className="m-0 bg-gradient-to-br from-[#FF63A4] to-[#FFD873] bg-clip-text text-[3rem] font-bold text-transparent">
                    WorkoutLog
                </p>
                <p className="mt-[0.8rem] text-[1.4rem] text-[#383c42]">
                    一緒に記録を始めよう 💪
                </p>
            </div>

            {/* カード */}
            <Card className="w-full max-w-[420px] gap-0 rounded-[2rem] py-[3.5rem] px-[3rem] shadow-md ring-0">
                <h1 className="mb-[2.5rem] text-center text-[2.2rem] font-bold leading-none text-foreground">
                    新規登録
                </h1>

                <form onSubmit={handleSubmit}>
                    {/* 名前 */}
                    <div className="mb-[1.8rem]">
                        <label className="mb-[0.8rem] block text-[1.3rem] font-semibold text-[#383c42]">
                            名前
                        </label>
                        <div className="relative">
                            <User size={16} className="pointer-events-none absolute left-[1.4rem] top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="お名前を入力"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* メールアドレス */}
                    <div className="mb-[1.8rem]">
                        <label className="mb-[0.8rem] block text-[1.3rem] font-semibold text-[#383c42]">
                            メールアドレス
                        </label>
                        <div className="relative">
                            <Mail size={16} className="pointer-events-none absolute left-[1.4rem] top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                placeholder="example@email.com"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* パスワード */}
                    <div className="mb-[2.5rem]">
                        <label className="mb-[0.8rem] block text-[1.3rem] font-semibold text-[#383c42]">
                            パスワード
                        </label>
                        <div className="relative">
                            <Lock size={16} className="pointer-events-none absolute left-[1.4rem] top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="パスワードを入力"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* 登録ボタン */}
                    <Button
                        type="submit"
                        className="h-auto w-full justify-center rounded-[1rem] bg-gradient-to-br from-[#FF63A4] to-[#FFD873] py-[1.3rem] text-[1.6rem] font-semibold text-white hover:opacity-90"
                    >
                        <UserPlus size={18} />
                        登録する
                    </Button>
                </form>

                {/* ログインリンク */}
                <p className="mb-0 mt-[2rem] text-center text-[1.3rem] text-[#383c42]">
                    すでにアカウントをお持ちの方は
                    <Link href="/user/login" className="ml-[0.5rem] font-semibold text-primary no-underline">
                        ログイン
                    </Link>
                </p>
            </Card>
        </div>
    )
}

export default Register
