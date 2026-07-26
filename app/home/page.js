"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, ChevronRight, Dumbbell } from "lucide-react"
import AuthGuard from "./auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { allExercises, muscleImages } from "../exercises/page"

const getMuscleImage = (exerciseName) => {
    const found = allExercises.find(ex => ex.name === exerciseName)
    return found ? muscleImages[found.category] : null
}

const HomePage = () => {
    const [total, setTotal] = useState(0)
    const [streak, setStreak] = useState(0)
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

                const uniqueDays = new Set(data.map(record => {
                    const d = new Date(record.createdAt)
                    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
                }))
                setTotal(uniqueDays.size)

                // 前日までの連続記録日数（今日の分はまだ数えない）
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const yesterday = new Date(today)
                yesterday.setDate(yesterday.getDate() - 1)

                const pastDays = [...uniqueDays]
                    .map(key => {
                        const [y, m, d] = key.split("-").map(Number)
                        return new Date(y, m, d)
                    })
                    .filter(d => d.getTime() !== today.getTime())
                    .sort((a, b) => a - b)

                let currentStreak = 0
                if (pastDays.length && pastDays[pastDays.length - 1].getTime() === yesterday.getTime()) {
                    currentStreak = 1
                    for (let i = pastDays.length - 2; i >= 0; i--) {
                        const diffDays = Math.round((pastDays[i + 1] - pastDays[i]) / 86400000)
                        if (diffDays !== 1) break
                        currentStreak++
                    }
                }
                setStreak(currentStreak)

                // 日付ごとにグルーピング（recordsタブと同じ単位）
                const byDate = data.reduce((acc, record) => {
                    const d = new Date(record.createdAt)
                    const isoDate = [
                        d.getFullYear(),
                        String(d.getMonth() + 1).padStart(2, "0"),
                        String(d.getDate()).padStart(2, "0"),
                    ].join("-")
                    if (!acc[isoDate]) acc[isoDate] = []
                    acc[isoDate].push(record)
                    return acc
                }, {})

                setRecent(
                    Object.entries(byDate)
                        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                        .slice(0, 3)
                        .map(([isoDate, items]) => ({ isoDate, items }))
                )
            })
    }, [router])

    return (
        <AuthGuard>
            <div className="flex flex-col gap-[2.5rem]">
                {/* Hero + Stats */}
                <div className="rounded-[2rem] bg-card px-[2.5rem] py-[3rem] shadow-md">
                    <div className="mb-[1.2rem] flex size-[3.6rem] items-center justify-center rounded-full bg-primary">
                        <Dumbbell className="size-[1.9rem] text-white" />
                    </div>
                    <h1 className="mb-[2rem] text-[2.8rem] leading-[1.3] font-bold">
                        今日も<br />鍛えていこう
                    </h1>
                    <Button
                        asChild
                        className="h-auto rounded-full bg-gradient-to-br from-[#FF63A4] to-[#FFD873] px-[2.5rem] py-[1rem] text-[1.5rem] font-semibold text-white hover:opacity-90"
                    >
                        <Link href="/menu/create">
                            <Plus className="size-[1.8rem]" strokeWidth={2.5} />
                            今日の記録を追加
                        </Link>
                    </Button>

                    <div className="mt-[2.4rem] grid grid-cols-2 gap-[1.5rem] border-t border-border pt-[2rem]">
                        <div>
                            <p className="mb-[0.3rem] text-[1.2rem] text-[#383c42]">累計記録</p>
                            <p className="text-[2.2rem] font-bold text-foreground">
                                {total}
                                <span className="ml-[0.3rem] text-[1.3rem] font-normal text-muted-foreground">日</span>
                            </p>
                        </div>
                        <div>
                            <p className="mb-[0.3rem] text-[1.2rem] text-[#383c42]">連続記録日数</p>
                            <p className="text-[2.2rem] font-bold text-foreground">
                                {streak}
                                <span className="ml-[0.3rem] text-[1.3rem] font-normal text-muted-foreground">日</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Records */}
                <div>
                    <div className="mb-[1.5rem] flex items-center justify-between">
                        <h2 className="text-[1.8rem] font-bold">最近の記録</h2>
                        <Link
                            href="/records"
                            className="flex items-center gap-[0.2rem] text-[1.3rem] font-medium text-primary"
                        >
                            すべて見る
                            <ChevronRight size={35} />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-[1rem]">
                        {recent.map(({ isoDate, items }) => {
                            const d = new Date(`${isoDate}T12:00:00`)

                            const byExercise = items.reduce((acc, item) => {
                                if (!acc[item.exercise]) acc[item.exercise] = []
                                acc[item.exercise].push({ weight: item.weight, reps: item.reps })
                                return acc
                            }, {})
                            const exerciseCount = Object.keys(byExercise).length
                            const setCount = items.length

                            return (
                                <Link key={isoDate} href={`/menu/create?date=${isoDate}`}>
                                    <Card className="gap-[1.2rem] rounded-[1.5rem] px-[2rem] py-[1.8rem] shadow-md ring-0 transition-shadow hover:shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[1.4rem] font-bold text-foreground/80">
                                                {d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", weekday: "short" })}
                                            </p>
                                            <p className="text-[1.4rem] font-bold text-foreground/80">
                                                {exerciseCount}種目 · {setCount}セット
                                            </p>
                                        </div>

                                        {Object.entries(byExercise).map(([exercise, sets], i) => (
                                            <div
                                                key={exercise}
                                                className={`flex items-start justify-between gap-[1rem] ${i > 0 ? "border-t border-border pt-[1.2rem]" : ""}`}
                                            >
                                                <div className="flex shrink-0 items-center gap-[1.2rem]">
                                                    <div className="flex size-[4.8rem] shrink-0 items-center justify-center overflow-hidden rounded-[1.3rem] bg-primary/10 text-[1.4rem]">
                                                        {getMuscleImage(exercise) ? (
                                                            <img
                                                                src={getMuscleImage(exercise)}
                                                                alt={exercise}
                                                                className="h-[78%] w-[78%] object-contain"
                                                            />
                                                        ) : "💪"}
                                                    </div>
                                                    <p className="text-[1.5rem] font-semibold">{exercise}</p>
                                                </div>
                                                <div className="flex flex-wrap justify-end gap-[0.6rem]">
                                                    {sets.map((set, j) => (
                                                        <Badge
                                                            key={j}
                                                            variant="outline"
                                                            className="h-auto whitespace-nowrap rounded-full border-primary/20 bg-primary/10 px-[0.9rem] py-[0.3rem] text-[1.3rem] font-semibold text-primary"
                                                        >
                                                            {set.weight}kg×{set.reps}回
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </Card>
                                </Link>
                            )
                        })}

                        {recent.length === 0 && (
                            <div className="rounded-[1.5rem] border-2 border-dashed border-border py-[5rem] text-center">
                                <p className="mb-[1rem] text-[3rem]">🏋️</p>
                                <p className="mb-[1.5rem] text-[1.6rem] text-muted-foreground">
                                    まだ記録がありません
                                </p>
                                <Link href="/menu/create" className="text-[1.4rem] font-medium text-primary">
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
