"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import CalendarView from "../components/calendar-view"
import { allExercises, muscleImages } from "../exercises/page"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const getMuscleImage = (exerciseName) => {
    const found = allExercises.find(ex => ex.name === exerciseName)
    return found ? muscleImages[found.category] : null
}

const VISIBLE_COUNT = 5

const RecordsPage = () => {
    const [grouped, setGrouped] = useState({})
    const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT)
    const sentinelRef = useRef(null)
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
                const g = data.reduce((acc, record) => {
                    const d = new Date(record.createdAt)
                    const isoDate = [
                        d.getFullYear(),
                        String(d.getMonth() + 1).padStart(2, "0"),
                        String(d.getDate()).padStart(2, "0"),
                    ].join("-")
                    if (!acc[isoDate]) acc[isoDate] = {}
                    if (!acc[isoDate][record.exercise]) acc[isoDate][record.exercise] = []
                    acc[isoDate][record.exercise].push({
                        id: record.id,
                        weight: record.weight,
                        reps: record.reps,
                    })
                    return acc
                }, {})
                setGrouped(g)
            })
    }, [router])

    const entries = Object.entries(grouped).reverse()
    const visibleEntries = entries.slice(0, visibleCount)
    const hasMore = visibleCount < entries.length

    // 一番下のsentinelが画面に入ったら、表示件数を増やす（インフィニットローディング）
    useEffect(() => {
        if (!hasMore || !sentinelRef.current) return
        const node = sentinelRef.current
        const observer = new IntersectionObserver((observerEntries) => {
            if (observerEntries[0].isIntersecting) {
                setVisibleCount(prev => prev + VISIBLE_COUNT)
            }
        }, { rootMargin: "300px" })
        observer.observe(node)
        return () => observer.disconnect()
    }, [hasMore])

    return (
        <div>
            <h1 className="mb-[3rem] text-[2.6rem] font-bold text-foreground">記録</h1>

            <CalendarView markedDates={Object.keys(grouped)} />

            <Button
                asChild
                className="mb-[3rem] h-auto w-full justify-center rounded-[1.2rem] bg-gradient-to-br from-[#FF63A4] to-[#FFD873] py-[1.4rem] text-[1.6rem] font-bold text-white hover:opacity-90"
            >
                <Link href="/menu/create">
                    <Plus size={19} strokeWidth={2.5} />
                    記録を追加
                </Link>
            </Button>

            {entries.length > 0 ? (
                <>
                    {visibleEntries.map(([isoDate, exercises]) => {
                        const exerciseCount = Object.keys(exercises).length
                        const setCount = Object.values(exercises).reduce((sum, sets) => sum + sets.length, 0)
                        const displayDate = new Date(`${isoDate}T12:00:00`).toLocaleDateString("ja-JP", {
                            year: "numeric", month: "long", day: "numeric", weekday: "short",
                        })

                        return (
                            <div key={isoDate} className="mb-[2.2rem]">
                                <Link href={`/menu/create?date=${isoDate}`}>
                                    <Card className="gap-[1.2rem] rounded-[1.6rem] px-[2rem] py-[1.8rem] shadow-md ring-0 transition-shadow hover:shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[1.4rem] font-bold text-foreground/80">
                                                {displayDate}
                                            </p>
                                            <p className="text-[1.4rem] font-bold text-foreground/80">
                                                {exerciseCount}種目 · {setCount}セット
                                            </p>
                                        </div>

                                        {Object.entries(exercises).map(([exercise, sets], i, arr) => (
                                            <div
                                                key={exercise}
                                                className={`flex items-start justify-between gap-[1rem] ${i < arr.length - 1 ? "border-b border-border pb-[1.2rem]" : ""}`}
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
                                                    <p className="text-[1.5rem] font-semibold text-foreground">
                                                        {exercise}
                                                    </p>
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
                            </div>
                        )
                    })}

                    {hasMore && (
                        <div ref={sentinelRef} className="flex items-center justify-center py-[2rem]">
                            <div className="size-[1.8rem] animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
                        </div>
                    )}
                </>
            ) : (
                <div className="rounded-[1.5rem] border-2 border-dashed border-border py-[6rem] text-center">
                    <p className="mb-[1rem] text-[3rem]">🏋️</p>
                    <p className="text-[1.6rem] text-[#383c42]">記録がありません</p>
                </div>
            )}
        </div>
    )
}

export default RecordsPage
