"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, ChevronRight, CalendarCheck, Dumbbell } from "lucide-react"
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

                const groups = {}
                data.forEach(record => {
                    const key = record.groupId || `single-${record.id}`
                    if (!groups[key]) groups[key] = { key, createdAt: record.createdAt, items: [] }
                    groups[key].items.push(record)
                    if (new Date(record.createdAt) < new Date(groups[key].createdAt)) {
                        groups[key].createdAt = record.createdAt
                    }
                })

                setRecent(
                    Object.values(groups)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 3)
                )
            })
    }, [router])

    return (
        <AuthGuard>
            <div className="flex flex-col gap-[2.5rem]">
                {/* Hero */}
                <div className="rounded-[2rem] border border-border bg-card px-[2.5rem] py-[3rem]">
                    <p className="mb-[0.4rem] text-[1.4rem] text-muted-foreground">
                        おかえりなさい！
                    </p>
                    <h1 className="mb-[2rem] text-[2.8rem] leading-[1.3] font-bold">
                        今日も<br />鍛えていこう 💪
                    </h1>
                    <Button
                        asChild
                        className="h-auto rounded-full px-[2.5rem] py-[1rem] text-[1.5rem] font-semibold"
                    >
                        <Link href="/menu/create">
                            <Plus className="size-[1.8rem]" strokeWidth={2.5} />
                            今日の記録を追加
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-[1.5rem]">
                    <Card className="gap-0 rounded-[1.5rem] px-[1.8rem] py-[2rem]">
                        <div className="mb-[1.4rem] flex size-[4rem] items-center justify-center rounded-[1.1rem] bg-primary/10">
                            <CalendarCheck className="size-[2rem] text-primary" />
                        </div>
                        <p className="mb-[0.6rem] text-[1.2rem] text-muted-foreground">累計記録</p>
                        <p>
                            <span className="text-[3rem] font-bold text-primary">{total}</span>
                            <span className="ml-[0.4rem] text-[1.4rem] text-muted-foreground">日</span>
                        </p>
                    </Card>
                    <Card className="gap-0 rounded-[1.5rem] px-[1.8rem] py-[2rem]">
                        <div className="mb-[1.4rem] flex size-[4rem] items-center justify-center rounded-[1.1rem] bg-primary/10">
                            <Dumbbell className="size-[2rem] text-primary" />
                        </div>
                        <p className="mb-[0.6rem] text-[1.2rem] text-muted-foreground">種目数</p>
                        <p>
                            <span className="text-[3rem] font-bold text-primary">
                                {new Set(recent.flatMap(g => g.items.map(item => item.exercise))).size}
                            </span>
                            <span className="ml-[0.4rem] text-[1.4rem] text-muted-foreground">種</span>
                        </p>
                    </Card>
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
                            <ChevronRight size={15} />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-[1rem]">
                        {recent.map(group => {
                            const d = new Date(group.createdAt)
                            const isoDate = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-")

                            const byExercise = group.items.reduce((acc, item) => {
                                if (!acc[item.exercise]) acc[item.exercise] = []
                                acc[item.exercise].push({ weight: item.weight, reps: item.reps })
                                return acc
                            }, {})
                            const exerciseCount = Object.keys(byExercise).length
                            const setCount = group.items.length

                            return (
                                <Link key={group.key} href={`/records/${isoDate}`}>
                                    <Card className="gap-[1.2rem] rounded-[1.5rem] px-[2rem] py-[1.8rem] transition-colors hover:ring-primary/30">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[1.4rem] font-bold text-foreground/80">
                                                {d.toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                            <p className="text-[1.2rem] text-muted-foreground">
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
